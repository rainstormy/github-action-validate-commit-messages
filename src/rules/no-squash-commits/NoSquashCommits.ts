import type { Rule } from "+rules"

export function noSquashCommits(): Rule {
	return {
		key: "no-squash-commits",
		validate: ({ modifiers }) => {
			const isSquashCommit = modifiers.includes("squash!")
			return isSquashCommit ? "invalid" : "valid"
		},
	}
}
