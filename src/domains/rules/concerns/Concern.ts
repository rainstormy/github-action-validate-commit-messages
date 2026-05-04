import type { Commit, Commits } from "#commits/Commit.ts"
import type { Configuration } from "#configurations/Configuration.ts"
import type { BodyLineConcern } from "#rules/concerns/BodyLineConcern.ts"
import type { CommitConcern } from "#rules/concerns/CommitConcern.ts"
import type { SubjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { UserIdentityConcern } from "#rules/concerns/UserIdentityConcern.ts"
import { noExcessiveCommitsPerBranch } from "#rules/NoExcessiveCommitsPerBranch.ts"
import { noMergeCommits } from "#rules/NoMergeCommits.ts"
import { noRepeatedSubjectLines } from "#rules/NoRepeatedSubjectLines.ts"
import { noRestrictedFooterLines } from "#rules/NoRestrictedFooterLines.ts"
import { noRevertRevertCommits } from "#rules/NoRevertRevertCommits.ts"
import { noSingleWordSubjectLines } from "#rules/NoSingleWordSubjectLines.ts"
import { noSquashMarkers } from "#rules/NoSquashMarkers.ts"
import { noUnexpectedPunctuation } from "#rules/NoUnexpectedPunctuation.ts"
import { noUnexpectedWhitespace } from "#rules/NoUnexpectedWhitespace.ts"
import { useAuthorEmailPatterns } from "#rules/UseAuthorEmailPatterns.ts"
import { useAuthorNamePatterns } from "#rules/UseAuthorNamePatterns.ts"
import { useCapitalisedSubjectLines } from "#rules/UseCapitalisedSubjectLines.ts"
import { useCommitterEmailPatterns } from "#rules/UseCommitterEmailPatterns.ts"
import { useCommitterNamePatterns } from "#rules/UseCommitterNamePatterns.ts"
import { useConciseSubjectLines } from "#rules/UseConciseSubjectLines.ts"
import { useEmptyLineBeforeBodyLines } from "#rules/UseEmptyLineBeforeBodyLines.ts"
import { useImperativeSubjectLines } from "#rules/UseImperativeSubjectLines.ts"
import { useIssueLinks } from "#rules/UseIssueLinks.ts"
import { useLineWrapping } from "#rules/UseLineWrapping.ts"
import { useSignedCommits } from "#rules/UseSignedCommits.ts"
import { requireNotNullish } from "#utilities/Assertions.ts"

export type Concern = BodyLineConcern | CommitConcern | SubjectLineConcern | UserIdentityConcern
export type Concerns = Array<Concern>

export function concernedCommit(concern: Concern, commits: Commits): Commit {
	return requireNotNullish(
		commits.find(({ sha }) => sha === concern.commitSha),
		() => `Concerned commit ${concern.commitSha} not found`,
	)
}

export function mapCommitsToConcerns(commits: Commits, configuration: Configuration): Concerns {
	const rules = configuration.rules
	return [
		...noExcessiveCommitsPerBranch(commits, rules.noExcessiveCommitsPerBranch),
		...noMergeCommits(commits, rules.noMergeCommits),
		...noRepeatedSubjectLines(commits, rules.noRepeatedSubjectLines),
		...noRestrictedFooterLines(commits, rules.noRestrictedFooterLines),
		...noRevertRevertCommits(commits, rules.noRevertRevertCommits),
		...noSingleWordSubjectLines(commits, rules.noSingleWordSubjectLines),
		...noSquashMarkers(commits, rules.noSquashMarkers),
		...noUnexpectedPunctuation(commits, rules.noUnexpectedPunctuation),
		...noUnexpectedWhitespace(commits, rules.noUnexpectedWhitespace),
		...useAuthorEmailPatterns(commits, rules.useAuthorEmailPatterns),
		...useAuthorNamePatterns(commits, rules.useAuthorNamePatterns),
		...useCapitalisedSubjectLines(commits, rules.useCapitalisedSubjectLines),
		...useCommitterEmailPatterns(commits, rules.useCommitterEmailPatterns),
		...useCommitterNamePatterns(commits, rules.useCommitterNamePatterns),
		...useConciseSubjectLines(commits, rules.useConciseSubjectLines),
		...useEmptyLineBeforeBodyLines(commits, rules.useEmptyLineBeforeBodyLines),
		...useImperativeSubjectLines(commits, rules.useImperativeSubjectLines),
		...useIssueLinks(commits, rules.useIssueLinks),
		...useLineWrapping(commits, rules.useLineWrapping),
		...useSignedCommits(commits, rules.useSignedCommits),
	]
}
