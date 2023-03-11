import { noTrailingPunctuationInSubjectLinesConfigurationSchema } from "+configuration"
import { count } from "+utilities"

describe("a whitelist from an empty string", () => {
	const rawWhitelist = ""

	const configuration =
		noTrailingPunctuationInSubjectLinesConfigurationSchema.parse({
			customWhitelist: rawWhitelist,
		})
	const actualWhitelist = configuration.customWhitelist

	it("is empty", () => {
		expect(actualWhitelist).toHaveLength(0)
	})
})

describe.each`
	rawWhitelist             | expectedWhitelist
	${"."}                   | ${["."]}
	${". , : ; - ="}         | ${[".", ",", ":", ";", "-", "="]}
	${" ?  ! "}              | ${["?", "!"]}
	${"  + - * /"}           | ${["+", "-", "*", "/"]}
	${"... ?? !! && || // "} | ${["...", "??", "!!", "&&", "||", "//"]}
`(
	"a whitelist from $rawWhitelist",
	(testRow: {
		readonly rawWhitelist: string
		readonly expectedWhitelist: ReadonlyArray<string>
	}) => {
		const { rawWhitelist, expectedWhitelist } = testRow

		const configuration =
			noTrailingPunctuationInSubjectLinesConfigurationSchema.parse({
				customWhitelist: rawWhitelist,
			})
		const actualWhitelist = configuration.customWhitelist

		it(`includes ${count(expectedWhitelist, "suffix", "suffixes")}`, () => {
			expect(actualWhitelist).toHaveLength(expectedWhitelist.length)
		})

		it.each(expectedWhitelist)(`includes '%s'`, (expectedWhitelistedSuffix) => {
			expect(actualWhitelist).toContain(expectedWhitelistedSuffix)
		})
	},
)
