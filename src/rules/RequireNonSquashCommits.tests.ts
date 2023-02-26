import { dummyCommits } from "+core/dummies"
import { requireNonSquashCommits } from "+rules"

const { regularCommits, squashCommits } = dummyCommits

describe("a validation rule that requires non-squash commits", () => {
	const rule = requireNonSquashCommits()

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
