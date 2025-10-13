import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import {
	type LegacyV1NoTrailingPunctuationInSubjectLinesConfiguration,
	type LegacyV1RawNoTrailingPunctuationInSubjectLinesConfiguration,
	legacyV1NoTrailingPunctuationInSubjectLinesConfigurationSchema,
} from "#legacy-v1/rules/NoTrailingPunctuationInSubjectLines/LegacyV1NoTrailingPunctuationInSubjectLinesConfiguration.ts"
import { count } from "#legacy-v1/utilities/StringUtilities.ts"

describe.each`
	rawSuffixes              | expectedSuffixes
	${""}                    | ${[]}
	${"  "}                  | ${[]}
	${"."}                   | ${["."]}
	${". , : ; - ="}         | ${[".", ",", ":", ";", "-", "="]}
	${" ?  ! "}              | ${["?", "!"]}
	${"  + - * /"}           | ${["+", "-", "*", "/"]}
	${"... ?? !! && || // "} | ${["...", "??", "!!", "&&", "||", "//"]}
`(
	"a whitelist of suffixes from a valid string of $rawSuffixes",
	(testRow: {
		readonly rawSuffixes: string
		readonly expectedSuffixes: ReadonlyArray<string>
	}) => {
		const { rawSuffixes, expectedSuffixes } = testRow

		it(`includes ${formatSuffixes(expectedSuffixes)}`, () => {
			const { whitelist: actualSuffixes } = parseConfiguration({
				whitelist: rawSuffixes,
			})

			expect(actualSuffixes).toStrictEqual(expectedSuffixes)
		})
	},
)

describe.each`
	rawSuffixes                | expectedErrorMessage
	${". . ,"}                 | ${"Input parameter 'no-trailing-punctuation-in-subject-lines--whitelist' must not contain duplicates: ."}
	${", . ! : . ,"}           | ${"Input parameter 'no-trailing-punctuation-in-subject-lines--whitelist' must not contain duplicates: , ."}
	${"- + ! ? : : + + . , !"} | ${"Input parameter 'no-trailing-punctuation-in-subject-lines--whitelist' must not contain duplicates: + ! :"}
`(
	"a whitelist of suffixes from an invalid string of $rawSuffixes",
	(testRow: {
		readonly rawSuffixes: string
		readonly expectedErrorMessage: string
	}) => {
		const { rawSuffixes, expectedErrorMessage } = testRow

		it(`raises an error with a message of '${expectedErrorMessage}'`, () => {
			expect(() => parseConfiguration({ whitelist: rawSuffixes })).toThrow(
				expectedErrorMessage,
			)
		})
	},
)

function parseConfiguration(
	rawConfiguration: LegacyV1RawNoTrailingPunctuationInSubjectLinesConfiguration,
): LegacyV1NoTrailingPunctuationInSubjectLinesConfiguration {
	return parse(
		legacyV1NoTrailingPunctuationInSubjectLinesConfigurationSchema,
		rawConfiguration,
	)
}

function formatSuffixes(suffixes: ReadonlyArray<string>): string {
	return suffixes.length === 0
		? "no suffixes"
		: `${count(suffixes, "suffix", "suffixes")}: ${suffixes.join(" ")}`
}
