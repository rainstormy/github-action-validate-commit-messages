import type { Commit } from "+core"
import { commitFactoryOf, defaultCommitFactoryConfiguration } from "+core"

export type DummyCommitFactory = {
	readonly commitOf: (subjectLine: string, sha?: string) => Commit
	readonly mergeCommitOf: (
		subjectLine: string,
		parentShas: ReadonlyArray<string>,
		sha?: string,
	) => Commit
}

export function dummyCommitFactory(): DummyCommitFactory {
	const innerCommitFactory = commitFactoryOf(defaultCommitFactoryConfiguration)
	return {
		commitOf: (subjectLine, sha = "0ff1ce") =>
			innerCommitFactory.commitOf({
				sha,
				parents: [{ sha: "c0ffee" }],
				commitMessage: `${subjectLine}\n\nThis is a dummy commit message body.`,
			}),
		mergeCommitOf: (subjectLine, parentShas, sha = "0ff1ce") =>
			innerCommitFactory.commitOf({
				sha,
				parents: parentShas.map((parentSha) => ({ sha: parentSha })),
				commitMessage: `${subjectLine}\n\nConflicts:\n\n src/grumpy-cat.ts\n src/summer-vacation-plans.ts`,
			}),
	}
}
