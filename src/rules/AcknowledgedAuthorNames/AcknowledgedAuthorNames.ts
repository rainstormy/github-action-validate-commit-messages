import type { AcknowledgedAuthorNamesConfiguration } from "#rules/AcknowledgedAuthorNames/AcknowledgedAuthorNamesConfiguration"
import type { Commit, UserIdentity } from "#rules/Commit"
import type { Rule } from "#rules/Rule"

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
		getInvalidCommits: (refinedCommits): ReadonlyArray<Commit> =>
			refinedCommits.filter(({ author }) => !hasAcknowledgedAuthorName(author)),
	}
}
