import { ruleKeysConfigurationSchema } from "+configuration"
import type { RuleKey } from "+rules"
import { count } from "+utilities"

describe.each`
	rawRuleKeys                                                                                      | expectedRuleKeys
	${" no-merge-commits  "}                                                                         | ${["no-merge-commits"]}
	${"no-squash-commits,  "}                                                                        | ${["no-squash-commits"]}
	${",capitalised-subject-lines "}                                                                 | ${["capitalised-subject-lines"]}
	${"   no-trailing-punctuation-in-subject-lines ,"}                                               | ${["no-trailing-punctuation-in-subject-lines"]}
	${"capitalised-subject-lines , no-squash-commits"}                                               | ${["capitalised-subject-lines", "no-squash-commits"]}
	${"capitalised-subject-lines ,no-merge-commits, no-squash-commits"}                              | ${["capitalised-subject-lines", "no-merge-commits", "no-squash-commits"]}
	${"no-trailing-punctuation-in-subject-lines,, no-merge-commits, no-squash-commits"}              | ${["no-trailing-punctuation-in-subject-lines", "no-merge-commits", "no-squash-commits"]}
	${",, no-squash-commits,capitalised-subject-lines , no-trailing-punctuation-in-subject-lines  "} | ${["no-squash-commits", "capitalised-subject-lines", "no-trailing-punctuation-in-subject-lines"]}
`(
	"a ruleset from a valid string of $rawRuleKeys",
	(testRow: {
		readonly rawRuleKeys: string
		readonly expectedRuleKeys: ReadonlyArray<RuleKey>
	}) => {
		const { rawRuleKeys, expectedRuleKeys } = testRow
		const actualRuleKeys = ruleKeysConfigurationSchema.parse(rawRuleKeys)

		it(`has ${count(expectedRuleKeys, "rule", "rules")}`, () => {
			expect(actualRuleKeys).toHaveLength(expectedRuleKeys.length)
		})

		it.each(expectedRuleKeys)("includes '%s'", (expectedRuleKey) => {
			expect(actualRuleKeys).toContain(expectedRuleKey)
		})
	},
)

describe("a ruleset from an empty string", () => {
	const rawRuleKeys = ""

	it("reports the lack of rules", () => {
		expect(() => ruleKeysConfigurationSchema.parse(rawRuleKeys)).toThrow(
			"No rules specified",
		)
	})
})

describe("a ruleset from a string of whitespace", () => {
	const rawRuleKeys = "  "

	it("reports the lack of rules", () => {
		expect(() => ruleKeysConfigurationSchema.parse(rawRuleKeys)).toThrow(
			"No rules specified",
		)
	})
})

describe("a ruleset from a string of spaces and commas", () => {
	const rawRuleKeys = " ,   ,, , ,,, "

	it("reports the lack of rules", () => {
		expect(() => ruleKeysConfigurationSchema.parse(rawRuleKeys)).toThrow(
			"No rules specified",
		)
	})
})

describe("a ruleset from a string that contains unknown rules", () => {
	const rawRuleKeys =
		"only-merge-commits, no-squash-commits, no-funny-commits, capitalised-subject-lines"

	it("reports the unknown rules in order of their appearance", () => {
		expect(() => ruleKeysConfigurationSchema.parse(rawRuleKeys)).toThrow(
			"Unknown rules: only-merge-commits, no-funny-commits",
		)
	})
})

describe.each`
	rawRuleKeys                                                                                                                          | expectedErrorMessage
	${"capitalised-subject-lines, no-squash-commits, no-squash-commits"}                                                                 | ${"Duplicate rules: no-squash-commits"}
	${"capitalised-subject-lines, no-merge-commits, no-squash-commits, no-squash-commits, capitalised-subject-lines, no-squash-commits"} | ${"Duplicate rules: capitalised-subject-lines, no-squash-commits"}
	${"no-merge-commits, no-squash-commits, no-merge-commits, no-squash-commits"}                                                        | ${"Duplicate rules: no-merge-commits, no-squash-commits"}
`(
	"a ruleset from a string $rawRuleKeys that contains duplicate rules",
	(testRow: {
		readonly rawRuleKeys: string
		readonly expectedErrorMessage: string
	}) => {
		const { rawRuleKeys, expectedErrorMessage } = testRow

		it("reports the duplicate rules in order of their appearance", () => {
			expect(() => ruleKeysConfigurationSchema.parse(rawRuleKeys)).toThrow(
				expectedErrorMessage,
			)
		})
	},
)

describe("a ruleset from a string that contains duplicate rules as well as unknown rules", () => {
	const rawRuleKeys =
		"no-easter-eggs, no-squash-commits, no-easter-eggs, no-letters-in-subject-lines, no-squash-commits"

	it("reports the unknown rules (without duplicates) in order of their appearance", () => {
		expect(() => ruleKeysConfigurationSchema.parse(rawRuleKeys)).toThrow(
			"Unknown rules: no-easter-eggs, no-letters-in-subject-lines",
		)
	})

	it("reports the duplicate rules (including unknown rules) in order of their appearance", () => {
		expect(() => ruleKeysConfigurationSchema.parse(rawRuleKeys)).toThrow(
			"Duplicate rules: no-easter-eggs, no-squash-commits",
		)
	})
})
