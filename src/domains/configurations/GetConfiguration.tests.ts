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

	it("does not define any issue reference patterns", () => {
		expect(configuration.tokens.issueReferencePatterns).toEqual([])
	})

	it("defines three squash markers", () => {
		expect(configuration.tokens.squashMarkers).toEqual([
			"amend!",
			"fixup!",
			"squash!",
		])
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
		mockCometPlatform("gha")
		configuration = await getConfiguration()
	})

	it("does not define any issue reference patterns", () => {
		expect(configuration.tokens.issueReferencePatterns).toEqual([])
	})

	it("defines three squash markers", () => {
		expect(configuration.tokens.squashMarkers).toEqual([
			"amend!",
			"fixup!",
			"squash!",
		])
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
