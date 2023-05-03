import type {
	AcknowledgedCommitterNamesConfiguration,
	Rule,
	UserIdentity,
} from "+rules"

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
		getInvalidCommits: (refinedCommits) =>
			refinedCommits.filter(
				({ committer }) => !hasAcknowledgedCommitterName(committer),
			),
	}
}
