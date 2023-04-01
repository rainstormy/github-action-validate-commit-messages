import type {
	IssueReferencePosition,
	IssueReferencesInSubjectLinesConfiguration,
	Rule,
} from "+rules"

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
		refine: (commit) => {
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
		validate: ({ refinedSubjectLine, parents, issueReferences }) => {
			const isRevertCommit = refinedSubjectLine.startsWith("Revert ")
			const isMergeCommit = parents.length > 1
			const isIgnorableCommit = isRevertCommit || isMergeCommit

			return isIgnorableCommit || issueReferences.length > 0
				? "valid"
				: "invalid"
		},
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
