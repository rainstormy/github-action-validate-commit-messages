import type {
	NoSquashCommitsConfiguration,
	RawNoSquashCommitsConfiguration,
} from "+rules"
import { noSquashCommitsConfigurationSchema } from "+rules"
import { count } from "+utilities"
import { describe, expect, it } from "vitest"

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
	${""}                                           | ${"must specify at least one value"}
	${"  "}                                         | ${"must specify at least one value"}
	${" ,   ,, , ,,, "}                             | ${"must specify at least one value"}
	${"fixup!, squash!, fixup!"}                    | ${"must not contain duplicates: fixup!"}
	${"squash!, squash!, amend!, fixup!, amend!"}   | ${"must not contain duplicates: squash!, amend!"}
	${"amend!,fixup!,amend!,squash!,amend!,fixup!"} | ${"must not contain duplicates: amend!, fixup!"}
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

		it(`raises an error that points out the name of the incorrect parameter`, () => {
			expect(() =>
				parseConfiguration({ disallowedPrefixes: rawPrefixes }),
			).toThrow("no-squash-commits--disallowed-prefixes")
		})
	},
)

function parseConfiguration(
	rawConfiguration: RawNoSquashCommitsConfiguration,
): NoSquashCommitsConfiguration {
	return noSquashCommitsConfigurationSchema.parse(rawConfiguration)
}

function formatPrefixes(prefixes: ReadonlyArray<string>): string {
	return `${count(prefixes, "prefix", "prefixes")}: ${prefixes.join(", ")}`
}
