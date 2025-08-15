import type { LegacyV1AcknowledgedAuthorNamesConfiguration } from "#legacy-v1/rules/AcknowledgedAuthorNames/LegacyV1AcknowledgedAuthorNamesConfiguration"
import type {
	LegacyV1Commit,
	LegacyV1UserIdentity,
} from "#legacy-v1/rules/LegacyV1Commit"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule"

export function legacyV1AcknowledgedAuthorNames({
	patterns,
}: LegacyV1AcknowledgedAuthorNamesConfiguration): LegacyV1Rule {
	const acknowledgedNameRegex = new RegExp(
		patterns.map((pattern) => `^(?:${pattern})$`).join("|"),
		"u",
	)

	function hasAcknowledgedAuthorName(author: LegacyV1UserIdentity): boolean {
		return author.name !== null && acknowledgedNameRegex.test(author.name)
	}

	return {
		key: "acknowledged-author-names",
		getInvalidCommits: (refinedCommits): ReadonlyArray<LegacyV1Commit> =>
			refinedCommits.filter(({ author }) => !hasAcknowledgedAuthorName(author)),
	}
}
