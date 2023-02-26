import type { ApplicableRuleKey, RulesetParser } from "+validation"
import {
	defaultConfiguration,
	getAllApplicableRules,
	rulesetParserFrom,
} from "+validation"

const allApplicableRules = getAllApplicableRules(defaultConfiguration)
const allApplicableRuleKeys = allApplicableRules.map((rule) => rule.key)

const parser = rulesetParserFrom(defaultConfiguration)

describe.each`
	commaSeparatedKeys                                            | expectedRuleKeys
	${"no-fixup-commits"}                                         | ${["no-fixup-commits"]}
	${" no-fixup-commits "}                                       | ${["no-fixup-commits"]}
	${"no-merge-commits"}                                         | ${["no-merge-commits"]}
	${" no-merge-commits"}                                        | ${["no-merge-commits"]}
	${"no-squash-commits"}                                        | ${["no-squash-commits"]}
	${"no-squash-commits,  "}                                     | ${["no-squash-commits"]}
	${"no-fixup-commits,,no-squash-commits"}                      | ${["no-fixup-commits", "no-squash-commits"]}
	${"no-fixup-commits,no-merge-commits,no-squash-commits"}      | ${["no-fixup-commits", "no-merge-commits", "no-squash-commits"]}
	${",no-fixup-commits, no-merge-commits,  no-squash-commits,"} | ${["no-fixup-commits", "no-merge-commits", "no-squash-commits"]}
	${"all"}                                                      | ${allApplicableRuleKeys}
`(
	"a ruleset from a valid string of $commaSeparatedKeys",
	(testRow: {
		readonly commaSeparatedKeys: string
		readonly expectedRuleKeys: ReadonlyArray<ApplicableRuleKey>
	}) => {
		const { commaSeparatedKeys, expectedRuleKeys } = testRow

		const result = parser.parseCommaSeparatedString(commaSeparatedKeys)
		const ruleset = (result as RulesetParser.Result.Valid).ruleset

		it("is valid", () => {
			expect(result.status).toBe("valid")
		})

		it(`has ${expectedRuleKeys.length} ${
			expectedRuleKeys.length === 1 ? "rule" : "rules" // eslint-disable-line jest/no-conditional-in-test -- The conditional expression affects only the test name to make it grammatically correct.
		}`, () => {
			expect(ruleset).toHaveLength(expectedRuleKeys.length)
		})

		it.each(expectedRuleKeys)("includes '%s'", (ruleKey) => {
			expect(ruleset).toContainEqual(expect.objectContaining({ key: ruleKey }))
		})
	},
)

describe("a ruleset from an empty string", () => {
	const result = parser.parseCommaSeparatedString("")
	const errorMessage = (result as RulesetParser.Result.Invalid).errorMessage

	it("is invalid", () => {
		expect(result.status).toBe("invalid")
	})

	it("reports the lack of rules", () => {
		expect(errorMessage).toBe("No rules specified")
	})
})

describe("a ruleset from a string of whitespace", () => {
	const result = parser.parseCommaSeparatedString("  ")
	const errorMessage = (result as RulesetParser.Result.Invalid).errorMessage

	it("is invalid", () => {
		expect(result.status).toBe("invalid")
	})

	it("reports the lack of rules", () => {
		expect(errorMessage).toBe("No rules specified")
	})
})

describe("a ruleset from a string of whitespace and commas", () => {
	const result = parser.parseCommaSeparatedString(" ,   ,, ")
	const errorMessage = (result as RulesetParser.Result.Invalid).errorMessage

	it("is invalid", () => {
		expect(result.status).toBe("invalid")
	})

	it("reports the lack of rules", () => {
		expect(errorMessage).toBe("No rules specified")
	})
})

describe("a ruleset from a string that contains unknown rules", () => {
	const result = parser.parseCommaSeparatedString(
		"require-only-merge-commits,no-squash-commits,require-funny-commits,no-fixup-commits",
	)
	const errorMessage = (result as RulesetParser.Result.Invalid).errorMessage

	it("is invalid", () => {
		expect(result.status).toBe("invalid")
	})

	it("reports the unknown rules in order of their appearance", () => {
		expect(errorMessage).toBe(
			"Unknown rules: require-only-merge-commits, require-funny-commits",
		)
	})
})

describe.each`
	commaSeparatedKeys                                                                                            | expectedErrorMessage
	${"no-fixup-commits,no-squash-commits,no-fixup-commits"}                                                      | ${"Duplicate rules: no-fixup-commits"}
	${"no-fixup-commits,no-merge-commits,no-squash-commits,no-squash-commits,no-fixup-commits,no-squash-commits"} | ${"Duplicate rules: no-squash-commits, no-fixup-commits"}
	${"no-merge-commits,no-squash-commits,no-merge-commits,no-squash-commits"}                                    | ${"Duplicate rules: no-merge-commits, no-squash-commits"}
	${"all,all"}                                                                                                  | ${"Duplicate rules: all"}
`(
	"a ruleset from a string $commaSeparatedKeys that contains duplicate rules",
	(testRow: {
		readonly commaSeparatedKeys: string
		readonly expectedErrorMessage: string
	}) => {
		const { commaSeparatedKeys, expectedErrorMessage } = testRow

		const result = parser.parseCommaSeparatedString(commaSeparatedKeys)
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
	const result = parser.parseCommaSeparatedString(
		"require-only-merge-commits,all,no-fixup-commits",
	)
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
