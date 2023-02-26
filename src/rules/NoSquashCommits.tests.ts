import { dummyCommits } from "+core/dummies"
import { noSquashCommits } from "+rules"

const { regularCommits, squashCommits } = dummyCommits

describe("a validation rule that rejects squash commits", () => {
	const rule = noSquashCommits()

	it.each(squashCommits)(
		"rejects a squash commit with a subject line of '%s'",
		(commit) => {
			expect(rule.validate(commit)).toBe("invalid")
		},
	)

	it.each(regularCommits)(
		"accepts a non-squash commit with a subject line of '%s'",
		(commit) => {
			expect(rule.validate(commit)).toBe("valid")
		},
	)
})
