import type {
	LegacyV1Commit,
	LegacyV1Commits,
} from "#legacy-v1/rules/LegacyV1Commit"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule"

export function legacyV1NoCoAuthors(): LegacyV1Rule {
	return {
		key: "no-co-authors",
		refine: (commit: LegacyV1Commit): LegacyV1Commit => {
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
		getInvalidCommits: (refinedCommits: LegacyV1Commits): LegacyV1Commits =>
			refinedCommits.filter(({ coAuthors }) => coAuthors.length > 0),
	}
}
