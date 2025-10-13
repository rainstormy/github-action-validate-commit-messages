import type { LegacyV1AcknowledgedAuthorNamesConfiguration } from "#legacy-v1/rules/AcknowledgedAuthorNames/LegacyV1AcknowledgedAuthorNamesConfiguration.ts"
import type {
	LegacyV1Commits,
	LegacyV1UserIdentity,
} from "#legacy-v1/rules/LegacyV1Commit.ts"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule.ts"

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
		getInvalidCommits: (refinedCommits: LegacyV1Commits): LegacyV1Commits =>
			refinedCommits.filter(({ author }) => !hasAcknowledgedAuthorName(author)),
	}
}
