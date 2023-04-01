import type { Rule } from "+rules"

export function noMergeCommits(): Rule {
	return {
		key: "no-merge-commits",
		validate: ({ parents }) => {
			const isMergeCommit = parents.length > 1
			return isMergeCommit ? "invalid" : "valid"
		},
	}
}
