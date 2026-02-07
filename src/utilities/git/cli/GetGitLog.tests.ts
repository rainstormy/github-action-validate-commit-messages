import { mockGitCommand } from "#utilities/git/cli/RunGitCommand.mocks.ts"
import { beforeEach, describe, expect, it } from "vitest"
import { getGitLog } from "#utilities/git/cli/GetGitLog.ts"

const delimiter = "<<<COMMIT_DELIMITER>>>"
const fieldSeparator = "<<<FIELD_SEPARATOR>>>"

describe("when there are no commits between the two references", () => {
	beforeEach(() => {
		mockGitCommand(
			`log --format=${delimiter}%H${fieldSeparator}%P${fieldSeparator}%an${fieldSeparator}%ae${fieldSeparator}%cn${fieldSeparator}%ce${fieldSeparator}%B main..feature`,
			{
				output: "",
			},
		)
	})

	it("returns an empty list", async () => {
		const actualCommits = await getGitLog("main", "feature")
		expect(actualCommits).toEqual([])
	})
})

describe("when there is 1 commit with a single parent", () => {
	beforeEach(() => {
		mockGitCommand(
			`log --format=${delimiter}%H${fieldSeparator}%P${fieldSeparator}%an${fieldSeparator}%ae${fieldSeparator}%cn${fieldSeparator}%ce${fieldSeparator}%B abc123..def456`,
			{
				output: [
					delimiter,
					"def456",
					fieldSeparator,
					"abc123",
					fieldSeparator,
					"John Doe",
					fieldSeparator,
					"john@example.com",
					fieldSeparator,
					"Jane Smith",
					fieldSeparator,
					"jane@example.com",
					fieldSeparator,
					"Add feature X",
				].join(""),
			},
		)
	})

	it("returns a list with 1 commit", async () => {
		const actualCommits = await getGitLog("abc123", "def456")
		expect(actualCommits).toEqual([
			{
				sha: "def456",
				parents: ["abc123"],
				authorName: "John Doe",
				authorEmail: "john@example.com",
				committerName: "Jane Smith",
				committerEmail: "jane@example.com",
				message: "Add feature X",
			},
		])
	})
})

describe("when there is 1 commit with multiple parents (merge commit)", () => {
	beforeEach(() => {
		mockGitCommand(
			`log --format=${delimiter}%H${fieldSeparator}%P${fieldSeparator}%an${fieldSeparator}%ae${fieldSeparator}%cn${fieldSeparator}%ce${fieldSeparator}%B main..feature`,
			{
				output: [
					delimiter,
					"merge123",
					fieldSeparator,
					"abc123 def456",
					fieldSeparator,
					"Merger Person",
					fieldSeparator,
					"merger@example.com",
					fieldSeparator,
					"Merger Person",
					fieldSeparator,
					"merger@example.com",
					fieldSeparator,
					"Merge branch 'feature' into main",
				].join(""),
			},
		)
	})

	it("returns a list with 1 commit with multiple parents", async () => {
		const actualCommits = await getGitLog("main", "feature")
		expect(actualCommits).toEqual([
			{
				sha: "merge123",
				parents: ["abc123", "def456"],
				authorName: "Merger Person",
				authorEmail: "merger@example.com",
				committerName: "Merger Person",
				committerEmail: "merger@example.com",
				message: "Merge branch 'feature' into main",
			},
		])
	})
})

describe("when there is 1 commit with empty author name", () => {
	beforeEach(() => {
		mockGitCommand(
			`log --format=${delimiter}%H${fieldSeparator}%P${fieldSeparator}%an${fieldSeparator}%ae${fieldSeparator}%cn${fieldSeparator}%ce${fieldSeparator}%B abc123..def456`,
			{
				output: [
					delimiter,
					"def456",
					fieldSeparator,
					"abc123",
					fieldSeparator,
					"",
					fieldSeparator,
					"author@example.com",
					fieldSeparator,
					"Committer Name",
					fieldSeparator,
					"committer@example.com",
					fieldSeparator,
					"Commit message",
				].join(""),
			},
		)
	})

	it("returns a list with 1 commit with null author name", async () => {
		const actualCommits = await getGitLog("abc123", "def456")
		expect(actualCommits).toEqual([
			{
				sha: "def456",
				parents: ["abc123"],
				authorName: null,
				authorEmail: "author@example.com",
				committerName: "Committer Name",
				committerEmail: "committer@example.com",
				message: "Commit message",
			},
		])
	})
})

