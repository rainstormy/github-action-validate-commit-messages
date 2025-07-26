import type { AcknowledgedCommitterNamesConfiguration } from "#rules/AcknowledgedCommitterNames/AcknowledgedCommitterNamesConfiguration"
import type { Commit, UserIdentity } from "#rules/Commit"
import type { Rule } from "#rules/Rule"

export function acknowledgedCommitterNames({
	patterns,
}: AcknowledgedCommitterNamesConfiguration): Rule {
	const acknowledgedNameRegex = new RegExp(
		patterns.map((pattern) => `^(?:${pattern})$`).join("|"),
		"u",
	)

	function hasAcknowledgedCommitterName(committer: UserIdentity): boolean {
		return committer.name !== null && acknowledgedNameRegex.test(committer.name)
	}

	return {
		key: "acknowledged-committer-names",
		getInvalidCommits: (refinedCommits): ReadonlyArray<Commit> =>
			refinedCommits.filter(
				({ committer }) => !hasAcknowledgedCommitterName(committer),
			),
	}
}
