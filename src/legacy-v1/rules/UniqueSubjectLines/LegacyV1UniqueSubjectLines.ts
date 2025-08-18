import type { LegacyV1Commits } from "#legacy-v1/rules/LegacyV1Commit"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule"

export function legacyV1UniqueSubjectLines(): LegacyV1Rule {
	return {
		key: "unique-subject-lines",
		getInvalidCommits: (refinedCommits: LegacyV1Commits): LegacyV1Commits => {
			const commitsToConsider = refinedCommits
				.filter(
					({ refinedSubjectLine }) =>
						!refinedSubjectLine.startsWith('Revert "'),
				)
				.filter(({ parents }) => parents.length === 1)
				.filter(({ squashPrefixes }) => squashPrefixes.length === 0)

			const subjectLines = commitsToConsider.map(
				(commit) => commit.originalSubjectLine,
			)

			function isRepeatingSubjectLineOfPreviousCommit(
				originalSubjectLine: string,
				commitIndex: number,
			): boolean {
				return subjectLines.indexOf(originalSubjectLine) !== commitIndex
			}

			return commitsToConsider.filter(({ originalSubjectLine }, index) =>
				isRepeatingSubjectLineOfPreviousCommit(originalSubjectLine, index),
			)
		},
	}
}
