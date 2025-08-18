import type { LegacyV1Commits } from "#legacy-v1/rules/LegacyV1Commit"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule"

export function legacyV1EmptyLineAfterSubjectLines(): LegacyV1Rule {
	return {
		key: "empty-line-after-subject-lines",
		getInvalidCommits: (refinedCommits: LegacyV1Commits): LegacyV1Commits =>
			refinedCommits
				.filter(({ bodyLines }) => bodyLines.length > 0)
				.filter(({ bodyLines }) => !hasOneEmptyLineAfterSubjectLine(bodyLines)),
	}
}

function hasOneEmptyLineAfterSubjectLine(
	bodyLines: ReadonlyArray<string>,
): boolean {
	return bodyLines[0] === "" && (bodyLines.length === 1 || bodyLines[1] !== "")
}
