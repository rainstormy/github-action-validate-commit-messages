import { dummyCommits } from "+core/dummies"

const { regularCommits, fixupCommits, squashCommits, mergeCommits } =
	dummyCommits

describe.each(regularCommits)(
	"a commit with one parent commit and a subject line of '%s'",
	(commit) => {
		it("is not a fixup commit", () => {
			expect(commit.isFixup).toBe(false)
		})

		it("is not a squash commit", () => {
			expect(commit.isSquash).toBe(false)
		})

		it("is not a merge commit", () => {
			expect(commit.isMerge).toBe(false)
		})
	},
)

describe.each(fixupCommits)(
	"a commit with a subject line of '%s'",
	(commit) => {
		it("is a fixup commit", () => {
			expect(commit.isFixup).toBe(true)
		})
	},
)

describe.each(squashCommits)(
	"a commit with a subject line of '%s'",
	(commit) => {
		it("is a squash commit", () => {
			expect(commit.isSquash).toBe(true)
		})
	},
)

describe.each(mergeCommits)(
	"a commit with multiple parent commits and a subject line of '%s'",
	(commit) => {
		it("is a merge commit", () => {
			expect(commit.isMerge).toBe(true)
		})
	},
)
