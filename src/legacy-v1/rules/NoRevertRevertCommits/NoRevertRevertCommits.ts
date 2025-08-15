import type { Commit } from "#legacy-v1/rules/Commit"
import type { Rule } from "#legacy-v1/rules/Rule"

export function noRevertRevertCommits(): Rule {
	return {
		key: "no-revert-revert-commits",
		getInvalidCommits: (refinedCommits): ReadonlyArray<Commit> =>
			refinedCommits.filter(({ refinedSubjectLine }) =>
				refinedSubjectLine.startsWith('Revert "Revert "'),
			),
	}
}
