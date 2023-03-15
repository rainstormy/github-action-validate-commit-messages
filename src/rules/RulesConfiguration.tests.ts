import type { RuleKey } from "+rules"
import { ruleKeysConfigurationSchema } from "+rules"
import { count } from "+utilities"

describe.each`
	rawRuleKeys                                                                                      | expectedRuleKeys
	${" no-merge-commits  "}                                                                         | ${["no-merge-commits"]}
	${"no-squash-commits,  "}                                                                        | ${["no-squash-commits"]}
	${",capitalised-subject-lines "}                                                                 | ${["capitalised-subject-lines"]}
	${"   no-trailing-punctuation-in-subject-lines ,"}                                               | ${["no-trailing-punctuation-in-subject-lines"]}
	${"issue-references-in-subject-lines"}                                                           | ${["issue-references-in-subject-lines"]}
	${"multi-word-subject-lines"}                                                                    | ${["multi-word-subject-lines"]}
	${"capitalised-subject-lines , no-squash-commits"}                                               | ${["capitalised-subject-lines", "no-squash-commits"]}
	${"capitalised-subject-lines ,no-merge-commits, no-squash-commits"}                              | ${["capitalised-subject-lines", "no-merge-commits", "no-squash-commits"]}
	${"no-trailing-punctuation-in-subject-lines,, no-merge-commits, no-squash-commits"}              | ${["no-trailing-punctuation-in-subject-lines", "no-merge-commits", "no-squash-commits"]}
	${"issue-references-in-subject-lines,multi-word-subject-lines, capitalised-subject-lines"}       | ${["issue-references-in-subject-lines", "multi-word-subject-lines", "capitalised-subject-lines"]}
	${",, no-squash-commits,capitalised-subject-lines , no-trailing-punctuation-in-subject-lines  "} | ${["no-squash-commits", "capitalised-subject-lines", "no-trailing-punctuation-in-subject-lines"]}
`(
	"a ruleset from a valid string of $rawRuleKeys",
	(testRow: {
		readonly rawRuleKeys: string
		readonly expectedRuleKeys: ReadonlyArray<RuleKey>
	}) => {
		const { rawRuleKeys, expectedRuleKeys } = testRow

		it(`includes ${formatRuleKeys(expectedRuleKeys)}`, () => {
			const actualRuleKeys = parseConfiguration(rawRuleKeys)
			expect(actualRuleKeys).toStrictEqual(expectedRuleKeys)
		})
	},
)

describe.each`
	rawRuleKeys                                                                                                                          | expectedErrorMessage
	${""}                                                                                                                                | ${"must specify at least one value"}
	${"  "}                                                                                                                              | ${"must specify at least one value"}
	${" ,   ,, , ,,, "}                                                                                                                  | ${"must specify at least one value"}
	${"capitalised-subject-lines, no-squash-commits, no-squash-commits"}                                                                 | ${"must not contain duplicates: no-squash-commits"}
	${"capitalised-subject-lines, no-merge-commits, no-squash-commits, no-squash-commits, capitalised-subject-lines, no-squash-commits"} | ${"must not contain duplicates: capitalised-subject-lines, no-squash-commits"}
	${"no-merge-commits, no-squash-commits, no-merge-commits, no-squash-commits"}                                                        | ${"must not contain duplicates: no-merge-commits, no-squash-commits"}
	${"only-merge-commits, no-squash-commits, no-funny-commits, capitalised-subject-lines"}                                              | ${"must not contain unknown values: only-merge-commits, no-funny-commits"}
	${"no-easter-eggs, no-squash-commits, no-easter-eggs, no-letters-in-subject-lines, no-squash-commits"}                               | ${"must not contain duplicates: no-easter-eggs, no-squash-commits"}
	${"no-easter-eggs, no-squash-commits, no-easter-eggs, no-letters-in-subject-lines, no-squash-commits"}                               | ${"must not contain unknown values: no-easter-eggs, no-letters-in-subject-lines"}
`(
	"a ruleset from an invalid string of $rawRuleKeys",
	(testRow: {
		readonly rawRuleKeys: string
		readonly expectedErrorMessage: string
	}) => {
		const { rawRuleKeys, expectedErrorMessage } = testRow

		it(`raises an error: '${expectedErrorMessage}'`, () => {
			expect(() => parseConfiguration(rawRuleKeys)).toThrow(
				expectedErrorMessage,
			)
		})
	},
)

function parseConfiguration(rawRuleKeys: string): ReadonlyArray<RuleKey> {
	return ruleKeysConfigurationSchema.parse(rawRuleKeys)
}

function formatRuleKeys(ruleKeys: ReadonlyArray<string>): string {
	return `${count(ruleKeys, "rule", "rules")}: ${ruleKeys.join(", ")}`
}
