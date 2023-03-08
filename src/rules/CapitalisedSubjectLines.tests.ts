import { dummyCommitFactory } from "+core"
import { capitalisedSubjectLines } from "+rules"

const { commitOf } = dummyCommitFactory()

describe("a validation rule that requires capitalised subject lines", () => {
	const rule = capitalisedSubjectLines()

	it.each`
		subjectLine
		${"release the robot butler"}
		${"fix this confusing plate of spaghetti"}
		${"fixup! resolve a bug that thought it was a feature"}
		${"amend! make the program act like a clown"}
		${"squash! organise the bookshelf"}
	`(
		"rejects a commit with a subject line of $subjectLine that starts with a lowercase letter",
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
		${"fixup! Resolve a bug that thought it was a feature"}
		${"amend! Make the program act like a clown"}
		${"squash! Organise the bookshelf"}
	`(
		"accepts a commit with a subject line of $subjectLine that starts with an uppercase letter",
		(testRow: { readonly subjectLine: string }) => {
			const { subjectLine } = testRow

			const commit = commitOf(subjectLine)
			expect(rule.validate(commit)).toBe("valid")
		},
	)
})
