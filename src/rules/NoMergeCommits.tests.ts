import { dummyCommitFactory } from "+core"
import { noMergeCommits } from "+rules"

const { commitOf, mergeCommitOf } = dummyCommitFactory()

describe("a validation rule that rejects merge commits", () => {
	const rule = noMergeCommits()

	it.each`
		subjectLine                                               | parentShas
		${"Keep my branch up to date"}                            | ${["badf00d", "deadc0de", "d15ea5e"]}
		${"Merge branch 'main' into bugfix/dance-party-playlist"} | ${["cafebabe", "cafed00d"]}
	`(
		"rejects a commit with a subject line of $subjectLine and multiple parent commits",
		(testRow: {
			readonly subjectLine: string
			readonly parentShas: ReadonlyArray<string>
		}) => {
			const { subjectLine, parentShas } = testRow

			const commit = mergeCommitOf(subjectLine, parentShas)
			expect(rule.validate(commit)).toBe("invalid")
		},
	)

	it.each`
		subjectLine
		${"Release the robot butler"}
		${"Fix this confusing plate of spaghetti"}
	`(
		"accepts a commit with a subject line of $subjectLine and one parent commit",
		(testRow: { readonly subjectLine: string }) => {
			const { subjectLine } = testRow

			const commit = commitOf(subjectLine)
			expect(rule.validate(commit)).toBe("valid")
		},
	)
})
