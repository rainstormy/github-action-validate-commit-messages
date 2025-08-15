import type {
	LegacyV1IssueReferencePosition,
	LegacyV1IssueReferencesInSubjectLinesConfiguration,
} from "#legacy-v1/rules/IssueReferencesInSubjectLines/LegacyV1IssueReferencesInSubjectLinesConfiguration"
import type { LegacyV1Commit } from "#legacy-v1/rules/LegacyV1Commit"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule"

export function legacyV1IssueReferencesInSubjectLines({
	patterns,
	allowedPositions,
}: LegacyV1IssueReferencesInSubjectLinesConfiguration): LegacyV1Rule {
	const combinedPattern = patterns
		.flatMap((pattern) =>
			allowedPositions.map((position) => getPositionPattern(position, pattern)),
		)
		.join("|")

	const combinedRegex = new RegExp(combinedPattern, "u")

	return {
		key: "issue-references-in-subject-lines",
		refine: (commit): LegacyV1Commit => {
			const { issueReferences, refinedSubjectLine: currentSubjectLine } = commit
			const regexMatch = currentSubjectLine.match(combinedRegex)

			if (regexMatch === null) {
				return commit
			}

			const issueReference = regexMatch[0]

			if (currentSubjectLine.startsWith(issueReference)) {
				const refinedSubjectLine = currentSubjectLine
					.slice(issueReference.length)
					.trim()

				return {
					...commit,
					issueReferences: [...issueReferences, issueReference],
					refinedSubjectLine,
				}
			}

			if (currentSubjectLine.endsWith(issueReference)) {
				const refinedSubjectLine = currentSubjectLine
					.slice(0, -issueReference.length)
					.trim()

				return {
					...commit,
					issueReferences: [...issueReferences, issueReference],
					refinedSubjectLine,
				}
			}

			return commit
		},
		getInvalidCommits: (refinedCommits): ReadonlyArray<LegacyV1Commit> =>
			refinedCommits
				.filter(({ parents }) => parents.length === 1)
				.filter(
					({ refinedSubjectLine }) => !refinedSubjectLine.startsWith("Revert "),
				)
				.filter(({ issueReferences }) => issueReferences.length === 0),
	}
}

function getPositionPattern(
	position: LegacyV1IssueReferencePosition,
	pattern: string,
): string {
	switch (position) {
		case "as-prefix": {
			return `^(?:${pattern})`
		}
		case "as-suffix": {
			return `(?:${pattern})$`
		}
	}
}
