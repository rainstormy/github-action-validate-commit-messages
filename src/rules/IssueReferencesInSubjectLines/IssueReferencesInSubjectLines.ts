import type { Commit } from "+rules/Commit"
import type {
	IssueReferencePosition,
	IssueReferencesInSubjectLinesConfiguration,
} from "+rules/IssueReferencesInSubjectLines/IssueReferencesInSubjectLinesConfiguration"
import type { Rule } from "+rules/Rule"

export function issueReferencesInSubjectLines({
	patterns,
	allowedPositions,
}: IssueReferencesInSubjectLinesConfiguration): Rule {
	const combinedPattern = patterns
		.flatMap((pattern) =>
			allowedPositions.map((position) => getPositionPattern(position, pattern)),
		)
		.join("|")

	const combinedRegex = new RegExp(combinedPattern, "u")

	return {
		key: "issue-references-in-subject-lines",
		refine: (commit): Commit => {
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
		getInvalidCommits: (refinedCommits): ReadonlyArray<Commit> =>
			refinedCommits
				.filter(({ parents }) => parents.length === 1)
				.filter(
					({ refinedSubjectLine }) => !refinedSubjectLine.startsWith("Revert "),
				)
				.filter(({ issueReferences }) => issueReferences.length === 0),
	}
}

function getPositionPattern(
	position: IssueReferencePosition,
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
