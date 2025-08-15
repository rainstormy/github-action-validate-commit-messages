import type { LegacyV1AcknowledgedAuthorEmailAddressesConfiguration } from "#legacy-v1/rules/AcknowledgedAuthorEmailAddresses/LegacyV1AcknowledgedAuthorEmailAddressesConfiguration"
import type {
	LegacyV1Commit,
	LegacyV1UserIdentity,
} from "#legacy-v1/rules/LegacyV1Commit"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule"

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
		getInvalidCommits: (refinedCommits): ReadonlyArray<LegacyV1Commit> =>
			refinedCommits.filter(
				({ author }) => !hasAcknowledgedAuthorEmailAddress(author),
			),
	}
}
