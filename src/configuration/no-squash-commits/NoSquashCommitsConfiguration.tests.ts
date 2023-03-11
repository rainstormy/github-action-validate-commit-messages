import { noSquashCommitsConfigurationSchema } from "+configuration"
import { count } from "+utilities"

describe("a list of disallowed prefixes from an empty string", () => {
	const rawPrefixes = ""

	const configuration = noSquashCommitsConfigurationSchema.parse({
		disallowedPrefixes: rawPrefixes,
	})
	const actualPrefixes = configuration.disallowedPrefixes

	it("is empty", () => {
		expect(actualPrefixes).toHaveLength(0)
	})
})

describe.each`
	rawPrefixes                       | expectedPrefixes
	${"amend!"}                       | ${["amend!"]}
	${"fixup!"}                       | ${["fixup!"]}
	${"squash!"}                      | ${["squash!"]}
	${" fixup!, squash!"}             | ${["fixup!", "squash!"]}
	${"amend!,  , fixup!, squash!, "} | ${["amend!", "fixup!", "squash!"]}
`(
	"a list of disallowed prefixes from $rawPrefixes",
	(testRow: {
		readonly rawPrefixes: string
		readonly expectedPrefixes: ReadonlyArray<string>
	}) => {
		const { rawPrefixes, expectedPrefixes } = testRow

		const configuration = noSquashCommitsConfigurationSchema.parse({
			disallowedPrefixes: rawPrefixes,
		})
		const actualPrefixes = configuration.disallowedPrefixes

		it(`includes ${count(expectedPrefixes, "prefix", "prefixes")}`, () => {
			expect(actualPrefixes).toHaveLength(expectedPrefixes.length)
		})

		it.each(expectedPrefixes)(`includes '%s'`, (expectedPrefix) => {
			expect(actualPrefixes).toContain(expectedPrefix)
		})
	},
)
