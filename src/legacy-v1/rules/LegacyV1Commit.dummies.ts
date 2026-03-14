import type { LegacyV1RawCommit } from "#legacy-v1/rules/LegacyV1Commit.ts"

type DummyCommitProps = {
	sha?: string
	author?: {
		name: string | null
		emailAddress: string | null
	}
	committer?: {
		name: string | null
		emailAddress: string | null
	}
	subjectLine: string
	body?: string
	numberOfParents?: number
}

export function legacyV1DummyCommit({
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
}: DummyCommitProps): LegacyV1RawCommit {
	const parents = Array.from({ length: numberOfParents }, (_ignored, index) => ({
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
