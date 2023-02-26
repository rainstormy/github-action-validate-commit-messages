import type { Rule } from "+core"
import { defineRule } from "+core"

const key = "require-non-squash-commits"
export type RequireNonSquashCommits = Rule<typeof key>

export function requireNonSquashCommits(): RequireNonSquashCommits {
	return defineRule({
		key,
		validate: (commit) => (commit.isSquash ? "invalid" : "valid"),
	})
}
