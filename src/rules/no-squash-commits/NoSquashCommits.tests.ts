import { dummyCommit } from "+commits"
import { noSquashCommits } from "+rules"

describe("a validation rule that rejects squash commits", () => {
	const rule = noSquashCommits()

	it.each`
		subjectLine
		${"amend! Apply strawberry jam to make the code sweeter"}
		${"amend! Solve the problem"}
		${"fixup! Resolve a bug that thought it was a feature"}
		${"fixup! Add some extra love to the code"}
		${"squash! Make the formatter happy again :)"}
		${"squash! Organise the bookshelf"}
	`(
		"rejects a commit with a subject line of $subjectLine",
		(testRow: { readonly subjectLine: string }) => {
			const { subjectLine } = testRow

			const commit = dummyCommit({ subjectLine })
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

			const commit = dummyCommit({ subjectLine })
			expect(rule.validate(commit)).toBe("valid")
		},
	)
})
