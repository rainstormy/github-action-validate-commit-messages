import type { LegacyV1Commit } from "#legacy-v1/rules/LegacyV1Commit"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule"

export function legacyV1NoRevertRevertCommits(): LegacyV1Rule {
	return {
		key: "no-revert-revert-commits",
		getInvalidCommits: (refinedCommits): ReadonlyArray<LegacyV1Commit> =>
			refinedCommits.filter(({ refinedSubjectLine }) =>
				refinedSubjectLine.startsWith('Revert "Revert "'),
			),
	}
}
