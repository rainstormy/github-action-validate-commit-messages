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
	commitsWithTrailingPunctuationInSubjectLines: [
		regularCommitWithDummyBody({
			subjectLine: "Make the program act like a clown.",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Spot a UFO,",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Solve the following issue:",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Throw a tantrum;",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Make it work!",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Wonder if this will work?",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Apply strawberry jam to make the code sweeter-",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Write the answer =",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Begin the implementation with more to come+",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Fix a typo: set up*",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Fix a typo: 'setup' ->",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Fix another typo: 'checkout' =>",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Short-circuit the loop with &&",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Short-circuit the loop with ||",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Ignore the parameter with _",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Replace Math.pow() with **",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Replace block comments with //",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Introduce an observable named event$",
		}),
	],
	commitsWithTrailingMatchedClosingPunctuationInSubjectLines: [
		regularCommitWithDummyBody({
			subjectLine: "Finish the job (after the lunch break)",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Proceed with the job [work in progress]",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Support more delimiters for `rules`",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Rename the 'strategy'",
		}),
		regularCommitWithDummyBody({
			subjectLine: 'Enclose the text in "quotes"',
		}),
		regularCommitWithDummyBody({
			subjectLine: "Quote the «text»",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Emphasise even more »well-written prose«",
		}),
	],
	commitsWithTrailingUnmatchedClosingPunctuationInSubjectLines: [
		regularCommitWithDummyBody({
			subjectLine: "Finish the job after the lunch break)",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Proceed with the job which is a work in progress]",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Support more delimiters for rules`",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Rename the strategy'",
		}),
		regularCommitWithDummyBody({
			subjectLine: 'Enclose the text in quotes"',
		}),
		regularCommitWithDummyBody({
			subjectLine: "Quote the text»",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Emphasise even more well-written prose«",
		}),
	],
	commitsWithTrailingNumericPunctuationInSubjectLines: [
		regularCommitWithDummyBody({
			subjectLine: "Increase the tax level to 100%",
		}),
		regularCommitWithDummyBody({
			subjectLine: 'Adjust to print margin to 2"',
		}),
		regularCommitWithDummyBody({
			subjectLine: "Restrict the content to ages 3+",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Display 120 as the result of 5!",
		}),
	],
	commitsWithTrailingEmojiShortcodeInSubjectLines: [
		regularCommitWithDummyBody({
			subjectLine: "Sneak in a funny easter egg :joy:",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Have fun :slightly_smiling_face:",
		}),
	],
	commitsWithTrailingEmoticonsInSubjectLines: [
		regularCommitWithDummyBody({
			subjectLine: "Sneak in a funny easter egg :)",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Sneak in a funny easter egg :-)",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Sneak in a funny easter egg =)",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Sneak in a funny easter egg ^^",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Sneak in a funny easter egg ^_^",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Fix your mistakes ;)",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Fix your mistakes ;-)",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Attempt to fix the bug again :(",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Attempt to fix the bug again :-(",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Attempt to fix the bug again =(",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Make the user interface less chaotic :/",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Make the user interface less chaotic :-/",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Make the user interface less chaotic :\\",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Make the user interface less chaotic :-\\",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Confuse the bug to make it go away :|",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Confuse the bug to make it go away :-|",
		}),
	],
	commitsWithTrailingProgrammingLanguageNameInSubjectLines: [
		regularCommitWithDummyBody({
			subjectLine: "Threaten the bug with C++",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Attempt to solve the problem in C#",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Rewrite the program in F#",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Prove it in F*",
		}),
		regularCommitWithDummyBody({
			subjectLine: "Validate the model in VDM++",
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
