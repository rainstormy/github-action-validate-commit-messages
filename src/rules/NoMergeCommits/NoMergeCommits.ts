import type { Rule } from "+rules/Rule"

export function noMergeCommits(): Rule {
	return {
		key: "no-merge-commits",
		getInvalidCommits: (refinedCommits) =>
			refinedCommits.filter(({ parents }) => parents.length > 1),
	}
}
