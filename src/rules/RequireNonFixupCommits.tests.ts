import { dummyCommits } from "+core/dummies"
import { requireNonFixupCommits } from "+rules"

const { regularCommits, fixupCommits } = dummyCommits

describe("a validation rule that requires non-fixup commits", () => {
	const rule = requireNonFixupCommits

	it.each(fixupCommits)(
		"rejects a fixup commit with a subject line of '%s'",
		(commit) => {
			expect(rule.validate(commit)).toBe("invalid")
		},
	)

	it.each(regularCommits)(
		"accepts a non-fixup commit with a subject line of '%s'",
		(commit) => {
			expect(rule.validate(commit)).toBe("valid")
		},
	)
})
