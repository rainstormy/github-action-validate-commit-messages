import {
	requireNonFixupCommits,
	requireNonMergeCommits,
	requireNonSquashCommits,
} from "+rules"
import type { Ruleset } from "+validation"
import { allApplicableRules, rulesetFromString } from "+validation"

describe.each`
	commaSeparatedKeys                                                                       | expectedRuleset
	${"require-non-fixup-commits"}                                                           | ${[requireNonFixupCommits]}
	${" require-non-fixup-commits "}                                                         | ${[requireNonFixupCommits]}
	${"require-non-merge-commits"}                                                           | ${[requireNonMergeCommits]}
	${" require-non-merge-commits"}                                                          | ${[requireNonMergeCommits]}
	${"require-non-squash-commits"}                                                          | ${[requireNonSquashCommits]}
	${"require-non-squash-commits,  "}                                                       | ${[requireNonSquashCommits]}
	${"require-non-fixup-commits,,require-non-squash-commits"}                               | ${[requireNonFixupCommits, requireNonSquashCommits]}
	${"require-non-fixup-commits,require-non-merge-commits,require-non-squash-commits"}      | ${[requireNonFixupCommits, requireNonMergeCommits, requireNonSquashCommits]}
	${",require-non-fixup-commits, require-non-merge-commits,  require-non-squash-commits,"} | ${[requireNonFixupCommits, requireNonMergeCommits, requireNonSquashCommits]}
	${"all"}                                                                                 | ${allApplicableRules}
`(
	"a ruleset from a valid string of $commaSeparatedKeys",
	(testRow: {
		readonly commaSeparatedKeys: string
		readonly expectedRuleset: Ruleset
	}) => {
		const { commaSeparatedKeys, expectedRuleset } = testRow

		const result = rulesetFromString(commaSeparatedKeys)
		const ruleset = (result as Ruleset.ParseResult.Valid).ruleset

		it("is valid", () => {
			expect(result.status).toBe("valid")
		})

		it(`has ${expectedRuleset.length} ${
			expectedRuleset.length === 1 ? "rule" : "rules" // eslint-disable-line jest/no-conditional-in-test -- The conditional expression affects only the test name to make it grammatically correct.
		}`, () => {
			expect(ruleset).toHaveLength(expectedRuleset.length)
		})

		it.each(expectedRuleset)("includes $key", (rule) => {
			expect(ruleset).toContain(rule)
		})
	},
)

describe("a ruleset from an empty string", () => {
	const result = rulesetFromString("")
	const errorMessage = (result as Ruleset.ParseResult.Invalid).errorMessage

	it("is invalid", () => {
		expect(result.status).toBe("invalid")
	})

	it("reports the lack of rules", () => {
		expect(errorMessage).toBe("No rules specified")
	})
})

describe("a ruleset from a string of whitespace", () => {
	const result = rulesetFromString("  ")
	const errorMessage = (result as Ruleset.ParseResult.Invalid).errorMessage

	it("is invalid", () => {
		expect(result.status).toBe("invalid")
	})

	it("reports the lack of rules", () => {
		expect(errorMessage).toBe("No rules specified")
	})
})

describe("a ruleset from a string of whitespace and commas", () => {
	const result = rulesetFromString(" ,   ,, ")
	const errorMessage = (result as Ruleset.ParseResult.Invalid).errorMessage

	it("is invalid", () => {
		expect(result.status).toBe("invalid")
	})

	it("reports the lack of rules", () => {
		expect(errorMessage).toBe("No rules specified")
	})
})

describe("a ruleset from a string that contains unknown rules", () => {
	const result = rulesetFromString(
		"require-only-merge-commits,require-non-squash-commits,require-funny-commits,require-non-fixup-commits",
	)
	const errorMessage = (result as Ruleset.ParseResult.Invalid).errorMessage

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
	commaSeparatedKeys                                                                                                                                                  | expectedErrorMessage
	${"require-non-fixup-commits,require-non-squash-commits,require-non-fixup-commits"}                                                                                 | ${"Duplicate rules: require-non-fixup-commits"}
	${"require-non-fixup-commits,require-non-merge-commits,require-non-squash-commits,require-non-squash-commits,require-non-fixup-commits,require-non-squash-commits"} | ${"Duplicate rules: require-non-squash-commits, require-non-fixup-commits"}
	${"require-non-merge-commits,require-non-squash-commits,require-non-merge-commits,require-non-squash-commits"}                                                      | ${"Duplicate rules: require-non-merge-commits, require-non-squash-commits"}
	${"all,all"}                                                                                                                                                        | ${"Duplicate rules: all"}
`(
	"a ruleset from a string $commaSeparatedKeys that contains duplicate rules",
	(testRow: {
		readonly commaSeparatedKeys: string
		readonly expectedErrorMessage: string
	}) => {
		const { commaSeparatedKeys, expectedErrorMessage } = testRow
		const result = rulesetFromString(commaSeparatedKeys)
		const errorMessage = (result as Ruleset.ParseResult.Invalid).errorMessage

		it("is invalid", () => {
			expect(result.status).toBe("invalid")
		})

		it("reports the duplicate rules in order of their appearance", () => {
			expect(errorMessage).toBe(expectedErrorMessage)
		})
	},
)

describe("a ruleset from a string that mixes rules with 'all'", () => {
	const result = rulesetFromString(
		"require-only-merge-commits,all,require-non-fixup-commits",
	)
	const errorMessage = (result as Ruleset.ParseResult.Invalid).errorMessage

	it("is invalid", () => {
		expect(result.status).toBe("invalid")
	})

	it("reports the mix of rules and 'all'", () => {
		expect(errorMessage).toBe(
			"'all' cannot be combined with a specific set of rules",
		)
	})
})
