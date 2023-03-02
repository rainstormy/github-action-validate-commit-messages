import { count } from "+utilities"
import type { ApplicableRuleKey, RulesetParser } from "+validation"
import { getAllApplicableRules, rulesetParserFrom } from "+validation"
import { dummyConfiguration } from "+validation/dummies"

const allApplicableRules = getAllApplicableRules(dummyConfiguration)
const allApplicableRuleKeys = allApplicableRules.map((rule) => rule.key)

const parser = rulesetParserFrom(dummyConfiguration)

describe.each`
	delimitedRuleKeys                                                                                                                 | expectedRuleKeys
	${"no-fixup-commits"}                                                                                                             | ${["no-fixup-commits"]}
	${" no-fixup-commits "}                                                                                                           | ${["no-fixup-commits"]}
	${"no-merge-commits"}                                                                                                             | ${["no-merge-commits"]}
	${" no-merge-commits"}                                                                                                            | ${["no-merge-commits"]}
	${"no-squash-commits"}                                                                                                            | ${["no-squash-commits"]}
	${"no-squash-commits,  "}                                                                                                         | ${["no-squash-commits"]}
	${",capitalised-subject-lines ;"}                                                                                                 | ${["capitalised-subject-lines"]}
	${"no-fixup-commits , no-squash-commits"}                                                                                         | ${["no-fixup-commits", "no-squash-commits"]}
	${"capitalised-subject-lines ;no-merge-commits; no-fixup-commits"}                                                                | ${["capitalised-subject-lines", "no-merge-commits", "no-fixup-commits"]}
	${"no-fixup-commits,, no-merge-commits, no-squash-commits"}                                                                       | ${["no-fixup-commits", "no-merge-commits", "no-squash-commits"]}
	${" no-fixup-commits no-merge-commits  no-squash-commits "}                                                                       | ${["no-fixup-commits", "no-merge-commits", "no-squash-commits"]}
	${";no-fixup-commits no-merge-commits; no-squash-commits,capitalised-subject-lines , no-trailing-punctuation-in-subject-lines  "} | ${["no-fixup-commits", "no-merge-commits", "no-squash-commits", "capitalised-subject-lines", "no-trailing-punctuation-in-subject-lines"]}
	${"all"}                                                                                                                          | ${allApplicableRuleKeys}
`(
	"a ruleset from a valid string of $delimitedRuleKeys",
	(testRow: {
		readonly delimitedRuleKeys: string
		readonly expectedRuleKeys: ReadonlyArray<ApplicableRuleKey>
	}) => {
		const { delimitedRuleKeys, expectedRuleKeys } = testRow

		const result = parser.parse(delimitedRuleKeys)
		const ruleset = (result as RulesetParser.Result.Valid).ruleset

		it("is valid", () => {
			expect(result.status).toBe("valid")
		})

		it(`has ${count(expectedRuleKeys, "rule", "rules")}`, () => {
			expect(ruleset).toHaveLength(expectedRuleKeys.length)
		})

		it.each(expectedRuleKeys)("includes '%s'", (ruleKey) => {
			expect(ruleset).toContainEqual(expect.objectContaining({ key: ruleKey }))
		})
	},
)

describe("a ruleset from an empty string", () => {
	const result = parser.parse("")
	const errorMessage = (result as RulesetParser.Result.Invalid).errorMessage

	it("is invalid", () => {
		expect(result.status).toBe("invalid")
	})

	it("reports the lack of rules", () => {
		expect(errorMessage).toBe("No rules specified")
	})
})

describe("a ruleset from a string of whitespace", () => {
	const result = parser.parse("  ")
	const errorMessage = (result as RulesetParser.Result.Invalid).errorMessage

	it("is invalid", () => {
		expect(result.status).toBe("invalid")
	})

	it("reports the lack of rules", () => {
		expect(errorMessage).toBe("No rules specified")
	})
})

describe("a ruleset from a string of spaces, commas, and semicolons", () => {
	const result = parser.parse(" ;   ,, , ;; ")
	const errorMessage = (result as RulesetParser.Result.Invalid).errorMessage

	it("is invalid", () => {
		expect(result.status).toBe("invalid")
	})

	it("reports the lack of rules", () => {
		expect(errorMessage).toBe("No rules specified")
	})
})

describe("a ruleset from a string that contains unknown rules", () => {
	const result = parser.parse(
		"only-merge-commits no-squash-commits no-funny-commits no-fixup-commits",
	)
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
	delimitedRuleKeys                                                                                             | expectedErrorMessage
	${"no-fixup-commits no-squash-commits no-fixup-commits"}                                                      | ${"Duplicate rules: no-fixup-commits"}
	${"no-fixup-commits no-merge-commits no-squash-commits no-squash-commits no-fixup-commits no-squash-commits"} | ${"Duplicate rules: no-squash-commits, no-fixup-commits"}
	${"no-merge-commits no-squash-commits no-merge-commits no-squash-commits"}                                    | ${"Duplicate rules: no-merge-commits, no-squash-commits"}
	${"all all"}                                                                                                  | ${"Duplicate rules: all"}
`(
	"a ruleset from a string $delimitedRuleKeys that contains duplicate rules",
	(testRow: {
		readonly delimitedRuleKeys: string
		readonly expectedErrorMessage: string
	}) => {
		const { delimitedRuleKeys, expectedErrorMessage } = testRow

		const result = parser.parse(delimitedRuleKeys)
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
	const result = parser.parse("only-merge-commits all no-fixup-commits")
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
