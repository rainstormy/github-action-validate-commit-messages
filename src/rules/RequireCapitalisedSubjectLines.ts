import type { Rule } from "+core"
import { defineRule } from "+core"

const key = "require-capitalised-subject-lines"
export type RequireCapitalisedSubjectLines = Rule<typeof key>

export function requireCapitalisedSubjectLines(): RequireCapitalisedSubjectLines {
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
