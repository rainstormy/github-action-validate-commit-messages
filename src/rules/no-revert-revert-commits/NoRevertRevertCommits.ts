import type { Rule } from "+rules"

export function noRevertRevertCommits(): Rule {
	return {
		key: "no-revert-revert-commits",
		validate: ({ refinedSubjectLine }) => {
			const isRevertOfRevert = refinedSubjectLine.startsWith('Revert "Revert "')
			return isRevertOfRevert ? "invalid" : "valid"
		},
	}
}
