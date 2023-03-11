import type { Rule } from "+rules"

export function capitalisedSubjectLines(): Rule {
	return {
		key: "capitalised-subject-lines",
		validate: ({ refinedSubjectLine }) =>
			isCapitalised(refinedSubjectLine) ? "valid" : "invalid",
	}
}

const firstCharacterIsUppercaseLetterRegex = /^\p{Lu}/u

function isCapitalised(value: string): boolean {
	return firstCharacterIsUppercaseLetterRegex.test(value)
}