describe("when there is 1 commit with empty committer email", () => {
	beforeEach(() => {
		mockGitCommand(
			`log --format=${delimiter}%H${fieldSeparator}%P${fieldSeparator}%an${fieldSeparator}%ae${fieldSeparator}%cn${fieldSeparator}%ce${fieldSeparator}%B abc123..def456`,
			{
				output: [
					delimiter,
					"def456",
					fieldSeparator,
					"abc123",
					fieldSeparator,
					"Author Name",
					fieldSeparator,
					"author@example.com",
					fieldSeparator,
					"Committer Name",
					fieldSeparator,
					"",
					fieldSeparator,
					"Commit message",
				].join(""),
			},
		)
	})

	it("returns a list with 1 commit with null committer email", async () => {
		const actualCommits = await getGitLog("abc123", "def456")
		expect(actualCommits).toEqual([
			{
				sha: "def456",
				parents: ["abc123"],
				authorName: "Author Name",
				authorEmail: "author@example.com",
				committerName: "Committer Name",
				committerEmail: null,
				message: "Commit message",
			},
		])
	})
})

describe("when there is 1 commit with a multiline message", () => {
	beforeEach(() => {
		mockGitCommand(
			`log --format=${delimiter}%H${fieldSeparator}%P${fieldSeparator}%an${fieldSeparator}%ae${fieldSeparator}%cn${fieldSeparator}%ce${fieldSeparator}%B abc123..def456`,
			{
				output: [
					delimiter,
					"def456",
					fieldSeparator,
					"abc123",
					fieldSeparator,
					"Author Name",
					fieldSeparator,
					"author@example.com",
					fieldSeparator,
					"Committer Name",
					fieldSeparator,
					"committer@example.com",
					fieldSeparator,
					"feat: Add feature X\n\nThis is a longer description\nwith multiple lines.",
				].join(""),
			},
		)
	})

	it("returns a list with 1 commit preserving the multiline message", async () => {
		const actualCommits = await getGitLog("abc123", "def456")
		expect(actualCommits).toEqual([
			{
				sha: "def456",
				parents: ["abc123"],
				authorName: "Author Name",
				authorEmail: "author@example.com",
				committerName: "Committer Name",
				committerEmail: "committer@example.com",
				message:
					"feat: Add feature X\n\nThis is a longer description\nwith multiple lines.",
			},
		])
	})
})

describe("when there is 1 commit with a message containing the field separator", () => {
	beforeEach(() => {
		mockGitCommand(
			`log --format=${delimiter}%H${fieldSeparator}%P${fieldSeparator}%an${fieldSeparator}%ae${fieldSeparator}%cn${fieldSeparator}%ce${fieldSeparator}%B abc123..def456`,
			{
				output: [
					delimiter,
					"def456",
					fieldSeparator,
					"abc123",
					fieldSeparator,
					"Author Name",
					fieldSeparator,
					"author@example.com",
					fieldSeparator,
					"Committer Name",
					fieldSeparator,
					"committer@example.com",
					fieldSeparator,
					`Message with ${fieldSeparator} separator`,
				].join(""),
			},
		)
	})

	it("returns a list with 1 commit preserving the message with field separator", async () => {
		const actualCommits = await getGitLog("abc123", "def456")
		expect(actualCommits).toEqual([
			{
				sha: "def456",
				parents: ["abc123"],
				authorName: "Author Name",
				authorEmail: "author@example.com",
				committerName: "Committer Name",
				committerEmail: "committer@example.com",
				message: `Message with ${fieldSeparator} separator`,
			},
		])
	})
})

