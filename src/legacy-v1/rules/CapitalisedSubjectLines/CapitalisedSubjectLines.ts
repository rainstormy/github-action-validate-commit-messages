import type { Commit } from "#legacy-v1/rules/Commit"
import type { Rule } from "#legacy-v1/rules/Rule"

export function capitalisedSubjectLines(): Rule {
	return {
		key: "capitalised-subject-lines",
		getInvalidCommits: (refinedCommits): ReadonlyArray<Commit> =>
			refinedCommits
				.filter(({ refinedSubjectLine }) => refinedSubjectLine.length > 0)
				.filter(({ refinedSubjectLine }) => !isCapitalised(refinedSubjectLine)),
	}
}

const firstCharacterIsUppercaseLetterRegex = /^\p{Lu}/u

function isCapitalised(subjectLine: string): boolean {
	return firstCharacterIsUppercaseLetterRegex.test(subjectLine)
}
