import type { AcknowledgedCommitterEmailAddressesConfiguration } from "+rules/AcknowledgedCommitterEmailAddresses/AcknowledgedCommitterEmailAddressesConfiguration"
import type { UserIdentity } from "+rules/Commit"
import type { Rule } from "+rules/Rule"

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
		getInvalidCommits: (refinedCommits) =>
			refinedCommits.filter(
				({ committer }) => !hasAcknowledgedCommitterEmailAddress(committer),
			),
	}
}
