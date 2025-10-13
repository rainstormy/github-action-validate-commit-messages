import type { LegacyV1Commits } from "#legacy-v1/rules/LegacyV1Commit.ts"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule.ts"

export function legacyV1CapitalisedSubjectLines(): LegacyV1Rule {
	return {
		key: "capitalised-subject-lines",
		getInvalidCommits: (refinedCommits: LegacyV1Commits): LegacyV1Commits =>
			refinedCommits
				.filter(({ refinedSubjectLine }) => refinedSubjectLine.length > 0)
				.filter(({ refinedSubjectLine }) => !isCapitalised(refinedSubjectLine)),
	}
}

const firstCharacterIsUppercaseLetterRegex = /^\p{Lu}/u

function isCapitalised(subjectLine: string): boolean {
	return firstCharacterIsUppercaseLetterRegex.test(subjectLine)
}
