import { commitFactoryOf, defaultCommitFactoryConfiguration } from "./Commit"

const { commitOf } = commitFactoryOf(defaultCommitFactoryConfiguration)

describe.each`
	sha          | originalSubjectLine                        | originalBody                                  | parentSha     | expectedSubjectLine
	${"0ff1ce"}  | ${"Release the robot butler"}              | ${"\n\nThis is a dummy commit message body."} | ${"c0ffee"}   | ${"Release the robot butler"}
	${"d06f00d"} | ${"Fix this confusing plate of spaghetti"} | ${""}                                         | ${"deadc0de"} | ${"Fix this confusing plate of spaghetti"}
`(
	"a commit with a subject line of $originalSubjectLine",
	(testRow: {
		readonly sha: string
		readonly originalSubjectLine: string
		readonly originalBody: string
		readonly parentSha: string
		readonly expectedSubjectLine: string
	}) => {
		const {
			sha,
			originalSubjectLine,
			originalBody,
			parentSha,
			expectedSubjectLine,
		} = testRow

		const commit = commitOf({
			sha,
			commitMessage: `${originalSubjectLine}${originalBody}`,
			parents: [{ sha: parentSha }],
		})

		it(`has a SHA of '${sha}'`, () => {
			expect(commit.sha).toStrictEqual(sha)
		})

		it(`has an original subject line of '${originalSubjectLine}'`, () => {
			expect(commit.originalSubjectLine).toStrictEqual(originalSubjectLine)
		})

		it(`has a subject line of '${expectedSubjectLine}'`, () => {
			expect(commit.subjectLine).toStrictEqual(expectedSubjectLine)
		})

		it("has no modifier", () => {
			expect(commit.modifier).toBeNull()
		})

		it("has one parent", () => {
			expect(commit.parents).toStrictEqual([{ sha: parentSha }])
		})
	},
)

describe.each`
	originalSubjectLine                                      | originalBody                                  | expectedSubjectLine                               | expectedModifier
	${"fixup! Resolve a bug that thought it was a feature"}  | ${""}                                         | ${"Resolve a bug that thought it was a feature"}  | ${"fixup!"}
	${"fixup!  Add some extra love to the code"}             | ${""}                                         | ${"Add some extra love to the code"}              | ${"fixup!"}
	${"fixup! fixup! Fix this confusing plate of spaghetti"} | ${""}                                         | ${"fixup! Fix this confusing plate of spaghetti"} | ${"fixup!"}
	${"squash!Make the formatter happy again :)"}            | ${""}                                         | ${"Make the formatter happy again :)"}            | ${"squash!"}
	${"squash!   Organise the bookshelf"}                    | ${"\n\nThis is a dummy commit message body."} | ${"Organise the bookshelf"}                       | ${"squash!"}
`(
	"a commit with a subject line of $originalSubjectLine",
	(testRow: {
		readonly originalSubjectLine: string
		readonly originalBody: string
		readonly expectedSubjectLine: string
		readonly expectedModifier: string
	}) => {
		const {
			originalSubjectLine,
			originalBody,
			expectedSubjectLine,
			expectedModifier,
		} = testRow

		const commit = commitOf({
			sha: "0ff1ce",
			commitMessage: `${originalSubjectLine}${originalBody}`,
			parents: [{ sha: "c0ffee" }],
		})

		it(`has an original subject line of '${originalSubjectLine}'`, () => {
			expect(commit.originalSubjectLine).toStrictEqual(originalSubjectLine)
		})

		it(`has a subject line of '${expectedSubjectLine}'`, () => {
			expect(commit.subjectLine).toStrictEqual(expectedSubjectLine)
		})

		it(`has a modifier of '${expectedModifier}'`, () => {
			expect(commit.modifier).toStrictEqual(expectedModifier)
		})
	},
)

describe.each`
	originalSubjectLine                                       | originalBody                                                             | parentShas
	${"Keep my branch up to date"}                            | ${""}                                                                    | ${["badf00d", "deadc0de", "d15ea5e"]}
	${"Merge branch 'main' into bugfix/dance-party-playlist"} | ${"\n\nConflicts:\n\n src/grumpy-cat.ts\n src/summer-vacation-plans.ts"} | ${["cafebabe", "cafed00d"]}
`(
	"a commit with a subject line of $originalSubjectLine and multiple parent commits",
	(testRow: {
		readonly originalSubjectLine: string
		readonly originalBody: string
		readonly parentShas: ReadonlyArray<string>
	}) => {
		const { originalSubjectLine, originalBody, parentShas } = testRow

		const commit = commitOf({
			sha: "0ff1ce",
			commitMessage: `${originalSubjectLine}${originalBody}`,
			parents: parentShas.map((parentSha) => ({ sha: parentSha })),
		})

		it(`has ${parentShas.length} parents`, () => {
			expect(commit.parents).toHaveLength(parentShas.length)
		})
	},
)
