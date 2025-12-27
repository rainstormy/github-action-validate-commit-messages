import { mockCometPlatform } from "#utilities/platform/CometPlatform.mocks.ts"
import { beforeEach, describe, expect, it } from "vitest"
import type { Configuration, RuleKey } from "#configurations/Configuration.ts"
import { getConfiguration } from "#configurations/GetConfiguration.ts"

describe("the default configuration in the command-line", () => {
	let configuration: Configuration

	beforeEach(async () => {
		mockCometPlatform("cli")
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
		${"noSquashMarkers"}
		${"useAuthorEmailPatterns"}
		${"useAuthorNamePatterns"}
		${"useCommitterEmailPatterns"}
		${"useCommitterNamePatterns"}
		${"useIssueLinks"}
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
		mockCometPlatform("gha")
		configuration = await getConfiguration()
	})

	it.each`
		enabledRuleKey                   | expectedRuleOptions
		${"noCoAuthors"}                 | ${{}}
		${"noMergeCommits"}              | ${{}}
		${"noRepeatedSubjectLines"}      | ${{}}
		${"noRevertRevertCommits"}       | ${{}}
		${"noSingleWordSubjectLines"}    | ${{}}
		${"noSquashMarkers"}             | ${{}}
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
		${"useIssueLinks"}
	`(
		"does not enable $disabledRuleKey'",
		(props: { disabledRuleKey: RuleKey }) => {
			const ruleOptions = configuration.rules[props.disabledRuleKey]
			expect(ruleOptions).toBeNull()
		},
	)
})
