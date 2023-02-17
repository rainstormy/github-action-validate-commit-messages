import { dummyCommits } from "../models"
import { rejectFixupCommits } from "./RejectFixupCommits"

const { regularCommits, fixupCommits } = dummyCommits

describe("a validation rule that rejects fixup commits", () => {
	const rule = rejectFixupCommits

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
