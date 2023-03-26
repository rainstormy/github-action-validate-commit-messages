import type {
	AcknowledgedCommitterEmailAddressesConfiguration,
	Rule,
} from "+rules"

export function acknowledgedCommitterEmailAddresses({
	patterns,
}: AcknowledgedCommitterEmailAddressesConfiguration): Rule {
	const regex = new RegExp(
		patterns.map((pattern) => `^(?:${pattern})$`).join("|"),
		"u",
	)

	return {
		key: "acknowledged-committer-email-addresses",
		validate: ({ committer }) =>
			committer.emailAddress?.match(regex) ? "valid" : "invalid",
	}
}
