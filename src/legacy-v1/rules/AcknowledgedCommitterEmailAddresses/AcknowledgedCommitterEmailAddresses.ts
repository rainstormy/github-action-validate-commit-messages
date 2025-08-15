import type { AcknowledgedCommitterEmailAddressesConfiguration } from "#legacy-v1/rules/AcknowledgedCommitterEmailAddresses/AcknowledgedCommitterEmailAddressesConfiguration"
import type { Commit, UserIdentity } from "#legacy-v1/rules/Commit"
import type { Rule } from "#legacy-v1/rules/Rule"

export function acknowledgedCommitterEmailAddresses({
	patterns,
}: AcknowledgedCommitterEmailAddressesConfiguration): Rule {
	const acknowledgedEmailAddressRegex = new RegExp(
		patterns.map((pattern) => `^(?:${pattern})$`).join("|"),
		"u",
	)

	function hasAcknowledgedCommitterEmailAddress(
		committer: UserIdentity,
	): boolean {
		return (
			committer.emailAddress !== null &&
			acknowledgedEmailAddressRegex.test(committer.emailAddress)
		)
	}

	return {
		key: "acknowledged-committer-email-addresses",
		getInvalidCommits: (refinedCommits): ReadonlyArray<Commit> =>
			refinedCommits.filter(
				({ committer }) => !hasAcknowledgedCommitterEmailAddress(committer),
			),
	}
}
