import { defineRule } from "+core"

export const requireCapitalisedSubjectLines = defineRule({
	key: "require-capitalised-subject-lines",
	validate: (commit) =>
		isCapitalised(commit.naturalSubjectLine) ? "valid" : "invalid",
})

const firstCharacterIsUppercaseLetterRegex = /^\p{Lu}/u

function isCapitalised(value: string): boolean {
	return firstCharacterIsUppercaseLetterRegex.test(value)
}
