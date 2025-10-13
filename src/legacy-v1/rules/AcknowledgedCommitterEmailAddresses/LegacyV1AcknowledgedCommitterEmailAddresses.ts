import type { LegacyV1AcknowledgedCommitterEmailAddressesConfiguration } from "#legacy-v1/rules/AcknowledgedCommitterEmailAddresses/LegacyV1AcknowledgedCommitterEmailAddressesConfiguration.ts"
import type {
	LegacyV1Commits,
	LegacyV1UserIdentity,
} from "#legacy-v1/rules/LegacyV1Commit.ts"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule.ts"

export function legacyV1AcknowledgedCommitterEmailAddresses({
	patterns,
}: LegacyV1AcknowledgedCommitterEmailAddressesConfiguration): LegacyV1Rule {
	const acknowledgedEmailAddressRegex = new RegExp(
		patterns.map((pattern) => `^(?:${pattern})$`).join("|"),
		"u",
	)

	function hasAcknowledgedCommitterEmailAddress(
		committer: LegacyV1UserIdentity,
	): boolean {
		return (
			committer.emailAddress !== null &&
			acknowledgedEmailAddressRegex.test(committer.emailAddress)
		)
	}

	return {
		key: "acknowledged-committer-email-addresses",
		getInvalidCommits: (refinedCommits: LegacyV1Commits): LegacyV1Commits =>
			refinedCommits.filter(
				({ committer }) => !hasAcknowledgedCommitterEmailAddress(committer),
			),
	}
}
