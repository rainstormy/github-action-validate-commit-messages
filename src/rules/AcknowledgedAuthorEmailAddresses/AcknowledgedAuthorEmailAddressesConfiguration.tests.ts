import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import {
	type AcknowledgedAuthorEmailAddressesConfiguration,
	type RawAcknowledgedAuthorEmailAddressesConfiguration,
	acknowledgedAuthorEmailAddressesConfigurationSchema,
} from "#rules/AcknowledgedAuthorEmailAddresses/AcknowledgedAuthorEmailAddressesConfiguration"
import { count } from "#utilities/StringUtilities"

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
	${""}                                                                                                                                              | ${"Input parameter 'acknowledged-author-email-addresses--patterns' must specify at least one value"}
	${"  "}                                                                                                                                            | ${"Input parameter 'acknowledged-author-email-addresses--patterns' must specify at least one value"}
	${"\\d+\\+.+@users\\.noreply\\.github\\.com \\d+\\+.+@users\\.noreply\\.github\\.com"}                                                             | ${"Input parameter 'acknowledged-author-email-addresses--patterns' must not contain duplicates: \\d+\\+.+@users\\.noreply\\.github\\.com"}
	${".+@alpha-company\\.com .+@bravo-company\\.com .+@charlie-company\\.com .+@alpha-company\\.com"}                                                 | ${"Input parameter 'acknowledged-author-email-addresses--patterns' must not contain duplicates: .+@alpha-company\\.com"}
	${".+@alpha-company\\.com .+@bravo-company\\.com .+@charlie-company\\.com .+@charlie-company\\.com .+@bravo-company\\.com .+@bravo-company\\.com"} | ${"Input parameter 'acknowledged-author-email-addresses--patterns' must not contain duplicates: .+@bravo-company\\.com .+@charlie-company\\.com"}
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
	},
)

function parseConfiguration(
	rawConfiguration: RawAcknowledgedAuthorEmailAddressesConfiguration,
): AcknowledgedAuthorEmailAddressesConfiguration {
	return parse(
		acknowledgedAuthorEmailAddressesConfigurationSchema,
		rawConfiguration,
	)
}

function formatPatterns(patterns: ReadonlyArray<string>): string {
	return `${count(patterns, "pattern", "patterns")}: ${patterns.join(", ")}`
}
