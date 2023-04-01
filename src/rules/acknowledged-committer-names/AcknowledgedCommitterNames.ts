import type { AcknowledgedCommitterNamesConfiguration, Rule } from "+rules"

export function acknowledgedCommitterNames({
	patterns,
}: AcknowledgedCommitterNamesConfiguration): Rule {
	const regex = new RegExp(
		patterns.map((pattern) => `^(?:${pattern})$`).join("|"),
		"u",
	)

	return {
		key: "acknowledged-committer-names",
		validate: ({ committer }) =>
			committer.name?.match(regex) ? "valid" : "invalid",
	}
}
