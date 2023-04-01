import type { Rule } from "+rules"

export function multiWordSubjectLines(): Rule {
	return {
		key: "multi-word-subject-lines",
		validate: ({ refinedSubjectLine }) => {
			const numberOfWords = countWords(refinedSubjectLine)
			return numberOfWords <= 1 ? "invalid" : "valid"
		},
	}
}

function countWords(subjectLine: string): number {
	return subjectLine.split(" ").length
}
