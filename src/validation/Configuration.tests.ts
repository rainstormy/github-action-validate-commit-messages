import { count } from "+utilities"
import { configurationFrom } from "+validation"

describe("a suffix whitelist parsed from an empty string", () => {
	const configuration = configurationFrom({
		delimitedSuffixWhitelist: "",
	})

	it("is empty", () => {
		expect(configuration.suffixWhitelist).toHaveLength(0)
	})
})

describe.each`
	delimitedSuffixWhitelist | expectedSuffixWhitelist
	${"."}                   | ${["."]}
	${". , : ; - ="}         | ${[".", ",", ":", ";", "-", "="]}
	${" ?  ! "}              | ${["?", "!"]}
	${"  + - * /"}           | ${["+", "-", "*", "/"]}
	${"... ?? !! && || // "} | ${["...", "??", "!!", "&&", "||", "//"]}
`(
	"a suffix whitelist parsed from $delimitedSuffixWhitelist",
	(testRow: {
		readonly delimitedSuffixWhitelist: string
		readonly expectedSuffixWhitelist: ReadonlyArray<string>
	}) => {
		const { delimitedSuffixWhitelist, expectedSuffixWhitelist } = testRow

		const configuration = configurationFrom({
			delimitedSuffixWhitelist,
		})

		it(`allows ${count(expectedSuffixWhitelist, "suffix", "suffixes")}`, () => {
			expect(configuration.suffixWhitelist).toHaveLength(
				expectedSuffixWhitelist.length,
			)
		})

		it.each(expectedSuffixWhitelist)(`allows '%s'`, (punctuationMark) => {
			expect(configuration.suffixWhitelist).toContain(punctuationMark)
		})
	},
)
