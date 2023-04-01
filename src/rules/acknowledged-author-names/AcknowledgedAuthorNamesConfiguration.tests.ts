import type {
	AcknowledgedAuthorNamesConfiguration,
	RawAcknowledgedAuthorNamesConfiguration,
} from "+rules"
import { acknowledgedAuthorNamesConfigurationSchema } from "+rules"
import { count } from "+utilities"

describe.each`
	rawPatterns              | expectedPatterns
	${".+"}                  | ${[".+"]}
	${" .+\\s.+ "}           | ${[".+\\s.+"]}
	${"\\w+\\.\\w+ .+\\s.+"} | ${["\\w+\\.\\w+", ".+\\s.+"]}
`(
	"a list of patterns from a valid string of $rawPatterns",
	(testRow: {
		readonly rawPatterns: string
		readonly expectedPatterns: ReadonlyArray<string>
	}) => {
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
	rawPatterns                          | expectedErrorMessage
	${""}                                | ${"must specify at least one value"}
	${"  "}                              | ${"must specify at least one value"}
	${".+ .+"}                           | ${"must not contain duplicates: .+"}
	${"\\w+\\.\\w+ .+\\s.+ \\w+\\.\\w+"} | ${"must not contain duplicates: \\\\w+\\\\.\\\\w+"}
`(
	"a list of patterns from an invalid string of $rawPatterns",
	(testRow: {
		readonly rawPatterns: string
		readonly expectedErrorMessage: string
	}) => {
		const { rawPatterns, expectedErrorMessage } = testRow

		it(`raises an error with a message of '${expectedErrorMessage}'`, () => {
			expect(() => parseConfiguration({ patterns: rawPatterns })).toThrow(
				expectedErrorMessage,
			)
		})

		it(`raises an error that points out the name of the incorrect parameter`, () => {
			expect(() => parseConfiguration({ patterns: rawPatterns })).toThrow(
				"acknowledged-author-names--patterns",
			)
		})
	},
)

function parseConfiguration(
	rawConfiguration: RawAcknowledgedAuthorNamesConfiguration,
): AcknowledgedAuthorNamesConfiguration {
	return acknowledgedAuthorNamesConfigurationSchema.parse(rawConfiguration)
}

function formatPatterns(patterns: ReadonlyArray<string>): string {
	return `${count(patterns, "pattern", "patterns")}: ${patterns.join(", ")}`
}
