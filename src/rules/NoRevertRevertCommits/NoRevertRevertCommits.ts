import type { Rule } from "+rules/Rule"

export function noRevertRevertCommits(): Rule {
	return {
		key: "no-revert-revert-commits",
		getInvalidCommits: (refinedCommits) =>
			refinedCommits.filter(({ refinedSubjectLine }) =>
				refinedSubjectLine.startsWith('Revert "Revert "'),
			),
	}
}
