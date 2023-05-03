import type {
	AcknowledgedAuthorEmailAddressesConfiguration,
	Rule,
	UserIdentity,
} from "+rules"

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
