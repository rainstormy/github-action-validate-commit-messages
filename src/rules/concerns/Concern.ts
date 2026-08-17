import type { Commits } from "#commits/Commit.ts"
import type { RulesetConfiguration } from "#configurations/RulesetConfiguration.ts"
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

export function mapCommitsToConcerns(commits: Commits, ruleset: RulesetConfiguration): Concerns {
	const allConcerns: Concerns = [
		...noBlankSubjectLines(commits, ruleset),
		...noExcessiveCommitsPerBranch(commits, ruleset),
		...noExcessiveWhitespace(commits, ruleset),
		...noMergeCommits(commits, ruleset),
		...noRepeatedSubjectLines(commits, ruleset),
		...noRestrictedTrailers(commits, ruleset),
		...noRevertRevertCommits(commits, ruleset),
		...noSingleWordSubjectLines(commits, ruleset),
		...noSquashMarkers(commits, ruleset),
		...noUnexpectedPunctuation(commits, ruleset),
		...useAuthorEmailPatterns(commits, ruleset),
		...useAuthorNamePatterns(commits, ruleset),
		...useCapitalisedSubjectLines(commits, ruleset),
		...useCommitterEmailPatterns(commits, ruleset),
		...useCommitterNamePatterns(commits, ruleset),
		...useConciseSubjectLines(commits, ruleset),
		...useEmptyLineBeforeBodyLines(commits, ruleset),
		...useImperativeSubjectLines(commits, ruleset),
		...useIssueLinks(commits, ruleset),
		...useLineWrapping(commits, ruleset),
		...useSignedCommits(commits, ruleset),
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
