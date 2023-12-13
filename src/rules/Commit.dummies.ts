import { type RawCommit } from "+rules/Commit"

type DummyCommitProps = {
	readonly sha?: string
	readonly author?: {
		readonly name: string | null
		readonly emailAddress: string | null
	}
	readonly committer?: {
		readonly name: string | null
		readonly emailAddress: string | null
	}
	readonly subjectLine: string
	readonly body?: string
	readonly numberOfParents?: number
}

export function dummyCommit({
	sha = "0ff1ce",
	author = {
		name: "Santa Claus",
		emailAddress: "12345678+santaclaus@users.noreply.github.com",
	},
	committer = {
		name: "Santa Claus",
		emailAddress: "12345678+santaclaus@users.noreply.github.com",
	},
	subjectLine,
	body = "\nThis is a dummy commit message body.",
	numberOfParents = 1,
}: DummyCommitProps): RawCommit {
	const parents = Array.from({ length: numberOfParents }, (ignored, index) => ({
		sha: `c0ffee${index}`,
	}))

	return {
		sha,
		author,
		committer,
		parents,
		commitMessage: `${subjectLine}\n${body}`,
	}
}
