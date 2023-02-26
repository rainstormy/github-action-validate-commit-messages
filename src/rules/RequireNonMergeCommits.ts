import type { Rule } from "+core"
import { defineRule } from "+core"

const key = "require-non-merge-commits"
export type RequireNonMergeCommits = Rule<typeof key>

export function requireNonMergeCommits(): RequireNonMergeCommits {
	return defineRule({
		key,
		validate: (commit) => (commit.isMerge ? "invalid" : "valid"),
	})
}
