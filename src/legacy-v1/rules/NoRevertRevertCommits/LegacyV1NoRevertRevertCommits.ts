import type { LegacyV1Commits } from "#legacy-v1/rules/LegacyV1Commit"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule"

export function legacyV1NoRevertRevertCommits(): LegacyV1Rule {
	return {
		key: "no-revert-revert-commits",
		getInvalidCommits: (refinedCommits: LegacyV1Commits): LegacyV1Commits =>
			refinedCommits.filter(({ refinedSubjectLine }) =>
				refinedSubjectLine.startsWith('Revert "Revert "'),
			),
	}
}
