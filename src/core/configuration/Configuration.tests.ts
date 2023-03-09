import type { RawConfiguration } from "+core"
import { dummyRawConfigurationFor, parseConfiguration } from "+core"
import { count } from "+utilities"

describe("a configuration for 'no-trailing-punctuation-in-subject-lines'", () => {
	const ruleKey: keyof RawConfiguration =
		"no-trailing-punctuation-in-subject-lines"

	describe("a whitelist from an empty string", () => {
		const configuration = parseConfiguration(
			dummyRawConfigurationFor(ruleKey, {
				whitelist: "",
			}),
		)[ruleKey]

		it("is empty", () => {
			expect(configuration.whitelist).toHaveLength(0)
		})
	})

	describe.each`
		rawWhitelist             | parsedWhitelist
		${"."}                   | ${["."]}
		${". , : ; - ="}         | ${[".", ",", ":", ";", "-", "="]}
		${" ?  ! "}              | ${["?", "!"]}
		${"  + - * /"}           | ${["+", "-", "*", "/"]}
		${"... ?? !! && || // "} | ${["...", "??", "!!", "&&", "||", "//"]}
	`(
		"a whitelist from $rawWhitelist",
		(testRow: {
			readonly rawWhitelist: string
			readonly parsedWhitelist: ReadonlyArray<string>
		}) => {
			const { rawWhitelist, parsedWhitelist } = testRow

			const configuration = parseConfiguration(
				dummyRawConfigurationFor(ruleKey, {
					whitelist: rawWhitelist,
				}),
			)[ruleKey]

			it(`includes ${count(parsedWhitelist, "suffix", "suffixes")}`, () => {
				expect(configuration.whitelist).toHaveLength(parsedWhitelist.length)
			})

			it.each(parsedWhitelist)(`includes '%s'`, (suffix) => {
				expect(configuration.whitelist).toContain(suffix)
			})
		},
	)
})
