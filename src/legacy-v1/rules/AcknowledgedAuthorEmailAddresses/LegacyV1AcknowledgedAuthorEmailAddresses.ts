import type { LegacyV1AcknowledgedAuthorEmailAddressesConfiguration } from "#legacy-v1/rules/AcknowledgedAuthorEmailAddresses/LegacyV1AcknowledgedAuthorEmailAddressesConfiguration.ts"
import type {
	LegacyV1Commits,
	LegacyV1UserIdentity,
} from "#legacy-v1/rules/LegacyV1Commit.ts"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule.ts"

export function legacyV1AcknowledgedAuthorEmailAddresses({
	patterns,
}: LegacyV1AcknowledgedAuthorEmailAddressesConfiguration): LegacyV1Rule {
	const acknowledgedEmailAddressRegex = new RegExp(
		patterns.map((pattern) => `^(?:${pattern})$`).join("|"),
		"u",
	)

	function hasAcknowledgedAuthorEmailAddress(
		author: LegacyV1UserIdentity,
	): boolean {
		return (
			author.emailAddress !== null &&
			acknowledgedEmailAddressRegex.test(author.emailAddress)
		)
	}

	return {
		key: "acknowledged-author-email-addresses",
		getInvalidCommits: (refinedCommits: LegacyV1Commits): LegacyV1Commits =>
			refinedCommits.filter(
				({ author }) => !hasAcknowledgedAuthorEmailAddress(author),
			),
	}
}
