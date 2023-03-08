import type { Rule } from "+core"
import { defineRule } from "+core"

const key = "no-fixup-commits"
export type NoFixupCommits = Rule<typeof key>

export function noFixupCommits(): NoFixupCommits {
	return defineRule({
		key,
		validate: ({ modifier }) => {
			const isFixupCommit = modifier === "fixup!" || modifier === "amend!"
			return isFixupCommit ? "invalid" : "valid"
		},
	})
}
