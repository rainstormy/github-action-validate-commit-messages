import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import {
	type LegacyV1AcknowledgedAuthorNamesConfiguration,
	type LegacyV1RawAcknowledgedAuthorNamesConfiguration,
	legacyV1AcknowledgedAuthorNamesConfigurationSchema,
} from "#legacy-v1/rules/AcknowledgedAuthorNames/LegacyV1AcknowledgedAuthorNamesConfiguration.ts"
import { count } from "#legacy-v1/utilities/StringUtilities.ts"

describe.each`
	rawPatterns                    | expectedPatterns
	${".+"}                        | ${[".+"]}
	${String.raw` .+\s.+ `}        | ${[String.raw`.+\s.+`]}
	${String.raw`\w+\.\w+ .+\s.+`} | ${[String.raw`\w+\.\w+`, String.raw`.+\s.+`]}
`(
	"a list of patterns from a valid string of $rawPatterns",
	(testRow: { rawPatterns: string; expectedPatterns: Array<string> }) => {
		const { rawPatterns, expectedPatterns } = testRow

		it(`includes ${formatPatterns(expectedPatterns)}`, () => {
			const { patterns: actualPatterns } = parseConfiguration({
				patterns: rawPatterns,
			})

			expect(actualPatterns).toStrictEqual(expectedPatterns)
		})
	},
)

describe.each`
	rawPatterns                             | expectedErrorMessage
	${""}                                   | ${"Input parameter 'acknowledged-author-names--patterns' must specify at least one value"}
	${"  "}                                 | ${"Input parameter 'acknowledged-author-names--patterns' must specify at least one value"}
	${".+ .+"}                              | ${"Input parameter 'acknowledged-author-names--patterns' must not contain duplicates: .+"}
	${String.raw`\w+\.\w+ .+\s.+ \w+\.\w+`} | ${String.raw`Input parameter 'acknowledged-author-names--patterns' must not contain duplicates: \w+\.\w+`}
`(
	"a list of patterns from an invalid string of $rawPatterns",
	(testRow: { rawPatterns: string; expectedErrorMessage: string }) => {
		const { rawPatterns, expectedErrorMessage } = testRow

		it(`raises an error with a message of '${expectedErrorMessage}'`, () => {
			expect(() => parseConfiguration({ patterns: rawPatterns })).toThrow(expectedErrorMessage)
		})
	},
)

function parseConfiguration(
	rawConfiguration: LegacyV1RawAcknowledgedAuthorNamesConfiguration,
): LegacyV1AcknowledgedAuthorNamesConfiguration {
	return parse(legacyV1AcknowledgedAuthorNamesConfigurationSchema, rawConfiguration)
}

function formatPatterns(patterns: Array<string>): string {
	return `${count(patterns, "pattern", "patterns")}: ${patterns.join(", ")}`
}
