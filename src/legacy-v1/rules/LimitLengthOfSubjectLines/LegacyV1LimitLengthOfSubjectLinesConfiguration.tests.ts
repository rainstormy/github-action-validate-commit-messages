import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import {
	type LegacyV1LimitLengthOfSubjectLinesConfiguration,
	type LegacyV1RawLimitLengthOfSubjectLinesConfiguration,
	legacyV1LimitLengthOfSubjectLinesConfigurationSchema,
} from "#legacy-v1/rules/LimitLengthOfSubjectLines/LegacyV1LimitLengthOfSubjectLinesConfiguration.ts"

describe.each`
	rawMaximumCharacters | expectedMaximumCharacters
	${"1"}               | ${1}
	${"36"}              | ${36}
	${"50"}              | ${50}
	${"72"}              | ${72}
	${"100"}             | ${100}
`(
	"a maximum number of characters from a valid string of $rawMaximumCharacters",
	(testRow: {
		readonly rawMaximumCharacters: string
		readonly expectedMaximumCharacters: number
	}) => {
		const { rawMaximumCharacters, expectedMaximumCharacters } = testRow

		const { maximumCharacters: actualMaximumCharacters } = parseConfiguration({
			maximumCharacters: rawMaximumCharacters,
		})

		it(`has a limit of ${expectedMaximumCharacters} characters`, () => {
			expect(actualMaximumCharacters).toStrictEqual(expectedMaximumCharacters)
		})
	},
)

describe.each`
	rawMaximumCharacters | expectedErrorMessage
	${""}                | ${"Input parameter 'limit-length-of-subject-lines--max-characters' must be a positive integer:"}
	${" "}               | ${"Input parameter 'limit-length-of-subject-lines--max-characters' must be a positive integer:"}
	${"."}               | ${"Input parameter 'limit-length-of-subject-lines--max-characters' must be a positive integer: ."}
	${"q"}               | ${"Input parameter 'limit-length-of-subject-lines--max-characters' must be a positive integer: q"}
	${"-1"}              | ${"Input parameter 'limit-length-of-subject-lines--max-characters' must be a positive integer: -1"}
	${"0"}               | ${"Input parameter 'limit-length-of-subject-lines--max-characters' must be a positive integer: 0"}
	${"54.5"}            | ${"Input parameter 'limit-length-of-subject-lines--max-characters' must be a positive integer: 54.5"}
	${"7abc"}            | ${"Input parameter 'limit-length-of-subject-lines--max-characters' must be a positive integer: 7abc"}
	${"1e9"}             | ${"Input parameter 'limit-length-of-subject-lines--max-characters' must be a positive integer: 1e9"}
`(
	"a maximum number of characters from an invalid string of $rawMaximumCharacters",
	(testRow: {
		readonly rawMaximumCharacters: string
		readonly expectedErrorMessage: string
	}) => {
		const { rawMaximumCharacters, expectedErrorMessage } = testRow

		it(`raises an error with a message of '${expectedErrorMessage}'`, () => {
			expect(() =>
				parseConfiguration({ maximumCharacters: rawMaximumCharacters }),
			).toThrow(expectedErrorMessage)
		})
	},
)

function parseConfiguration(
	rawConfiguration: LegacyV1RawLimitLengthOfSubjectLinesConfiguration,
): LegacyV1LimitLengthOfSubjectLinesConfiguration {
	return parse(
		legacyV1LimitLengthOfSubjectLinesConfigurationSchema,
		rawConfiguration,
	)
}
