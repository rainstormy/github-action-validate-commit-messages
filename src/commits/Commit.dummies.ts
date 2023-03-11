import type { Commit, CommitRefiner } from "+commits"
import { commitRefinerFrom, parseCommit } from "+commits"

type DummyCommitProps = {
	readonly sha?: string
	readonly subjectLine: string
	readonly commitRefiner?: CommitRefiner
}

export function dummyCommit({
	sha = "0ff1ce",
	subjectLine,
	commitRefiner = dummyCommitRefiner(),
}: DummyCommitProps): Commit {
	return parseCommit(
		{
			sha,
			parents: [{ sha: "c0ffee" }],
			commitMessage: `${subjectLine}\n\nThis is a dummy commit message body.`,
		},
		commitRefiner,
	)
}

type DummyMergeCommitProps = {
	readonly sha?: string
	readonly parentShas: ReadonlyArray<string>
	readonly subjectLine: string
	readonly commitRefiner?: CommitRefiner
}

export function dummyMergeCommit({
	sha = "0ff1ce",
	parentShas,
	subjectLine,
	commitRefiner = dummyCommitRefiner(),
}: DummyMergeCommitProps): Commit {
	return parseCommit(
		{
			sha,
			parents: parentShas.map((parentSha) => ({ sha: parentSha })),
			commitMessage: `${subjectLine}\n\nConflicts:\n\n src/grumpy-cat.ts\n src/summer-vacation-plans.ts`,
		},
		commitRefiner,
	)
}

function dummyCommitRefiner(): CommitRefiner {
	return commitRefinerFrom()
}
