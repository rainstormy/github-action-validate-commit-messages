import type { AcknowledgedAuthorEmailAddressesConfiguration } from "#legacy-v1/rules/AcknowledgedAuthorEmailAddresses/AcknowledgedAuthorEmailAddressesConfiguration"
import type { Commit, UserIdentity } from "#legacy-v1/rules/Commit"
import type { Rule } from "#legacy-v1/rules/Rule"

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
		getInvalidCommits: (refinedCommits): ReadonlyArray<Commit> =>
			refinedCommits.filter(
				({ author }) => !hasAcknowledgedAuthorEmailAddress(author),
			),
	}
}
