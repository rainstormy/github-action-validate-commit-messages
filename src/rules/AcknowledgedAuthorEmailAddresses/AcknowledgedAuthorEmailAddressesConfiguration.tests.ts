import {
	type AcknowledgedAuthorEmailAddressesConfiguration,
	type RawAcknowledgedAuthorEmailAddressesConfiguration,
	acknowledgedAuthorEmailAddressesConfigurationSchema,
} from "+rules/AcknowledgedAuthorEmailAddresses/AcknowledgedAuthorEmailAddressesConfiguration"
import { count } from "+utilities/StringUtilities"
import { describe, expect, it } from "vitest"

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

		it("raises an error that points out the name of the incorrect parameter", () => {
			expect(() => parseConfiguration({ patterns: rawPatterns })).toThrow(
				"acknowledged-author-email-addresses--patterns",
			)
		})
	},
)

function parseConfiguration(
	rawConfiguration: RawAcknowledgedAuthorEmailAddressesConfiguration,
): AcknowledgedAuthorEmailAddressesConfiguration {
	return acknowledgedAuthorEmailAddressesConfigurationSchema.parse(
		rawConfiguration,
	)
}

function formatPatterns(patterns: ReadonlyArray<string>): string {
	return `${count(patterns, "pattern", "patterns")}: ${patterns.join(", ")}`
}
