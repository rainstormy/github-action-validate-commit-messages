import { dummyCommitFactory } from "+core/dummies"
import { noFixupCommits } from "+rules"

const { commitOf } = dummyCommitFactory()

describe("a validation rule that rejects fixup commits", () => {
	const rule = noFixupCommits()

	it.each`
		subjectLine
		${"fixup! Resolve a bug that thought it was a feature"}
		${"fixup! Add some extra love to the code"}
	`(
		"rejects a commit with a subject line of $subjectLine",
		(testRow: { readonly subjectLine: string }) => {
			const { subjectLine } = testRow

			const commit = commitOf(subjectLine)
			expect(rule.validate(commit)).toBe("invalid")
		},
	)

	it.each`
		subjectLine
		${"Release the robot butler"}
		${"Fix this confusing plate of spaghetti"}
	`(
		"accepts a commit with a subject line of $subjectLine",
		(testRow: { readonly subjectLine: string }) => {
			const { subjectLine } = testRow

			const commit = commitOf(subjectLine)
			expect(rule.validate(commit)).toBe("valid")
		},
	)
})
