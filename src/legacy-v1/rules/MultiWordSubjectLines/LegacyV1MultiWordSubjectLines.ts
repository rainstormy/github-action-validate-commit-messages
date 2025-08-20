import type { LegacyV1Commits } from "#legacy-v1/rules/LegacyV1Commit"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule"

export function legacyV1MultiWordSubjectLines(): LegacyV1Rule {
	return {
		key: "multi-word-subject-lines",
		getInvalidCommits: (refinedCommits: LegacyV1Commits): LegacyV1Commits =>
			refinedCommits.filter(
				({ refinedSubjectLine }) => countWords(refinedSubjectLine) <= 1,
			),
	}
}

function countWords(subjectLine: string): number {
	return subjectLine.split(" ").length
}
