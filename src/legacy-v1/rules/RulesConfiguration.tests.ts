import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import {
	type RuleKeys,
	ruleKeys as allAvailableRuleKeys,
} from "#legacy-v1/rules/Rule"
import { ruleKeysConfigurationSchema } from "#legacy-v1/rules/RulesConfiguration"
import { count } from "#legacy-v1/utilities/StringUtilities"

describe.each`
	rawRuleKeys                                                                                                                                 | expectedRuleKeys
	${"acknowledged-author-email-addresses"}                                                                                                    | ${["acknowledged-author-email-addresses"]}
	${"acknowledged-author-names"}                                                                                                              | ${["acknowledged-author-names"]}
	${"acknowledged-committer-email-addresses"}                                                                                                 | ${["acknowledged-committer-email-addresses"]}
	${"acknowledged-committer-names"}                                                                                                           | ${["acknowledged-committer-names"]}
	${"capitalised-subject-lines"}                                                                                                              | ${["capitalised-subject-lines"]}
	${"empty-line-after-subject-lines"}                                                                                                         | ${["empty-line-after-subject-lines"]}
	${"imperative-subject-lines"}                                                                                                               | ${["imperative-subject-lines"]}
	${"issue-references-in-subject-lines"}                                                                                                      | ${["issue-references-in-subject-lines"]}
	${"limit-length-of-body-lines"}                                                                                                             | ${["limit-length-of-body-lines"]}
	${"limit-length-of-subject-lines"}                                                                                                          | ${["limit-length-of-subject-lines"]}
	${",multi-word-subject-lines "}                                                                                                             | ${["multi-word-subject-lines"]}
	${"no-co-authors"}                                                                                                                          | ${["no-co-authors"]}
	${"    no-unexpected-whitespace ,, "}                                                                                                       | ${["no-unexpected-whitespace"]}
	${" no-merge-commits  "}                                                                                                                    | ${["no-merge-commits"]}
	${",,,no-revert-revert-commits"}                                                                                                            | ${["no-revert-revert-commits"]}
	${"no-squash-commits,  "}                                                                                                                   | ${["no-squash-commits"]}
	${"   no-trailing-punctuation-in-subject-lines ,"}                                                                                          | ${["no-trailing-punctuation-in-subject-lines"]}
	${"unique-subject-lines"}                                                                                                                   | ${["unique-subject-lines"]}
	${"acknowledged-author-email-addresses, acknowledged-committer-email-addresses, acknowledged-author-names, acknowledged-committer-names, "} | ${["acknowledged-author-email-addresses", "acknowledged-committer-email-addresses", "acknowledged-author-names", "acknowledged-committer-names"]}
	${"imperative-subject-lines,capitalised-subject-lines , no-squash-commits"}                                                                 | ${["imperative-subject-lines", "capitalised-subject-lines", "no-squash-commits"]}
	${"limit-length-of-body-lines,empty-line-after-subject-lines,limit-length-of-subject-lines,no-unexpected-whitespace"}                       | ${["limit-length-of-body-lines", "empty-line-after-subject-lines", "limit-length-of-subject-lines", "no-unexpected-whitespace"]}
	${"capitalised-subject-lines,empty-line-after-subject-lines ,no-merge-commits, no-squash-commits"}                                          | ${["capitalised-subject-lines", "empty-line-after-subject-lines", "no-merge-commits", "no-squash-commits"]}
	${"no-co-authors, no-merge-commits"}                                                                                                        | ${["no-co-authors", "no-merge-commits"]}
	${"no-unexpected-whitespace, imperative-subject-lines "}                                                                                    | ${["no-unexpected-whitespace", "imperative-subject-lines"]}
	${"no-trailing-punctuation-in-subject-lines,, no-merge-commits, no-squash-commits   ,unique-subject-lines"}                                 | ${["no-trailing-punctuation-in-subject-lines", "no-merge-commits", "no-squash-commits", "unique-subject-lines"]}
	${"issue-references-in-subject-lines,multi-word-subject-lines, capitalised-subject-lines"}                                                  | ${["issue-references-in-subject-lines", "multi-word-subject-lines", "capitalised-subject-lines"]}
	${",, no-squash-commits,capitalised-subject-lines , no-trailing-punctuation-in-subject-lines  "}                                            | ${["no-squash-commits", "capitalised-subject-lines", "no-trailing-punctuation-in-subject-lines"]}
	${",multi-word-subject-lines ,no-revert-revert-commits"}                                                                                    | ${["multi-word-subject-lines", "no-revert-revert-commits"]}
	${allAvailableRuleKeys.join(",")}                                                                                                           | ${allAvailableRuleKeys}
`(
	"a ruleset from a valid string of $rawRuleKeys",
	(testRow: {
		readonly rawRuleKeys: string
		readonly expectedRuleKeys: RuleKeys
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
	${""}                                                                                                                                | ${"Input parameter 'rules' must specify at least one value"}
	${"  "}                                                                                                                              | ${"Input parameter 'rules' must specify at least one value"}
	${" ,   ,, , ,,, "}                                                                                                                  | ${"Input parameter 'rules' must specify at least one value"}
	${"capitalised-subject-lines, no-squash-commits, no-squash-commits"}                                                                 | ${"Input parameter 'rules' must not contain duplicates: no-squash-commits"}
	${"capitalised-subject-lines, no-merge-commits, no-squash-commits, no-squash-commits, capitalised-subject-lines, no-squash-commits"} | ${"Input parameter 'rules' must not contain duplicates: capitalised-subject-lines, no-squash-commits"}
	${"no-merge-commits, no-squash-commits, no-merge-commits, no-squash-commits"}                                                        | ${"Input parameter 'rules' must not contain duplicates: no-merge-commits, no-squash-commits"}
	${"only-merge-commits, no-squash-commits, no-funny-commits, capitalised-subject-lines"}                                              | ${"Input parameter 'rules' must not contain unknown values: only-merge-commits, no-funny-commits"}
	${"no-easter-eggs, no-squash-commits, no-easter-eggs, no-letters-in-subject-lines, no-squash-commits"}                               | ${"Input parameter 'rules' must not contain unknown values: no-easter-eggs, no-letters-in-subject-lines"}
`(
	"a ruleset from an invalid string of $rawRuleKeys",
	(testRow: {
		readonly rawRuleKeys: string
		readonly expectedErrorMessage: string
	}) => {
		const { rawRuleKeys, expectedErrorMessage } = testRow

		it(`raises an error with a message of '${expectedErrorMessage}'`, () => {
			expect(() => parseConfiguration(rawRuleKeys)).toThrow(
				expectedErrorMessage,
			)
		})
	},
)

function parseConfiguration(rawRuleKeys: string): RuleKeys {
	return parse(ruleKeysConfigurationSchema, rawRuleKeys)
}

function formatRuleKeys(ruleKeys: ReadonlyArray<string>): string {
	return `${count(ruleKeys, "rule", "rules")}: ${ruleKeys.join(", ")}`
}
