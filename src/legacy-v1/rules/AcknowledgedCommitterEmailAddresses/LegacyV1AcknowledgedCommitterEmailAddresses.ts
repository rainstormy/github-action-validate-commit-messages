import type { LegacyV1AcknowledgedCommitterEmailAddressesConfiguration } from "#legacy-v1/rules/AcknowledgedCommitterEmailAddresses/LegacyV1AcknowledgedCommitterEmailAddressesConfiguration"
import type {
	LegacyV1Commit,
	LegacyV1UserIdentity,
} from "#legacy-v1/rules/LegacyV1Commit"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule"

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
		getInvalidCommits: (refinedCommits): ReadonlyArray<LegacyV1Commit> =>
			refinedCommits.filter(
				({ committer }) => !hasAcknowledgedCommitterEmailAddress(committer),
			),
	}
}
