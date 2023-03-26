import type { AcknowledgedAuthorNamesConfiguration, Rule } from "+rules"

export function acknowledgedAuthorNames({
	patterns,
}: AcknowledgedAuthorNamesConfiguration): Rule {
	const regex = new RegExp(
		patterns.map((pattern) => `^(?:${pattern})$`).join("|"),
		"u",
	)

	return {
		key: "acknowledged-author-names",
		validate: ({ author }) => (author.name?.match(regex) ? "valid" : "invalid"),
	}
}
