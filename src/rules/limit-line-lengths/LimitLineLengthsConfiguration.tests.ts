import type {
	LimitLineLengthsConfiguration,
	RawLimitLineLengthsConfiguration,
} from "+rules"
import { limitLineLengthsConfigurationSchema } from "+rules"

describe.each`
	rawMaximumCharactersInSubjectLine | rawMaximumCharactersInBodyLine | expectedMaximumCharactersInSubjectLine | expectedMaximumCharactersInBodyLine
	${""}                             | ${" "}                         | ${0}                                   | ${0}
	${"0"}                            | ${"0"}                         | ${0}                                   | ${0}
	${"36"}                           | ${"48"}                        | ${36}                                  | ${48}
	${"50"}                           | ${"72"}                        | ${50}                                  | ${72}
	${"72"}                           | ${"80"}                        | ${72}                                  | ${80}
	${"100"}                          | ${"160"}                       | ${100}                                 | ${160}
`(
	"two maximum numbers of characters in the subject line and the body line from a valid pair of strings of $rawMaximumCharactersInSubjectLine and $rawMaximumCharactersInBodyLine",
	(testRow: {
		readonly rawMaximumCharactersInSubjectLine: string
		readonly rawMaximumCharactersInBodyLine: string
		readonly expectedMaximumCharactersInSubjectLine: number
		readonly expectedMaximumCharactersInBodyLine: number
	}) => {
		const {
			rawMaximumCharactersInSubjectLine,
			rawMaximumCharactersInBodyLine,
			expectedMaximumCharactersInSubjectLine,
			expectedMaximumCharactersInBodyLine,
		} = testRow

		const {
			maximumCharactersInSubjectLine: actualMaximumCharactersInSubjectLine,
			maximumCharactersInBodyLine: actualMaximumCharactersInBodyLine,
		} = parseConfiguration({
			maximumCharactersInSubjectLine: rawMaximumCharactersInSubjectLine,
			maximumCharactersInBodyLine: rawMaximumCharactersInBodyLine,
		})

		it(`has a limit of ${expectedMaximumCharactersInSubjectLine} characters in the subject line`, () => {
			expect(actualMaximumCharactersInSubjectLine).toStrictEqual(
				expectedMaximumCharactersInSubjectLine,
			)
		})

		it(`has a limit of ${expectedMaximumCharactersInBodyLine} characters in the body line`, () => {
			expect(actualMaximumCharactersInBodyLine).toStrictEqual(
				expectedMaximumCharactersInBodyLine,
			)
		})
	},
)

describe.each`
	rawMaximumCharactersInSubjectLine | rawMaximumCharactersInBodyLine | expectedErrorMessage
	${"-1"}                           | ${"72"}                        | ${"must be a non-negative integer"}
	${"50"}                           | ${"-1"}                        | ${"must be a non-negative integer"}
	${"54.5"}                         | ${"72"}                        | ${"must be a non-negative integer"}
	${"1abc"}                         | ${"72"}                        | ${"must be a non-negative integer"}
	${"50"}                           | ${"77.5"}                      | ${"must be a non-negative integer"}
	${"50"}                           | ${"7xyz"}                      | ${"must be a non-negative integer"}
`(
	"two maximum numbers of characters in the subject line and the body line from an invalid pair of strings of $rawMaximumCharactersInSubjectLine and $rawMaximumCharactersInBodyLine",
	(testRow: {
		readonly rawMaximumCharactersInSubjectLine: string
		readonly rawMaximumCharactersInBodyLine: string
		readonly expectedErrorMessage: string
	}) => {
		const {
			rawMaximumCharactersInSubjectLine,
			rawMaximumCharactersInBodyLine,
			expectedErrorMessage,
		} = testRow

		it(`raises an error: '${expectedErrorMessage}'`, () => {
			expect(() =>
				parseConfiguration({
					maximumCharactersInSubjectLine: rawMaximumCharactersInSubjectLine,
					maximumCharactersInBodyLine: rawMaximumCharactersInBodyLine,
				}),
			).toThrow(expectedErrorMessage)
		})
	},
)

function parseConfiguration(
	rawConfiguration: RawLimitLineLengthsConfiguration,
): LimitLineLengthsConfiguration {
	return limitLineLengthsConfigurationSchema.parse(rawConfiguration)
}
