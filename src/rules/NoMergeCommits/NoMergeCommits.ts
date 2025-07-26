import type { Commit } from "#rules/Commit"
import type { Rule } from "#rules/Rule"

export function noMergeCommits(): Rule {
	return {
		key: "no-merge-commits",
		getInvalidCommits: (refinedCommits): ReadonlyArray<Commit> =>
			refinedCommits.filter(({ parents }) => parents.length > 1),
	}
}
