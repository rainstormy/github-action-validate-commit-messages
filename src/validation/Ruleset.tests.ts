import { dummyConfiguration } from "+core"
import { count } from "+utilities"
import type { ApplicableRuleKey, RulesetParser } from "+validation"
import { rulesetParserFrom } from "+validation"

const parser = rulesetParserFrom(dummyConfiguration)

describe.each`
	rules                                                                                            | expectedRules
	${"no-fixup-commits"}                                                                            | ${["no-fixup-commits"]}
	${" no-merge-commits  "}                                                                         | ${["no-merge-commits"]}
	${"no-squash-commits,  "}                                                                        | ${["no-squash-commits"]}
	${",capitalised-subject-lines "}                                                                 | ${["capitalised-subject-lines"]}
	${"   no-trailing-punctuation-in-subject-lines ,"}                                               | ${["no-trailing-punctuation-in-subject-lines"]}
	${"no-fixup-commits , no-squash-commits"}                                                        | ${["no-fixup-commits", "no-squash-commits"]}
	${"capitalised-subject-lines ,no-merge-commits, no-fixup-commits"}                               | ${["capitalised-subject-lines", "no-merge-commits", "no-fixup-commits"]}
	${"no-fixup-commits,, no-merge-commits, no-squash-commits"}                                      | ${["no-fixup-commits", "no-merge-commits", "no-squash-commits"]}
	${",, no-squash-commits,capitalised-subject-lines , no-trailing-punctuation-in-subject-lines  "} | ${["no-squash-commits", "capitalised-subject-lines", "no-trailing-punctuation-in-subject-lines"]}
	${"all"}                                                                                         | ${["capitalised-subject-lines", "no-fixup-commits", "no-merge-commits", "no-squash-commits", "no-trailing-punctuation-in-subject-lines"]}
`(
	"a ruleset from a valid string of $rules",
	(testRow: {
		readonly rules: string
		readonly expectedRules: ReadonlyArray<ApplicableRuleKey>
	}) => {
		const { rules, expectedRules } = testRow

		const result = parser.parse({ rules })
		const ruleset = (result as RulesetParser.Result.Valid).ruleset

		it("is valid", () => {
			expect(result.status).toBe("valid")
		})

		it(`has ${count(expectedRules, "rule", "rules")}`, () => {
			expect(ruleset).toHaveLength(expectedRules.length)
		})

		it.each(expectedRules)("includes '%s'", (ruleKey) => {
			expect(ruleset).toContainEqual(expect.objectContaining({ key: ruleKey }))
		})
	},
)

describe("a ruleset from an empty string", () => {
	const result = parser.parse({ rules: "" })
	const errorMessage = (result as RulesetParser.Result.Invalid).errorMessage

	it("is invalid", () => {
		expect(result.status).toBe("invalid")
	})

	it("reports the lack of rules", () => {
		expect(errorMessage).toBe("No rules specified")
	})
})

describe("a ruleset from a string of whitespace", () => {
	const result = parser.parse({ rules: "  " })
	const errorMessage = (result as RulesetParser.Result.Invalid).errorMessage

	it("is invalid", () => {
		expect(result.status).toBe("invalid")
	})

	it("reports the lack of rules", () => {
		expect(errorMessage).toBe("No rules specified")
	})
})

describe("a ruleset from a string of spaces and commas", () => {
	const result = parser.parse({ rules: " ,   ,, , ,,, " })
	const errorMessage = (result as RulesetParser.Result.Invalid).errorMessage

	it("is invalid", () => {
		expect(result.status).toBe("invalid")
	})

	it("reports the lack of rules", () => {
		expect(errorMessage).toBe("No rules specified")
	})
})

describe("a ruleset from a string that contains unknown rules", () => {
	const result = parser.parse({
		rules:
			"only-merge-commits, no-squash-commits, no-funny-commits, no-fixup-commits",
	})
	const errorMessage = (result as RulesetParser.Result.Invalid).errorMessage

	it("is invalid", () => {
		expect(result.status).toBe("invalid")
	})

	it("reports the unknown rules in order of their appearance", () => {
		expect(errorMessage).toBe(
			"Unknown rules: only-merge-commits, no-funny-commits",
		)
	})
})

describe.each`
	rules                                                                                                              | expectedErrorMessage
	${"no-fixup-commits, no-squash-commits, no-fixup-commits"}                                                         | ${"Duplicate rules: no-fixup-commits"}
	${"no-fixup-commits, no-merge-commits, no-squash-commits, no-squash-commits, no-fixup-commits, no-squash-commits"} | ${"Duplicate rules: no-squash-commits, no-fixup-commits"}
	${"no-merge-commits, no-squash-commits, no-merge-commits, no-squash-commits"}                                      | ${"Duplicate rules: no-merge-commits, no-squash-commits"}
	${"all, all"}                                                                                                      | ${"Duplicate rules: all"}
`(
	"a ruleset from a string $rules that contains duplicate rules",
	(testRow: {
		readonly rules: string
		readonly expectedErrorMessage: string
	}) => {
		const { rules, expectedErrorMessage } = testRow

		const result = parser.parse({ rules })
		const errorMessage = (result as RulesetParser.Result.Invalid).errorMessage

		it("is invalid", () => {
			expect(result.status).toBe("invalid")
		})

		it("reports the duplicate rules in order of their appearance", () => {
			expect(errorMessage).toBe(expectedErrorMessage)
		})
	},
)

describe("a ruleset from a string that mixes rules with 'all'", () => {
	const result = parser.parse({
		rules: "only-merge-commits, all, no-fixup-commits",
	})
	const errorMessage = (result as RulesetParser.Result.Invalid).errorMessage

	it("is invalid", () => {
		expect(result.status).toBe("invalid")
	})

	it("reports the mix of rules and 'all'", () => {
		expect(errorMessage).toBe(
			"'all' cannot be combined with a specific set of rules",
		)
	})
})
