import type { Commit } from "#rules/Commit"
import type { Rule } from "#rules/Rule"

export function emptyLineAfterSubjectLines(): Rule {
	return {
		key: "empty-line-after-subject-lines",
		getInvalidCommits: (refinedCommits): ReadonlyArray<Commit> =>
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