describe("when there are 2 commits", () => {
	beforeEach(() => {
		mockGitCommand(
			`log --format=${delimiter}%H${fieldSeparator}%P${fieldSeparator}%an${fieldSeparator}%ae${fieldSeparator}%cn${fieldSeparator}%ce${fieldSeparator}%B main..feature`,
			{
				output: [
					delimiter,
					"commit2",
					fieldSeparator,
					"commit1",
					fieldSeparator,
					"Alice",
					fieldSeparator,
					"alice@example.com",
					fieldSeparator,
					"Alice",
					fieldSeparator,
					"alice@example.com",
					fieldSeparator,
					"Second commit",
					delimiter,
					"commit1",
					fieldSeparator,
					"abc123",
					fieldSeparator,
					"Bob",
					fieldSeparator,
					"bob@example.com",
					fieldSeparator,
					"Bob",
					fieldSeparator,
					"bob@example.com",
					fieldSeparator,
					"First commit",
				].join(""),
			},
		)
	})

	it("returns a list with 2 commits in chronological order", async () => {
		const actualCommits = await getGitLog("main", "feature")
		expect(actualCommits).toEqual([
			{
				sha: "commit2",
				parents: ["commit1"],
				authorName: "Alice",
				authorEmail: "alice@example.com",
				committerName: "Alice",
				committerEmail: "alice@example.com",
				message: "Second commit",
			},
			{
				sha: "commit1",
				parents: ["abc123"],
				authorName: "Bob",
				authorEmail: "bob@example.com",
				committerName: "Bob",
				committerEmail: "bob@example.com",
				message: "First commit",
			},
		])
	})
})

describe("when there are 3 commits", () => {
	beforeEach(() => {
		mockGitCommand(
			`log --format=${delimiter}%H${fieldSeparator}%P${fieldSeparator}%an${fieldSeparator}%ae${fieldSeparator}%cn${fieldSeparator}%ce${fieldSeparator}%B v1.0.0..HEAD`,
			{
				output: [
					delimiter,
					"commit3",
					fieldSeparator,
					"commit2",
					fieldSeparator,
					"Charlie",
					fieldSeparator,
					"charlie@example.com",
					fieldSeparator,
					"Charlie",
					fieldSeparator,
					"charlie@example.com",
					fieldSeparator,
					"Third commit",
					delimiter,
					"commit2",
					fieldSeparator,
					"commit1",
					fieldSeparator,
					"Alice",
					fieldSeparator,
					"alice@example.com",
					fieldSeparator,
					"Alice",
					fieldSeparator,
					"alice@example.com",
					fieldSeparator,
					"Second commit",
					delimiter,
					"commit1",
					fieldSeparator,
					"v1.0.0",
					fieldSeparator,
					"Bob",
					fieldSeparator,
					"bob@example.com",
					fieldSeparator,
					"Bob",
					fieldSeparator,
					"bob@example.com",
					fieldSeparator,
					"First commit",
				].join(""),
			},
		)
	})

	it("returns a list with 3 commits in chronological order", async () => {
		const actualCommits = await getGitLog("v1.0.0", "HEAD")
		expect(actualCommits).toEqual([
			{
				sha: "commit3",
				parents: ["commit2"],
				authorName: "Charlie",
				authorEmail: "charlie@example.com",
				committerName: "Charlie",
				committerEmail: "charlie@example.com",
				message: "Third commit",
			},
			{
				sha: "commit2",
				parents: ["commit1"],
				authorName: "Alice",
				authorEmail: "alice@example.com",
				committerName: "Alice",
				committerEmail: "alice@example.com",
				message: "Second commit",
			},
			{
				sha: "commit1",
				parents: ["v1.0.0"],
				authorName: "Bob",
				authorEmail: "bob@example.com",
				committerName: "Bob",
				committerEmail: "bob@example.com",
				message: "First commit",
			},
		])
	})
})

describe("when the Git command fails", () => {
	beforeEach(() => {
		mockGitCommand(
			`log --format=${delimiter}%H${fieldSeparator}%P${fieldSeparator}%an${fieldSeparator}%ae${fieldSeparator}%cn${fieldSeparator}%ce${fieldSeparator}%B invalid..range`,
			{
				exitCode: 128,
			},
		)
	})

	it("throws an error", async () => {
		await expect(getGitLog("invalid", "range")).rejects.toThrow(
			`Command 'git log --format=${delimiter}%H${fieldSeparator}%P${fieldSeparator}%an${fieldSeparator}%ae${fieldSeparator}%cn${fieldSeparator}%ce${fieldSeparator}%B invalid..range' failed with exit code 128`,
		)
	})
})
