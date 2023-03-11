import { dummyCommit } from "+commits"
import { noFixupCommits } from "+rules"

describe("a validation rule that rejects fixup commits", () => {
	const rule = noFixupCommits()

	it.each`
		subjectLine
		${"fixup! Resolve a bug that thought it was a feature"}
		${"fixup! Add some extra love to the code"}
		${"amend! Apply strawberry jam to make the code sweeter"}
		${"amend! Solve the problem"}
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
