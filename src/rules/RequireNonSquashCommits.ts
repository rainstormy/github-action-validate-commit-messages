import { defineRule } from "+core"

export const requireNonSquashCommits = defineRule({
	key: "require-non-squash-commits",
	validate: (commit) => (commit.isSquash ? "invalid" : "valid"),
})
