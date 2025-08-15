import type { LegacyV1Commit } from "#legacy-v1/rules/LegacyV1Commit"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule"

export function legacyV1CapitalisedSubjectLines(): LegacyV1Rule {
	return {
		key: "capitalised-subject-lines",
		getInvalidCommits: (refinedCommits): ReadonlyArray<LegacyV1Commit> =>
			refinedCommits
				.filter(({ refinedSubjectLine }) => refinedSubjectLine.length > 0)
				.filter(({ refinedSubjectLine }) => !isCapitalised(refinedSubjectLine)),
	}
}

const firstCharacterIsUppercaseLetterRegex = /^\p{Lu}/u

function isCapitalised(subjectLine: string): boolean {
	return firstCharacterIsUppercaseLetterRegex.test(subjectLine)
}
