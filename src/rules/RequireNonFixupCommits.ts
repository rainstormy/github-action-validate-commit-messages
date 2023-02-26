import type { Rule } from "+core"
import { defineRule } from "+core"

const key = "require-non-fixup-commits"
export type RequireNonFixupCommits = Rule<typeof key>

export function requireNonFixupCommits(): RequireNonFixupCommits {
	return defineRule({
		key,
		validate: (commit) => (commit.isFixup ? "invalid" : "valid"),
	})
}
