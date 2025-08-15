import type { Commit } from "#legacy-v1/rules/Commit"
import type { Rule } from "#legacy-v1/rules/Rule"

export function noMergeCommits(): Rule {
	return {
		key: "no-merge-commits",
		getInvalidCommits: (refinedCommits): ReadonlyArray<Commit> =>
			refinedCommits.filter(({ parents }) => parents.length > 1),
	}
}
