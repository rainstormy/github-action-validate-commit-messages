import type { Rule } from "+rules/Rule"

export function multiWordSubjectLines(): Rule {
	return {
		key: "multi-word-subject-lines",
		getInvalidCommits: (refinedCommits) =>
			refinedCommits.filter(
				({ refinedSubjectLine }) => countWords(refinedSubjectLine) <= 1,
			),
	}
}

function countWords(subjectLine: string): number {
	return subjectLine.split(" ").length
}
