import type { Commits } from "#commits/Commit.ts"
import type { RulesetConfiguration } from "#configurations/Configuration.ts"
import type { BodyLineConcern } from "#rules/concerns/BodyLineConcern.ts"
import type { CommitConcern } from "#rules/concerns/CommitConcern.ts"
import type { SubjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { UserIdentityConcern } from "#rules/concerns/UserIdentityConcern.ts"
import { noBlankSubjectLines } from "#rules/NoBlankSubjectLines.ts"
import { noExcessiveCommitsPerBranch } from "#rules/NoExcessiveCommitsPerBranch.ts"
import { noExcessiveWhitespace } from "#rules/NoExcessiveWhitespace.ts"
import { noMergeCommits } from "#rules/NoMergeCommits.ts"
import { noRepeatedSubjectLines } from "#rules/NoRepeatedSubjectLines.ts"
import { noRestrictedTrailers } from "#rules/NoRestrictedTrailers.ts"
import { noRevertRevertCommits } from "#rules/NoRevertRevertCommits.ts"
import { noSingleWordSubjectLines } from "#rules/NoSingleWordSubjectLines.ts"
import { noSquashMarkers } from "#rules/NoSquashMarkers.ts"
import { noUnexpectedPunctuation } from "#rules/NoUnexpectedPunctuation.ts"
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
import { type Comparator, uniqueItemsByKey } from "#utilities/Arrays.ts"
import { requireNotNullish } from "#utilities/Assertions.ts"

export type Concern = BodyLineConcern | CommitConcern | SubjectLineConcern | UserIdentityConcern
export type Concerns = Array<Concern>

export function mapCommitsToConcerns(commits: Commits, rules: RulesetConfiguration): Concerns {
	const allConcerns: Concerns = [
		...noBlankSubjectLines(commits, rules.noBlankSubjectLines),
		...noExcessiveCommitsPerBranch(commits, rules.noExcessiveCommitsPerBranch),
		...noExcessiveWhitespace(commits, rules.noExcessiveWhitespace),
		...noMergeCommits(commits, rules.noMergeCommits),
		...noRepeatedSubjectLines(commits, rules.noRepeatedSubjectLines),
		...noRestrictedTrailers(commits, rules.noRestrictedTrailers),
		...noRevertRevertCommits(commits, rules.noRevertRevertCommits),
		...noSingleWordSubjectLines(commits, rules.noSingleWordSubjectLines),
		...noSquashMarkers(commits, rules.noSquashMarkers),
		...noUnexpectedPunctuation(commits, rules.noUnexpectedPunctuation),
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

	const uniqueConcerns = uniqueItemsByKey(allConcerns, (concern) => concern.key)

	if (uniqueConcerns.length === 0) {
		return []
	}

	const indicesByCommitSha = new Map(commits.map((commit, index) => [commit.sha, index]))

	const byLocation: Comparator<Concern> = (a, b) => {
		if (a.commitSha === b.commitSha) {
			return a.key.localeCompare(b.key, "en", { numeric: true })
		}

		const commitIndexA = requireNotNullish(
			indicesByCommitSha.get(a.commitSha),
			() => `Concerned commit ${a.commitSha} not found`,
		)
		const commitIndexB = requireNotNullish(
			indicesByCommitSha.get(b.commitSha),
			() => `Concerned commit ${b.commitSha} not found`,
		)

		return commitIndexA - commitIndexB
	}

	return uniqueConcerns.toSorted(byLocation)
}
