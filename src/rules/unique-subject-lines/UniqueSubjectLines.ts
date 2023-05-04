import type { Rule } from "+rules"

export function uniqueSubjectLines(): Rule {
	return {
		key: "unique-subject-lines",
		getInvalidCommits: (refinedCommits) => {
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
