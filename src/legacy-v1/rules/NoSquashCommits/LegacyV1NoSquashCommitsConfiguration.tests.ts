import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import {
	type LegacyV1NoSquashCommitsConfiguration,
	type LegacyV1RawNoSquashCommitsConfiguration,
	legacyV1NoSquashCommitsConfigurationSchema,
} from "#legacy-v1/rules/NoSquashCommits/LegacyV1NoSquashCommitsConfiguration.ts"
import { count } from "#legacy-v1/utilities/StringUtilities.ts"

describe.each`
	rawPrefixes                       | expectedPrefixes
	${"amend!"}                       | ${["amend!"]}
	${"fixup!"}                       | ${["fixup!"]}
	${"squash!"}                      | ${["squash!"]}
	${" fixup!, squash!"}             | ${["fixup!", "squash!"]}
	${"amend!,  , fixup!, squash!, "} | ${["amend!", "fixup!", "squash!"]}
`(
	"a list of disallowed prefixes from a valid string of $rawPrefixes",
	(testRow: {
		readonly rawPrefixes: string
		readonly expectedPrefixes: ReadonlyArray<string>
	}) => {
		const { rawPrefixes, expectedPrefixes } = testRow

		it(`includes ${formatPrefixes(expectedPrefixes)}`, () => {
			const { disallowedPrefixes: actualPrefixes } = parseConfiguration({
				disallowedPrefixes: rawPrefixes,
			})

			expect(actualPrefixes).toStrictEqual(expectedPrefixes)
		})
	},
)

describe.each`
	rawPrefixes                                     | expectedErrorMessage
	${""}                                           | ${"Input parameter 'no-squash-commits--disallowed-prefixes' must specify at least one value"}
	${"  "}                                         | ${"Input parameter 'no-squash-commits--disallowed-prefixes' must specify at least one value"}
	${" ,   ,, , ,,, "}                             | ${"Input parameter 'no-squash-commits--disallowed-prefixes' must specify at least one value"}
	${"fixup!, squash!, fixup!"}                    | ${"Input parameter 'no-squash-commits--disallowed-prefixes' must not contain duplicates: fixup!"}
	${"squash!, squash!, amend!, fixup!, amend!"}   | ${"Input parameter 'no-squash-commits--disallowed-prefixes' must not contain duplicates: squash!, amend!"}
	${"amend!,fixup!,amend!,squash!,amend!,fixup!"} | ${"Input parameter 'no-squash-commits--disallowed-prefixes' must not contain duplicates: amend!, fixup!"}
`(
	"a list of disallowed prefixes from an invalid string of $rawPrefixes",
	(testRow: {
		readonly rawPrefixes: string
		readonly expectedErrorMessage: string
	}) => {
		const { rawPrefixes, expectedErrorMessage } = testRow

		it(`raises an error with a message of '${expectedErrorMessage}'`, () => {
			expect(() =>
				parseConfiguration({ disallowedPrefixes: rawPrefixes }),
			).toThrow(expectedErrorMessage)
		})
	},
)

function parseConfiguration(
	rawConfiguration: LegacyV1RawNoSquashCommitsConfiguration,
): LegacyV1NoSquashCommitsConfiguration {
	return parse(legacyV1NoSquashCommitsConfigurationSchema, rawConfiguration)
}

function formatPrefixes(prefixes: ReadonlyArray<string>): string {
	return `${count(prefixes, "prefix", "prefixes")}: ${prefixes.join(", ")}`
}
