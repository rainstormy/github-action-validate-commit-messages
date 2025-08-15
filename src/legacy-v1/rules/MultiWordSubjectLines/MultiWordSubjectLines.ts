import type { Commit } from "#legacy-v1/rules/Commit"
import type { Rule } from "#legacy-v1/rules/Rule"

export function multiWordSubjectLines(): Rule {
	return {
		key: "multi-word-subject-lines",
		getInvalidCommits: (refinedCommits): ReadonlyArray<Commit> =>
			refinedCommits.filter(
				({ refinedSubjectLine }) => countWords(refinedSubjectLine) <= 1,
			),
	}
}

function countWords(subjectLine: string): number {
	return subjectLine.split(" ").length
}
