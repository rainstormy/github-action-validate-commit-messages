import type { Rule } from "+core"
import { defineRule } from "+core"

const key = "capitalised-subject-lines"
export type CapitalisedSubjectLines = Rule<typeof key>

export function capitalisedSubjectLines(): CapitalisedSubjectLines {
	return defineRule({
		key,
		validate: (commit) =>
			isCapitalised(commit.naturalSubjectLine) ? "valid" : "invalid",
	})
}

const firstCharacterIsUppercaseLetterRegex = /^\p{Lu}/u

function isCapitalised(value: string): boolean {
	return firstCharacterIsUppercaseLetterRegex.test(value)
}
