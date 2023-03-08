export type Commit = {
	readonly sha: string
	readonly parents: ReadonlyArray<ParentCommit>
	readonly originalSubjectLine: string
	readonly modifier: string | null
	readonly subjectLine: string
}

export type UnparsedCommit = {
	readonly sha: string
	readonly parents: ReadonlyArray<ParentCommit>
	readonly commitMessage: string
}

type ParentCommit = {
	readonly sha: string
}

export type CommitFactoryConfiguration = {
	readonly modifiers: ReadonlyArray<string>
}

export const defaultCommitFactoryConfiguration: CommitFactoryConfiguration = {
	modifiers: ["amend!", "fixup!", "squash!"],
}

export type CommitFactory = {
	readonly commitOf: (unparsedCommit: UnparsedCommit) => Commit
}

export function commitFactoryOf({
	modifiers,
}: CommitFactoryConfiguration): CommitFactory {
	const subjectLineRegex = new RegExp(
		`^(?<modifier>${modifiers.join("|")})?\\s*(?<subject>.*)$`,
		"u",
	)

	return {
		commitOf: ({ sha, parents, commitMessage }) => {
			const lines = commitMessage.split("\n")
			const originalSubjectLine = lines[0]

			const subjectLineMatch = subjectLineRegex.exec(originalSubjectLine)
			const modifier = subjectLineMatch?.groups?.modifier ?? null
			const subjectLine = subjectLineMatch?.groups?.subject ?? ""

			return {
				sha,
				parents,
				originalSubjectLine,
				modifier,
				subjectLine,
			}
		},
	}
}
