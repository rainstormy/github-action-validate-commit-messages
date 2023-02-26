import { dummyCommits } from "+core/dummies"
import { noMergeCommits } from "+rules"

const { regularCommits, mergeCommits } = dummyCommits

describe("a validation rule that rejects merge commits", () => {
	const rule = noMergeCommits()

	it.each(mergeCommits)(
		"rejects a merge commit with a subject line of '%s'",
		(commit) => {
			expect(rule.validate(commit)).toBe("invalid")
		},
	)

	it.each(regularCommits)(
		"accepts a non-merge commit with a subject line of '%s'",
		(commit) => {
			expect(rule.validate(commit)).toBe("valid")
		},
	)
})
