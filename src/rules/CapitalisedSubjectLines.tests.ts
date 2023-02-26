import type { Commit } from "+core"
import { dummyCommits } from "+core/dummies"
import { capitalisedSubjectLines } from "+rules"

const {
	fixupCommits,
	commitsWithDecapitalisedSubjectLines,
	regularCommits,
	squashCommits,
} = dummyCommits

describe("a validation rule that requires capitalised subject lines", () => {
	const rule = capitalisedSubjectLines()

	it.each<Commit>(commitsWithDecapitalisedSubjectLines)(
		"rejects a commit with a subject line of '%s' that starts with a lowercase letter",
		(commit) => {
			expect(rule.validate(commit)).toBe("invalid")
		},
	)

	it.each<Commit>(regularCommits)(
		"accepts a commit with a subject line of '%s' that starts with an uppercase letter",
		(commit) => {
			expect(rule.validate(commit)).toBe("valid")
		},
	)

	it.each(fixupCommits)(
		"accepts a fixup commit with a subject line of '%s'",
		(commit) => {
			expect(rule.validate(commit)).toBe("valid")
		},
	)

	it.each(squashCommits)(
		"accepts a squash commit with a subject line of '%s'",
		(commit) => {
			expect(rule.validate(commit)).toBe("valid")
		},
	)
})
