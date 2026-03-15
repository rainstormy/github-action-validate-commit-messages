import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import {
	type LegacyV1AcknowledgedAuthorEmailAddressesConfiguration,
	type LegacyV1RawAcknowledgedAuthorEmailAddressesConfiguration,
	legacyV1AcknowledgedAuthorEmailAddressesConfigurationSchema,
} from "#legacy-v1/rules/AcknowledgedAuthorEmailAddresses/LegacyV1AcknowledgedAuthorEmailAddressesConfiguration.ts"
import { count } from "#legacy-v1/utilities/StringUtilities.ts"

describe.each`
	rawPatterns                                                                        | expectedPatterns
	${String.raw`\d+\+.+@users\.noreply\.github\.com`}                                 | ${[String.raw`\d+\+.+@users\.noreply\.github\.com`]}
	${String.raw` .+@(pegasus|unicorn)-company\.com `}                                 | ${[String.raw`.+@(pegasus|unicorn)-company\.com`]}
	${String.raw`.+@alpha-company\.com .+@bravo-company\.com .+@charlie-company\.com`} | ${[String.raw`.+@alpha-company\.com`, String.raw`.+@bravo-company\.com`, String.raw`.+@charlie-company\.com`]}
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
	rawPatterns                                                                                                                                            | expectedErrorMessage
	${""}                                                                                                                                                  | ${"Input parameter 'acknowledged-author-email-addresses--patterns' must specify at least one value"}
	${"  "}                                                                                                                                                | ${"Input parameter 'acknowledged-author-email-addresses--patterns' must specify at least one value"}
	${String.raw`\d+\+.+@users\.noreply\.github\.com \d+\+.+@users\.noreply\.github\.com`}                                                                 | ${String.raw`Input parameter 'acknowledged-author-email-addresses--patterns' must not contain duplicates: \d+\+.+@users\.noreply\.github\.com`}
	${String.raw`.+@alpha-company\.com .+@bravo-company\.com .+@charlie-company\.com .+@alpha-company\.com`}                                               | ${String.raw`Input parameter 'acknowledged-author-email-addresses--patterns' must not contain duplicates: .+@alpha-company\.com`}
	${String.raw`.+@alpha-company\.com .+@bravo-company\.com .+@charlie-company\.com .+@charlie-company\.com .+@bravo-company\.com .+@bravo-company\.com`} | ${String.raw`Input parameter 'acknowledged-author-email-addresses--patterns' must not contain duplicates: .+@bravo-company\.com .+@charlie-company\.com`}
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
	rawConfiguration: LegacyV1RawAcknowledgedAuthorEmailAddressesConfiguration,
): LegacyV1AcknowledgedAuthorEmailAddressesConfiguration {
	return parse(legacyV1AcknowledgedAuthorEmailAddressesConfigurationSchema, rawConfiguration)
}

function formatPatterns(patterns: Array<string>): string {
	return `${count(patterns, "pattern", "patterns")}: ${patterns.join(", ")}`
}
