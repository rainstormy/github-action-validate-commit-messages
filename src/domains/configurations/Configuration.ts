import type { Commits } from "#commits/Commit.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import type { noExcessiveCommitsPerBranch } from "#rules/NoExcessiveCommitsPerBranch.ts"
import type { noMergeCommits } from "#rules/NoMergeCommits.ts"
import type { noRepeatedSubjectLines } from "#rules/NoRepeatedSubjectLines.ts"
import type { noRestrictedFooterLines } from "#rules/NoRestrictedFooterLines.ts"
import type { noRevertRevertCommits } from "#rules/NoRevertRevertCommits.ts"
import type { noSingleWordSubjectLines } from "#rules/NoSingleWordSubjectLines.ts"
import type { noSquashMarkers } from "#rules/NoSquashMarkers.ts"
import type { noUnexpectedPunctuation } from "#rules/NoUnexpectedPunctuation.ts"
import type { noUnexpectedWhitespace } from "#rules/NoUnexpectedWhitespace.ts"
import type { useAuthorEmailPatterns } from "#rules/UseAuthorEmailPatterns.ts"
import type { useAuthorNamePatterns } from "#rules/UseAuthorNamePatterns.ts"
import type { useCapitalisedSubjectLines } from "#rules/UseCapitalisedSubjectLines.ts"
import type { useCommitterEmailPatterns } from "#rules/UseCommitterEmailPatterns.ts"
import type { useCommitterNamePatterns } from "#rules/UseCommitterNamePatterns.ts"
import type { useConciseSubjectLines } from "#rules/UseConciseSubjectLines.ts"
import type { useEmptyLineBeforeBodyLines } from "#rules/UseEmptyLineBeforeBodyLines.ts"
import type { useImperativeSubjectLines } from "#rules/UseImperativeSubjectLines.ts"
import type { useIssueLinks } from "#rules/UseIssueLinks.ts"
import type { useLineWrapping } from "#rules/UseLineWrapping.ts"
import type { useSignedCommits } from "#rules/UseSignedCommits.ts"

export type Configuration = {
	tokens: {
		issueLinkPrefixes: Array<string>
	}

	/**
	 * A record of rule keys to rule-specific options (if the rule is enabled) or null (if the rule is disabled).
	 */
	rules: {
		noExcessiveCommitsPerBranch: RuleOptionsOf<typeof noExcessiveCommitsPerBranch>
		noMergeCommits: RuleOptionsOf<typeof noMergeCommits>
		noRepeatedSubjectLines: RuleOptionsOf<typeof noRepeatedSubjectLines>
		noRestrictedFooterLines: RuleOptionsOf<typeof noRestrictedFooterLines>
		noRevertRevertCommits: RuleOptionsOf<typeof noRevertRevertCommits>
		noSingleWordSubjectLines: RuleOptionsOf<typeof noSingleWordSubjectLines>
		noSquashMarkers: RuleOptionsOf<typeof noSquashMarkers>
		noUnexpectedPunctuation: RuleOptionsOf<typeof noUnexpectedPunctuation>
		noUnexpectedWhitespace: RuleOptionsOf<typeof noUnexpectedWhitespace>
		useAuthorEmailPatterns: RuleOptionsOf<typeof useAuthorEmailPatterns>
		useAuthorNamePatterns: RuleOptionsOf<typeof useAuthorNamePatterns>
		useCapitalisedSubjectLines: RuleOptionsOf<typeof useCapitalisedSubjectLines>
		useCommitterEmailPatterns: RuleOptionsOf<typeof useCommitterEmailPatterns>
		useCommitterNamePatterns: RuleOptionsOf<typeof useCommitterNamePatterns>
		useConciseSubjectLines: RuleOptionsOf<typeof useConciseSubjectLines>
		useEmptyLineBeforeBodyLines: RuleOptionsOf<typeof useEmptyLineBeforeBodyLines>
		useImperativeSubjectLines: RuleOptionsOf<typeof useImperativeSubjectLines>
		useIssueLinks: RuleOptionsOf<typeof useIssueLinks>
		useLineWrapping: RuleOptionsOf<typeof useLineWrapping>
		useSignedCommits: RuleOptionsOf<typeof useSignedCommits>
	}
}

export type RuleConfiguration = Configuration["rules"]
export type RuleKey = keyof RuleConfiguration

export type RuleOptionsOf<
	Rule extends (commits: Commits, options: Record<string, unknown> | null) => Concerns,
> = Parameters<Rule>[1]

export type TokenConfiguration = Configuration["tokens"]
