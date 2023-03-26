import type {
	AcknowledgedCommitterEmailAddressesConfiguration,
	RawAcknowledgedCommitterEmailAddressesConfiguration,
} from "+rules"
import { acknowledgedCommitterEmailAddressesConfigurationSchema } from "+rules"
import { count } from "+utilities"

describe.each`
	rawPatterns                                                                 | expectedPatterns
	${"\\d+\\+.+@users\\.noreply\\.github\\.com"}                               | ${["\\d+\\+.+@users\\.noreply\\.github\\.com"]}
	${" .+@(pegasus|unicorn)-company\\.com "}                                   | ${[".+@(pegasus|unicorn)-company\\.com"]}
	${".+@alpha-company\\.com .+@bravo-company\\.com .+@charlie-company\\.com"} | ${[".+@alpha-company\\.com", ".+@bravo-company\\.com", ".+@charlie-company\\.com"]}
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
	rawPatterns                                                                                                                                        | expectedErrorMessage
	${""}                                                                                                                                              | ${"must specify at least one value"}
	${"  "}                                                                                                                                            | ${"must specify at least one value"}
	${"\\d+\\+.+@users\\.noreply\\.github\\.com \\d+\\+.+@users\\.noreply\\.github\\.com"}                                                             | ${"must not contain duplicates: \\\\d+\\\\+.+@users\\\\.noreply\\\\.github\\\\.com"}
	${".+@alpha-company\\.com .+@bravo-company\\.com .+@charlie-company\\.com .+@alpha-company\\.com"}                                                 | ${"must not contain duplicates: .+@alpha-company\\\\.com"}
	${".+@alpha-company\\.com .+@bravo-company\\.com .+@charlie-company\\.com .+@charlie-company\\.com .+@bravo-company\\.com .+@bravo-company\\.com"} | ${"must not contain duplicates: .+@bravo-company\\\\.com .+@charlie-company\\\\.com"}
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
				"acknowledged-committer-email-addresses--patterns",
			)
		})
	},
)

function parseConfiguration(
	rawConfiguration: RawAcknowledgedCommitterEmailAddressesConfiguration,
): AcknowledgedCommitterEmailAddressesConfiguration {
	return acknowledgedCommitterEmailAddressesConfigurationSchema.parse(
		rawConfiguration,
	)
}

function formatPatterns(patterns: ReadonlyArray<string>): string {
	return `${count(patterns, "pattern", "patterns")}: ${patterns.join(", ")}`
}
