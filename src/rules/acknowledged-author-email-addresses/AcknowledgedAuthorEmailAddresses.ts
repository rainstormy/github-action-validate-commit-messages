import type {
	AcknowledgedAuthorEmailAddressesConfiguration,
	Rule,
} from "+rules"

export function acknowledgedAuthorEmailAddresses({
	patterns,
}: AcknowledgedAuthorEmailAddressesConfiguration): Rule {
	const regex = new RegExp(
		patterns.map((pattern) => `^(?:${pattern})$`).join("|"),
		"u",
	)

	return {
		key: "acknowledged-author-email-addresses",
		validate: ({ author }) =>
			author.emailAddress?.match(regex) ? "valid" : "invalid",
	}
}
