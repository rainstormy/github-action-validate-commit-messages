import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import {
	type LegacyV1AcknowledgedCommitterNamesConfiguration,
	type LegacyV1RawAcknowledgedCommitterNamesConfiguration,
	legacyV1AcknowledgedCommitterNamesConfigurationSchema,
} from "#legacy-v1/rules/AcknowledgedCommitterNames/LegacyV1AcknowledgedCommitterNamesConfiguration.ts"
import { count } from "#legacy-v1/utilities/StringUtilities.ts"

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
	${""}                                | ${"Input parameter 'acknowledged-committer-names--patterns' must specify at least one value"}
	${"  "}                              | ${"Input parameter 'acknowledged-committer-names--patterns' must specify at least one value"}
	${".+ .+"}                           | ${"Input parameter 'acknowledged-committer-names--patterns' must not contain duplicates: .+"}
	${"\\w+\\.\\w+ .+\\s.+ \\w+\\.\\w+"} | ${"Input parameter 'acknowledged-committer-names--patterns' must not contain duplicates: \\w+\\.\\w+"}
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
	rawConfiguration: LegacyV1RawAcknowledgedCommitterNamesConfiguration,
): LegacyV1AcknowledgedCommitterNamesConfiguration {
	return parse(
		legacyV1AcknowledgedCommitterNamesConfigurationSchema,
		rawConfiguration,
	)
}

function formatPatterns(patterns: ReadonlyArray<string>): string {
	return `${count(patterns, "pattern", "patterns")}: ${patterns.join(", ")}`
}
