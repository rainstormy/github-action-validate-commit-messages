import type { Commit } from "#rules/Commit"
import type { Rule } from "#rules/Rule"

export function noRevertRevertCommits(): Rule {
	return {
		key: "no-revert-revert-commits",
		getInvalidCommits: (refinedCommits): ReadonlyArray<Commit> =>
			refinedCommits.filter(({ refinedSubjectLine }) =>
				refinedSubjectLine.startsWith('Revert "Revert "'),
			),
	}
}
