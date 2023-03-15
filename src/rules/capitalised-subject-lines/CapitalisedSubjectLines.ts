import type { Rule } from "+rules"

export function capitalisedSubjectLines(): Rule {
	return {
		key: "capitalised-subject-lines",
		validate: ({ refinedSubjectLine }) =>
			refinedSubjectLine.length === 0 || isCapitalised(refinedSubjectLine)
				? "valid"
				: "invalid",
	}
}

const firstCharacterIsUppercaseLetterRegex = /^\p{Lu}/u

function isCapitalised(value: string): boolean {
	return value.length > 0 && firstCharacterIsUppercaseLetterRegex.test(value)
}
