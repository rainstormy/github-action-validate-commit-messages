import type { Rule } from "+core"
import { defineRule } from "+core"

const key = "no-squash-commits"
export type NoSquashCommits = Rule<typeof key>

export function noSquashCommits(): NoSquashCommits {
	return defineRule({
		key,
		validate: ({ modifiers }) => {
			const isSquashCommit = modifiers.includes("squash!")
			return isSquashCommit ? "invalid" : "valid"
		},
	})
}
