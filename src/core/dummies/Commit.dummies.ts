import type { Commit } from "+core"
import { commitOf } from "+core"

export const dummyCommits = {
	regularCommits: [
		regularCommitWithDummyBody({
			subjectLine: "Release the robot butler",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Fix this confusing plate of spaghetti",
		}),
	],
	fixupCommits: [
		regularCommitWithDummyBody({
			subjectLine: "fixup! Resolve a bug that thought it was a feature",
		}),
		regularCommitWithDummyBody({
			subjectLine: "fixup! Add some extra love to the code",
		}),
	],
	squashCommits: [
		regularCommitWithDummyBody({
			subjectLine: "squash! Make the formatter happy again :)",
		}),
		regularCommitWithDummyBody({
			subjectLine: "squash! Organise the bookshelf",
		}),
	],
	mergeCommits: [
		mergeCommitWithDummyConflicts({
			parents: ["badf00d", "deadc0de", "d15ea5e"],
			subjectLine: "Keep my branch up to date",
		}),
		mergeCommitWithDummyConflicts({
			parents: ["cafebabe", "cafed00d"],
			subjectLine: "Merge branch 'main' into bugfix/dance-party-playlist",
		}),
	],
	commitsWithDecapitalisedSubjectLines: [
		regularCommitWithDummyBody({
			subjectLine: "release the robot butler",
		}),
		regularCommitWithDummyBody({
			subjectLine: "fix this confusing plate of spaghetti",
		}),
		regularCommitWithDummyBody({
			subjectLine: "fixup! resolve a bug that thought it was a feature",
		}),
		regularCommitWithDummyBody({
			subjectLine: "squash! organise the bookshelf",
		}),
	],
}

function regularCommitWithDummyBody(props: {
	readonly subjectLine: string
}): Commit {
	return commitOf({
		sha: "0ff1ce",
		commitMessage: `${props.subjectLine}\n\nThis is a dummy commit message body.`,
		parents: [{ sha: "c0ffee" }],
	})
}

function mergeCommitWithDummyConflicts(props: {
	readonly parents: ReadonlyArray<string>
	readonly subjectLine: string
}): Commit {
	return commitOf({
		sha: "d06f00d",
		commitMessage: `${props.subjectLine}\n\nConflicts:\n\n src/grumpy-cat.ts\n src/summer-vacation-plans.ts`,
		parents: props.parents.map((sha) => ({ sha })),
	})
}
