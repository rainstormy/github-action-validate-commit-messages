import type { Rule } from "+core"
import { defineRule } from "+core"

const key = "no-merge-commits"
export type NoMergeCommits = Rule<typeof key>

export function noMergeCommits(): NoMergeCommits {
	return defineRule({
		key,
		validate: ({ parents }) => (parents.length > 1 ? "invalid" : "valid"),
	})
}
