import { mockGitCommand } from "#utilities/git/cli/RunGitCommand.mocks.ts"
import { beforeEach, describe, expect, it } from "vitest"
import { getGitLog } from "#utilities/git/cli/GetGitLog.ts"

describe.each`
	baseRef
	${"github/main"}
	${"origin/develop"}
`(
	"when there are no commits between $baseRef and 'HEAD'",
	(props: { baseRef: string }) => {
		beforeEach(() => {
			mockGitCommand(
				`--no-pager log --format=raw --no-color ${props.baseRef}..HEAD`,
				{ output: "" },
			)
		})

		it("returns an empty list", async () => {
			const actualCommits = await getGitLog(props.baseRef)
			expect(actualCommits).toEqual([])
		})
	},
)

describe("when there is 1 commit with no parents", () => {
	beforeEach(() => {
		mockGitCommand("--no-pager log --format=raw --no-color origin/main..HEAD", {
			output: `
commit d13efe7d13084bf4a026f74349478d40a713949e
tree 6feccc6788c0ef8667a9aaf6386d72b6b5deba17
author Firstname Lastname <id+username@users.noreply.github.com> 1675536219 +0100
committer Firstname Lastname <id+username@users.noreply.github.com> 1675536219 +0100
gpgsig -----BEGIN SSH SIGNATURE-----
 k1MWQyOTVmM2UzY2E0YjFhNWRkN2UyZjY3ODk5MzJlZDM1NTRlZmY3NWY5OTg1OWFjMzdj
 OWQ4MjI3OWFhMGIzYTE2N2U/YWNmMTVkMzVhNzE0NmI4ZmZiODFkNzk1ZWVhM2QxOWMwNT
 YzFmMDExZWZiZGQ1NzAxNTQxYWY1YTQ0MTI4YzE4N2UzNTc3ZjNiMjg+3NzVmNjBkNmIyM
 jQkODBmOWFlNmNlOTU4GU=
 -----END SSH SIGNATURE-----

    Commit message
`,
		})
	})

	it("returns an empty list", async () => {
		const actualCommits = await getGitLog("origin/main")
		expect(actualCommits).toEqual([])
	})
})

// TODO: when there is 1 commit with 1 parent
// TODO: when there is 1 commit with 2 parents
// TODO: when there is 1 commit with 3 parents
// TODO: when there is 1 commit with a signature
// TODO: when there is 1 commit with a multiline commit message
// TODO: when there is 1 commit with an empty author name
// TODO: when there is 1 commit with an empty committer name
// TODO: when there are 2 commits

