import type { AcknowledgedAuthorNamesConfiguration } from "#legacy-v1/rules/AcknowledgedAuthorNames/AcknowledgedAuthorNamesConfiguration"
import type { Commit, UserIdentity } from "#legacy-v1/rules/Commit"
import type { Rule } from "#legacy-v1/rules/Rule"

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
