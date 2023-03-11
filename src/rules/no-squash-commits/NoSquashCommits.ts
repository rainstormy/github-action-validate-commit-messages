import type { Rule } from "+rules"

export function noSquashCommits(): Rule {
	return {
		key: "no-squash-commits",
		validate: ({ squashPrefixes }) => {
			const isSquashCommit = squashPrefixes.length > 0
			return isSquashCommit ? "invalid" : "valid"
		},
	}
}