// describe("when there is 1 commit with a single parent", () => {
// 	beforeEach(() => {
// 		mockGitCommand("log --format=raw abc123..def456", {
// 			output: [
// 				"commit def456",
// 				"tree 1234567890abcdef",
// 				"parent abc123",
// 				"author John Doe <john@example.com> 1234567890 +0000",
// 				"committer Jane Smith <jane@example.com> 1234567890 +0000",
// 				"",
// 				"    Add feature X",
// 			].join("\n"),
// 		})
// 	})
//
// 	it("returns a list with 1 commit", async () => {
// 		const actualCommits = await getGitLog("abc123", "def456")
// 		expect(actualCommits).toEqual([
// 			{
// 				sha: "def456",
// 				parents: ["abc123"],
// 				authorName: "John Doe",
// 				authorEmail: "john@example.com",
// 				committerName: "Jane Smith",
// 				committerEmail: "jane@example.com",
// 				message: "Add feature X",
// 			},
// 		])
// 	})
// })
//
// describe("when there is 1 commit with multiple parents (merge commit)", () => {
// 	beforeEach(() => {
// 		mockGitCommand("log --format=raw main..feature", {
// 			output: [
// 				"commit merge123",
// 				"tree 1234567890abcdef",
// 				"parent abc123",
// 				"parent def456",
// 				"author Merger Person <merger@example.com> 1234567890 +0000",
// 				"committer Merger Person <merger@example.com> 1234567890 +0000",
// 				"",
// 				"    Merge branch 'feature' into main",
// 			].join("\n"),
// 		})
// 	})
//
// 	it("returns a list with 1 commit with multiple parents", async () => {
// 		const actualCommits = await getGitLog("main", "feature")
// 		expect(actualCommits).toEqual([
// 			{
// 				sha: "merge123",
// 				parents: ["abc123", "def456"],
// 				authorName: "Merger Person",
// 				authorEmail: "merger@example.com",
// 				committerName: "Merger Person",
// 				committerEmail: "merger@example.com",
// 				message: "Merge branch 'feature' into main",
// 			},
// 		])
// 	})
// })
//
// describe("when there is 1 commit with empty author name", () => {
// 	beforeEach(() => {
// 		mockGitCommand("log --format=raw abc123..def456", {
// 			output: [
// 				"commit def456",
// 				"tree 1234567890abcdef",
// 				"parent abc123",
// 				"author <author@example.com> 1234567890 +0000",
// 				"committer Committer Name <committer@example.com> 1234567890 +0000",
// 				"",
// 				"    Commit message",
// 			].join("\n"),
// 		})
// 	})
//
// 	it("returns a list with 1 commit with null author name", async () => {
// 		const actualCommits = await getGitLog("abc123", "def456")
// 		expect(actualCommits).toEqual([
// 			{
// 				sha: "def456",
// 				parents: ["abc123"],
// 				authorName: null,
// 				authorEmail: "author@example.com",
// 				committerName: "Committer Name",
// 				committerEmail: "committer@example.com",
// 				message: "Commit message",
// 			},
// 		])
// 	})
// })
//
// describe("when there is 1 commit with empty committer email", () => {
// 	beforeEach(() => {
// 		mockGitCommand("log --format=raw abc123..def456", {
// 			output: [
// 				"commit def456",
// 				"tree 1234567890abcdef",
// 				"parent abc123",
// 				"author Author Name <author@example.com> 1234567890 +0000",
// 				"committer Committer Name <> 1234567890 +0000",
// 				"",
// 				"    Commit message",
// 			].join("\n"),
// 		})
// 	})
//
// 	it("returns a list with 1 commit with null committer email", async () => {
// 		const actualCommits = await getGitLog("abc123", "def456")
// 		expect(actualCommits).toEqual([
// 			{
// 				sha: "def456",
// 				parents: ["abc123"],
// 				authorName: "Author Name",
// 				authorEmail: "author@example.com",
// 				committerName: "Committer Name",
// 				committerEmail: null,
// 				message: "Commit message",
// 			},
// 		])
// 	})
// })
//
// describe("when there is 1 commit with a multiline message", () => {
// 	beforeEach(() => {
// 		mockGitCommand("log --format=raw abc123..def456", {
// 			output: [
// 				"commit def456",
// 				"tree 1234567890abcdef",
// 				"parent abc123",
// 				"author Author Name <author@example.com> 1234567890 +0000",
// 				"committer Committer Name <committer@example.com> 1234567890 +0000",
// 				"",
// 				"    feat: Add feature X",
// 				"    ",
// 				"    This is a longer description",
// 				"    with multiple lines.",
// 			].join("\n"),
// 		})
// 	})
//
// 	it("returns a list with 1 commit preserving the multiline message", async () => {
// 		const actualCommits = await getGitLog("abc123", "def456")
// 		expect(actualCommits).toEqual([
// 			{
// 				sha: "def456",
// 				parents: ["abc123"],
// 				authorName: "Author Name",
// 				authorEmail: "author@example.com",
// 				committerName: "Committer Name",
// 				committerEmail: "committer@example.com",
// 				message: "feat: Add feature X\n\nThis is a longer description\nwith multiple lines.",
// 			},
// 		])
// 	})
// })
//
// describe("when there are 2 commits", () => {
// 	beforeEach(() => {
// 		mockGitCommand("log --format=raw main..feature", {
// 			output: [
// 				"commit commit2",
// 				"tree 1234567890abcdef",
// 				"parent commit1",
// 				"author Alice <alice@example.com> 1234567890 +0000",
// 				"committer Alice <alice@example.com> 1234567890 +0000",
// 				"",
// 				"    Second commit",
// 				"",
// 				"commit commit1",
// 				"tree 0987654321fedcba",
// 				"parent abc123",
// 				"author Bob <bob@example.com> 1234567890 +0000",
// 				"committer Bob <bob@example.com> 1234567890 +0000",
// 				"",
// 				"    First commit",
// 			].join("\n"),
// 		})
// 	})
//
// 	it("returns a list with 2 commits in chronological order", async () => {
// 		const actualCommits = await getGitLog("main", "feature")
// 		expect(actualCommits).toEqual([
// 			{
// 				sha: "commit2",
// 				parents: ["commit1"],
// 				authorName: "Alice",
// 				authorEmail: "alice@example.com",
// 				committerName: "Alice",
// 				committerEmail: "alice@example.com",
// 				message: "Second commit",
// 			},
// 			{
// 				sha: "commit1",
// 				parents: ["abc123"],
// 				authorName: "Bob",
// 				authorEmail: "bob@example.com",
// 				committerName: "Bob",
// 				committerEmail: "bob@example.com",
// 				message: "First commit",
// 			},
// 		])
// 	})
// })
//
// describe("when there are 3 commits", () => {
// 	beforeEach(() => {
// 		mockGitCommand("log --format=raw v1.0.0..HEAD", {
// 			output: [
// 				"commit commit3",
// 				"tree 1111111111111111",
// 				"parent commit2",
// 				"author Charlie <charlie@example.com> 1234567890 +0000",
// 				"committer Charlie <charlie@example.com> 1234567890 +0000",
// 				"",
// 				"    Third commit",
// 				"",
// 				"commit commit2",
// 				"tree 2222222222222222",
// 				"parent commit1",
// 				"author Alice <alice@example.com> 1234567890 +0000",
// 				"committer Alice <alice@example.com> 1234567890 +0000",
// 				"",
// 				"    Second commit",
// 				"",
// 				"commit commit1",
// 				"tree 3333333333333333",
// 				"parent v1.0.0",
// 				"author Bob <bob@example.com> 1234567890 +0000",
// 				"committer Bob <bob@example.com> 1234567890 +0000",
// 				"",
// 				"    First commit",
// 			].join("\n"),
// 		})
// 	})
//
// 	it("returns a list with 3 commits in chronological order", async () => {
// 		const actualCommits = await getGitLog("v1.0.0", "HEAD")
// 		expect(actualCommits).toEqual([
// 			{
// 				sha: "commit3",
// 				parents: ["commit2"],
// 				authorName: "Charlie",
// 				authorEmail: "charlie@example.com",
// 				committerName: "Charlie",
// 				committerEmail: "charlie@example.com",
// 				message: "Third commit",
// 			},
// 			{
// 				sha: "commit2",
// 				parents: ["commit1"],
// 				authorName: "Alice",
// 				authorEmail: "alice@example.com",
// 				committerName: "Alice",
// 				committerEmail: "alice@example.com",
// 				message: "Second commit",
// 			},
// 			{
// 				sha: "commit1",
// 				parents: ["v1.0.0"],
// 				authorName: "Bob",
// 				authorEmail: "bob@example.com",
// 				committerName: "Bob",
// 				committerEmail: "bob@example.com",
// 				message: "First commit",
// 			},
// 		])
// 	})
// })

describe("when the 'git log' command fails", () => {
	beforeEach(() => {
		mockGitCommand(
			"--no-pager log --format=raw --no-color upstream/next..HEAD",
			{ exitCode: 128 },
		)
	})

	it("throws an error", async () => {
		await expect(getGitLog("upstream/next")).rejects.toThrow(
			"Command 'git --no-pager log --format=raw --no-color upstream/next..HEAD' failed with exit code 128",
		)
	})
})
