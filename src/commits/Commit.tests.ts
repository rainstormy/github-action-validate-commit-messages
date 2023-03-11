import type { CommitModifier } from "+commits"
import { commitRefinerFrom, parseCommit } from "+commits"
import { count } from "+utilities"

describe.each`
	sha          | subjectLine                                               | body                                                                     | parentShas                            | modifiers               | refinedSubjectLine
	${"0ff1ce"}  | ${"Release the robot butler"}                             | ${"\n\nThis is a dummy commit message body."}                            | ${["c0ffee"]}                         | ${[]}                   | ${"Release the robot butler"}
	${"d06f00d"} | ${"Fix this confusing plate of spaghetti"}                | ${""}                                                                    | ${["deadc0de"]}                       | ${[]}                   | ${"Fix this confusing plate of spaghetti"}
	${"0ff1ce"}  | ${"fixup! Resolve a bug that thought it was a feature"}   | ${""}                                                                    | ${["c0ffee"]}                         | ${["fixup!"]}           | ${"Resolve a bug that thought it was a feature"}
	${"d06f00d"} | ${"fixup!  Add some extra love to the code"}              | ${""}                                                                    | ${["deadc0de"]}                       | ${["fixup!"]}           | ${"Add some extra love to the code"}
	${"0ff1ce"}  | ${"fixup! fixup! Fix this confusing plate of spaghetti"}  | ${""}                                                                    | ${["c0ffee"]}                         | ${["fixup!", "fixup!"]} | ${"Fix this confusing plate of spaghetti"}
	${"d06f00d"} | ${"amend!Apply strawberry jam to make the code sweeter"}  | ${"\n\nThis is a dummy commit message body."}                            | ${["deadc0de"]}                       | ${["amend!"]}           | ${"Apply strawberry jam to make the code sweeter"}
	${"0ff1ce"}  | ${"amend! Solve the problem"}                             | ${""}                                                                    | ${["c0ffee"]}                         | ${["amend!"]}           | ${"Solve the problem"}
	${"d06f00d"} | ${"squash!Make the formatter happy again :)"}             | ${""}                                                                    | ${["deadc0de"]}                       | ${["squash!"]}          | ${"Make the formatter happy again :)"}
	${"0ff1ce"}  | ${"squash!   Organise the bookshelf"}                     | ${"\n\nThis is a dummy commit message body."}                            | ${["c0ffee"]}                         | ${["squash!"]}          | ${"Organise the bookshelf"}
	${"d06f00d"} | ${"Keep my branch up to date"}                            | ${""}                                                                    | ${["badf00d", "deadc0de", "d15ea5e"]} | ${[]}                   | ${"Keep my branch up to date"}
	${"0ff1ce"}  | ${"Merge branch 'main' into bugfix/dance-party-playlist"} | ${"\n\nConflicts:\n\n src/grumpy-cat.ts\n src/summer-vacation-plans.ts"} | ${["cafebabe", "cafed00d"]}           | ${[]}                   | ${"Merge branch 'main' into bugfix/dance-party-playlist"}
`(
	"a commit with a subject line of $subjectLine",
	(testRow: {
		readonly sha: string
		readonly subjectLine: string
		readonly body: string
		readonly parentShas: ReadonlyArray<string>
		readonly modifiers: ReadonlyArray<CommitModifier>
		readonly issueReferences: ReadonlyArray<string>
		readonly refinedSubjectLine: string
	}) => {
		const {
			sha,
			subjectLine,
			body,
			parentShas,
			modifiers,
			refinedSubjectLine,
		} = testRow

		const commitRefiner = commitRefinerFrom()
		const commit = parseCommit(
			{
				sha,
				commitMessage: `${subjectLine}${body}`,
				parents: parentShas.map((parentSha) => ({ sha: parentSha })),
			},
			commitRefiner,
		)

		it(`has a SHA of '${sha}'`, () => {
			expect(commit.sha).toStrictEqual(sha)
		})

		it(`has an original subject line of '${subjectLine}'`, () => {
			expect(commit.originalSubjectLine).toStrictEqual(subjectLine)
		})

		it(`has a refined subject line of '${refinedSubjectLine}'`, () => {
			expect(commit.refinedSubjectLine).toStrictEqual(refinedSubjectLine)
		})

		it(`has ${count(modifiers, "modifier", "modifiers")}`, () => {
			expect(commit.modifiers).toHaveLength(modifiers.length)
		})

		it.each(modifiers)(`has a modifier of '%s'`, (modifier) => {
			expect(commit.modifiers).toContain(modifier)
		})

		it(`has ${count(parentShas, "parent", "parents")}`, () => {
			expect(commit.parents).toHaveLength(parentShas.length)
		})

		it.each(parentShas)(`is a child of '%s'`, (parentSha) => {
			expect(commit.parents).toContainEqual({ sha: parentSha })
		})
	},
)
