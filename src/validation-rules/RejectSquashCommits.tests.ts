import { dummyCommits } from "../models"
import { rejectSquashCommits } from "./RejectSquashCommits"

const { regularCommits, squashCommits } = dummyCommits

describe("a validation rule that rejects squash commits", () => {
	const rule = rejectSquashCommits

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
