import type { noBlankSubjectLines } from "#rules/NoBlankSubjectLines.ts"
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

export type RulesByKey = {
	noBlankSubjectLines: typeof noBlankSubjectLines
	noExcessiveCommitsPerBranch: typeof noExcessiveCommitsPerBranch
	noMergeCommits: typeof noMergeCommits
	noRepeatedSubjectLines: typeof noRepeatedSubjectLines
	noRestrictedFooterLines: typeof noRestrictedFooterLines
	noRevertRevertCommits: typeof noRevertRevertCommits
	noSingleWordSubjectLines: typeof noSingleWordSubjectLines
	noSquashMarkers: typeof noSquashMarkers
	noUnexpectedPunctuation: typeof noUnexpectedPunctuation
	noUnexpectedWhitespace: typeof noUnexpectedWhitespace
	useAuthorEmailPatterns: typeof useAuthorEmailPatterns
	useAuthorNamePatterns: typeof useAuthorNamePatterns
	useCapitalisedSubjectLines: typeof useCapitalisedSubjectLines
	useCommitterEmailPatterns: typeof useCommitterEmailPatterns
	useCommitterNamePatterns: typeof useCommitterNamePatterns
	useConciseSubjectLines: typeof useConciseSubjectLines
	useEmptyLineBeforeBodyLines: typeof useEmptyLineBeforeBodyLines
	useImperativeSubjectLines: typeof useImperativeSubjectLines
	useIssueLinks: typeof useIssueLinks
	useLineWrapping: typeof useLineWrapping
	useSignedCommits: typeof useSignedCommits
}

export type RuleKey = keyof RulesByKey

export type RuleOptions<Key extends RuleKey> = NonNullable<Parameters<RulesByKey[Key]>[1]>
