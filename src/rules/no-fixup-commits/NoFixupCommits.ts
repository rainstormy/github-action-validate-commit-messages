import type { Rule } from "+rules"

export function noFixupCommits(): Rule {
	return {
		key: "no-fixup-commits",
		validate: ({ modifiers }) => {
			const isFixupCommit =
				modifiers.includes("fixup!") || modifiers.includes("amend!")
			return isFixupCommit ? "invalid" : "valid"
		},
	}
}
