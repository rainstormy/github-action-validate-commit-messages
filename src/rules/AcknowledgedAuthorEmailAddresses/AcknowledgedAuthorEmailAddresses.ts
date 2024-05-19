import type { AcknowledgedAuthorEmailAddressesConfiguration } from "+rules/AcknowledgedAuthorEmailAddresses/AcknowledgedAuthorEmailAddressesConfiguration"
import type { UserIdentity } from "+rules/Commit"
import type { Rule } from "+rules/Rule"

export function acknowledgedAuthorEmailAddresses({
	patterns,
}: AcknowledgedAuthorEmailAddressesConfiguration): Rule {
	const acknowledgedEmailAddressRegex = new RegExp(
		patterns.map((pattern) => `^(?:${pattern})$`).join("|"),
		"u",
	)

	function hasAcknowledgedAuthorEmailAddress(author: UserIdentity): boolean {
		return (
			author.emailAddress !== null &&
			acknowledgedEmailAddressRegex.test(author.emailAddress)
		)
	}

	return {
		key: "acknowledged-author-email-addresses",
		getInvalidCommits: (refinedCommits) =>
			refinedCommits.filter(
				({ author }) => !hasAcknowledgedAuthorEmailAddress(author),
			),
	}
}
