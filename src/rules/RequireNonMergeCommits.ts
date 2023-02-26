import { defineRule } from "+core"

export const requireNonMergeCommits = defineRule({
	key: "require-non-merge-commits",
	validate: (commit) => (commit.isMerge ? "invalid" : "valid"),
})
