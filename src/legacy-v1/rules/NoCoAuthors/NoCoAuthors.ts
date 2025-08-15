import type { Commit } from "#legacy-v1/rules/Commit"
import type { Rule } from "#legacy-v1/rules/Rule"

export function noCoAuthors(): Rule {
	return {
		key: "no-co-authors",
		refine: (commit): Commit => {
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
		getInvalidCommits: (refinedCommits): ReadonlyArray<Commit> =>
			refinedCommits.filter(({ coAuthors }) => coAuthors.length > 0),
	}
}
