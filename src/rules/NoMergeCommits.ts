import type { Rule } from "+core"
import { defineRule } from "+core"

const key = "no-merge-commits"
export type NoMergeCommits = Rule<typeof key>

export function noMergeCommits(): NoMergeCommits {
	return defineRule({
		key,
		validate: ({ parents }) => {
			const isMergeCommit = parents.length > 1
			return isMergeCommit ? "invalid" : "valid"
		},
	})
}
