import { injectCometPlatform } from "#utilities/platform/CometPlatform.mocks.ts"
import { beforeEach, describe, expect, it } from "vitest"
import type { Configuration, RuleKey } from "#configurations/Configuration.ts"
import { getConfiguration } from "#configurations/GetConfiguration.ts"

describe("the default configuration in the command-line", () => {
	let configuration: Configuration

	beforeEach(async () => {
		injectCometPlatform("cli")
		configuration = await getConfiguration()
	})

	it.each`
		enabledRuleKey                   | expectedRuleOptions
		${"noCoAuthors"}                 | ${{}}
		${"noMergeCommits"}              | ${{}}
		${"noSingleWordSubjectLines"}    | ${{}}
		${"noUnexpectedPunctuation"}     | ${{}}
		${"noUnexpectedWhitespace"}      | ${{}}
		${"useCapitalisedSubjectLines"}  | ${{}}
		${"useConciseSubjectLines"}      | ${{}}
		${"useEmptyLineBeforeBodyLines"} | ${{}}
		${"useImperativeSubjectLines"}   | ${{}}
		${"useLineWrapping"}             | ${{}}
	`(
		"enables $enabledRuleKey",
		(props: { enabledRuleKey: RuleKey; expectedRuleOptions: object }) => {
			const ruleOptions = configuration.rules[props.enabledRuleKey]
			expect(ruleOptions).toEqual(props.expectedRuleOptions)
		},
	)

	it.each`
		disabledRuleKey
		${"noRepeatedSubjectLines"}
		${"noRevertRevertCommits"}
		${"noSquashPrefixes"}
		${"useAuthorEmailPatterns"}
		${"useAuthorNamePatterns"}
		${"useCommitterEmailPatterns"}
		${"useCommitterNamePatterns"}
		${"useIssueReferences"}
	`(
		"does not enable $disabledRuleKey'",
		(props: { disabledRuleKey: RuleKey }) => {
			const ruleOptions = configuration.rules[props.disabledRuleKey]
			expect(ruleOptions).toBeNull()
		},
	)
})

describe("the default configuration in GitHub Actions", () => {
	let configuration: Configuration

	beforeEach(async () => {
		injectCometPlatform("gha")
		configuration = await getConfiguration()
	})

	it.each`
		enabledRuleKey                   | expectedRuleOptions
		${"noCoAuthors"}                 | ${{}}
		${"noMergeCommits"}              | ${{}}
		${"noRepeatedSubjectLines"}      | ${{}}
		${"noRevertRevertCommits"}       | ${{}}
		${"noSingleWordSubjectLines"}    | ${{}}
		${"noSquashPrefixes"}            | ${{}}
		${"noUnexpectedPunctuation"}     | ${{}}
		${"noUnexpectedWhitespace"}      | ${{}}
		${"useCapitalisedSubjectLines"}  | ${{}}
		${"useConciseSubjectLines"}      | ${{}}
		${"useEmptyLineBeforeBodyLines"} | ${{}}
		${"useImperativeSubjectLines"}   | ${{}}
		${"useLineWrapping"}             | ${{}}
	`(
		"enables $enabledRuleKey",
		(props: { enabledRuleKey: RuleKey; expectedRuleOptions: object }) => {
			const ruleOptions = configuration.rules[props.enabledRuleKey]
			expect(ruleOptions).toEqual(props.expectedRuleOptions)
		},
	)

	it.each`
		disabledRuleKey
		${"useAuthorEmailPatterns"}
		${"useAuthorNamePatterns"}
		${"useCommitterEmailPatterns"}
		${"useCommitterNamePatterns"}
		${"useIssueReferences"}
	`(
		"does not enable $disabledRuleKey'",
		(props: { disabledRuleKey: RuleKey }) => {
			const ruleOptions = configuration.rules[props.disabledRuleKey]
			expect(ruleOptions).toBeNull()
		},
	)
})
