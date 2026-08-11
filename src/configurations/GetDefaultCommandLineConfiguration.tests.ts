import { expect, it } from "vitest"
import { getDefaultCommandLineConfiguration } from "#configurations/GetDefaultCommandLineConfiguration.ts"
import type { RuleKey } from "#rules/Rule.ts"

const configuration = getDefaultCommandLineConfiguration()

it("recognises GitHub- and GitLab-style issue links", () => {
	expect(configuration.tokens.issueLinks?.prefixes).toEqual(["#", "GH-", "GL-"])
})

it("has no issue link wildcards", () => {
	expect(configuration.tokens.issueLinks?.wildcards).toEqual([])
})

it.each`
	enabledRuleKey                   | expectedRuleOptions
	${"noBlankSubjectLines"}         | ${{}}
	${"noExcessiveCommitsPerBranch"} | ${{ maxCommits: 10 }}
	${"noExcessiveWhitespace"}       | ${{}}
	${"noMergeCommits"}              | ${{}}
	${"noSingleWordSubjectLines"}    | ${{}}
	${"noUnexpectedPunctuation"}     | ${{}}
	${"useCapitalisedSubjectLines"}  | ${{}}
	${"useConciseSubjectLines"}      | ${{ maxLength: 50 }}
	${"useEmptyLineBeforeBodyLines"} | ${{}}
	${"useImperativeSubjectLines"}   | ${{ whitelist: [] }}
	${"useLineWrapping"}             | ${{ maxLength: 72 }}
	${"useSignedCommits"}            | ${{}}
`("enables $enabledRuleKey", (props: { enabledRuleKey: RuleKey; expectedRuleOptions: object }) => {
	const ruleOptions = configuration.rules[props.enabledRuleKey]
	expect(ruleOptions).toEqual(props.expectedRuleOptions)
})

it.each`
	disabledRuleKey
	${"noRepeatedSubjectLines"}
	${"noRestrictedTrailers"}
	${"noRevertRevertCommits"}
	${"noSquashMarkers"}
	${"useAuthorEmailPatterns"}
	${"useAuthorNamePatterns"}
	${"useCommitterEmailPatterns"}
	${"useCommitterNamePatterns"}
	${"useIssueLinks"}
`("does not enable $disabledRuleKey'", (props: { disabledRuleKey: RuleKey }) => {
	const ruleOptions = configuration.rules[props.disabledRuleKey]
	expect(ruleOptions).toBeNull()
})
