import type {
	AcknowledgedAuthorNamesConfiguration,
	Rule,
	UserIdentity,
} from "+rules"

export function acknowledgedAuthorNames({
	patterns,
}: AcknowledgedAuthorNamesConfiguration): Rule {
	const acknowledgedNameRegex = new RegExp(
		patterns.map((pattern) => `^(?:${pattern})$`).join("|"),
		"u",
	)

	function hasAcknowledgedAuthorName(author: UserIdentity): boolean {
		return author.name !== null && acknowledgedNameRegex.test(author.name)
	}

	return {
		key: "acknowledged-author-names",
		getInvalidCommits: (refinedCommits) =>
			refinedCommits.filter(({ author }) => !hasAcknowledgedAuthorName(author)),
	}
}
