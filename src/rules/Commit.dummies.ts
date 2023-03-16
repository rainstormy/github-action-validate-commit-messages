import type { RawCommit } from "+rules"

type DummyCommitProps = {
	readonly sha?: string
	readonly subjectLine: string
	readonly body?: string
	readonly numberOfParents?: number
}

export function dummyCommit({
	sha = "0ff1ce",
	subjectLine,
	body = "\nThis is a dummy commit message body.",
	numberOfParents = 1,
}: DummyCommitProps): RawCommit {
	const parents = Array.from({ length: numberOfParents }, (ignored, index) => ({
		sha: `c0ffee${index}`,
	}))

	return {
		sha,
		parents,
		commitMessage: `${subjectLine}\n${body}`,
	}
}
