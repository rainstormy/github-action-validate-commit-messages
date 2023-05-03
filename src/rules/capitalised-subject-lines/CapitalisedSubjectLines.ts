import type { Rule } from "+rules"

export function capitalisedSubjectLines(): Rule {
	return {
		key: "capitalised-subject-lines",
		getInvalidCommits: (refinedCommits) =>
			refinedCommits
				.filter(({ refinedSubjectLine }) => refinedSubjectLine.length > 0)
				.filter(({ refinedSubjectLine }) => !isCapitalised(refinedSubjectLine)),
	}
}

const firstCharacterIsUppercaseLetterRegex = /^\p{Lu}/u

function isCapitalised(subjectLine: string): boolean {
	return firstCharacterIsUppercaseLetterRegex.test(subjectLine)
}
