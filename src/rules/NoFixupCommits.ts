import type { Rule } from "+core"
import { defineRule } from "+core"

const key = "no-fixup-commits"
export type NoFixupCommits = Rule<typeof key>

export function noFixupCommits(): NoFixupCommits {
	return defineRule({
		key,
		validate: (commit) => (commit.isFixup ? "invalid" : "valid"),
	})
}
