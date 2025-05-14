import {
	type LimitLengthOfBodyLinesConfiguration,
	type RawLimitLengthOfBodyLinesConfiguration,
	limitLengthOfBodyLinesConfigurationSchema,
} from "+rules/LimitLengthOfBodyLines/LimitLengthOfBodyLinesConfiguration"
import { parse } from "valibot"
import { describe, expect, it } from "vitest"

describe.each`
	rawMaximumCharacters | expectedMaximumCharacters
	${"1"}               | ${1}
	${"48"}              | ${48}
	${"72"}              | ${72}
	${"80"}              | ${80}
	${"160"}             | ${160}
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
	${""}                | ${"Input parameter 'limit-length-of-body-lines--max-characters' must be a positive integer:"}
	${" "}               | ${"Input parameter 'limit-length-of-body-lines--max-characters' must be a positive integer:"}
	${"."}               | ${"Input parameter 'limit-length-of-body-lines--max-characters' must be a positive integer: ."}
	${"q"}               | ${"Input parameter 'limit-length-of-body-lines--max-characters' must be a positive integer: q"}
	${"-1"}              | ${"Input parameter 'limit-length-of-body-lines--max-characters' must be a positive integer: -1"}
	${"0"}               | ${"Input parameter 'limit-length-of-body-lines--max-characters' must be a positive integer: 0"}
	${"54.5"}            | ${"Input parameter 'limit-length-of-body-lines--max-characters' must be a positive integer: 54.5"}
	${"7abc"}            | ${"Input parameter 'limit-length-of-body-lines--max-characters' must be a positive integer: 7abc"}
	${"1e9"}             | ${"Input parameter 'limit-length-of-body-lines--max-characters' must be a positive integer: 1e9"}
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
	rawConfiguration: RawLimitLengthOfBodyLinesConfiguration,
): LimitLengthOfBodyLinesConfiguration {
	return parse(limitLengthOfBodyLinesConfigurationSchema, rawConfiguration)
}
