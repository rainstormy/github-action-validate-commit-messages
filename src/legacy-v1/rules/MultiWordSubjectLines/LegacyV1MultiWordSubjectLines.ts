import type { LegacyV1Commit } from "#legacy-v1/rules/LegacyV1Commit"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule"

export function legacyV1MultiWordSubjectLines(): LegacyV1Rule {
	return {
		key: "multi-word-subject-lines",
		getInvalidCommits: (refinedCommits): ReadonlyArray<LegacyV1Commit> =>
			refinedCommits.filter(
				({ refinedSubjectLine }) => countWords(refinedSubjectLine) <= 1,
			),
	}
}

function countWords(subjectLine: string): number {
	return subjectLine.split(" ").length
}
