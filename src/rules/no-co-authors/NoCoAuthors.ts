import type { Rule } from "+rules"

export function noCoAuthors(): Rule {
	return {
		key: "no-co-authors",
		refine: (commit) => {
			const { bodyLines, coAuthors: currentCoAuthors } = commit

			const coAuthors = bodyLines
				.filter((line) => line.toLowerCase().startsWith("co-authored-by:"))
				.map((line) => line.slice("co-authored-by:".length).trim())

			if (coAuthors.length === 0) {
				return commit
			}

			const refinedBodyLines = bodyLines.filter(
				(line) => !line.toLowerCase().startsWith("co-authored-by:"),
			)

			return {
				...commit,
				bodyLines: refinedBodyLines,
				coAuthors: [...currentCoAuthors, ...coAuthors],
			}
		},
		validate: ({ coAuthors }) => {
			const hasCoAuthors = coAuthors.length > 0
			return hasCoAuthors ? "invalid" : "valid"
		},
	}
}
