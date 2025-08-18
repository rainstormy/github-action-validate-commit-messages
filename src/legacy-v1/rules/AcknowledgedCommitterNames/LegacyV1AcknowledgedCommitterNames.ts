import type { LegacyV1AcknowledgedCommitterNamesConfiguration } from "#legacy-v1/rules/AcknowledgedCommitterNames/LegacyV1AcknowledgedCommitterNamesConfiguration"
import type {
	LegacyV1Commits,
	LegacyV1UserIdentity,
} from "#legacy-v1/rules/LegacyV1Commit"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule"

export function legacyV1AcknowledgedCommitterNames({
	patterns,
}: LegacyV1AcknowledgedCommitterNamesConfiguration): LegacyV1Rule {
	const acknowledgedNameRegex = new RegExp(
		patterns.map((pattern) => `^(?:${pattern})$`).join("|"),
		"u",
	)

	function hasAcknowledgedCommitterName(
		committer: LegacyV1UserIdentity,
	): boolean {
		return committer.name !== null && acknowledgedNameRegex.test(committer.name)
	}

	return {
		key: "acknowledged-committer-names",
		getInvalidCommits: (refinedCommits: LegacyV1Commits): LegacyV1Commits =>
			refinedCommits.filter(
				({ committer }) => !hasAcknowledgedCommitterName(committer),
			),
	}
}
