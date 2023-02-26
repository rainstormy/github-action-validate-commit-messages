import { defineRule } from "+core"

export const requireNonFixupCommits = defineRule({
	key: "require-non-fixup-commits",
	validate: (commit) => (commit.isFixup ? "invalid" : "valid"),
})
