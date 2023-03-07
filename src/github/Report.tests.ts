import { dummyCommitFactory } from "+core/dummies"
import { reportOf } from "+github"
import { getAllApplicableRules } from "+validation"
import { dummyConfiguration } from "+validation/dummies"

const { commitOf, mergeCommitOf } = dummyCommitFactory()

const allApplicableRules = getAllApplicableRules(dummyConfiguration)

describe("a report generated from no commits", () => {
	const report = reportOf({
		ruleset: allApplicableRules,
		commitsToValidate: [],
	})

	it("is empty", () => {
		expect(report).toBeNull()
	})
})

describe("a report generated from three regular commits", () => {
	const report = reportOf({
		ruleset: allApplicableRules,
		commitsToValidate: [
			commitOf("Make the program act like a clown"),
			commitOf("Apply strawberry jam to make the code sweeter"),
			commitOf("Fix a typo"),
		],
	})

	it("is empty", () => {
		expect(report).toBeNull()
	})
})

describe("a report generated from a squash commit and a regular commit", () => {
	const report = reportOf({
		ruleset: allApplicableRules,
		commitsToValidate: [
			commitOf("squash! Make the formatter happy again :)", "0ff1ce"),
			commitOf("Release the robot butler"),
		],
	})

	it("reports one violated rule", () => {
		expect(report).toBe(
			`Squash commits detected:
    0ff1ce squash! Make the formatter happy again :)

    Please rebase interactively to consolidate the squash commits before merging the pull request.`,
		)
	})
})

describe("a report generated from a merge commit and a regular commit", () => {
	const report = reportOf({
		ruleset: allApplicableRules,
		commitsToValidate: [
			mergeCommitOf(
				"Merge branch 'master' into feature/robot-butler",
				["cafebabe", "cafed00d"],
				"d06f00d",
			),
			commitOf("Fix this confusing plate of spaghetti"),
		],
	})

	it("reports one violated rule", () => {
		expect(report).toBe(
			`Merge commits detected:
    d06f00d Merge branch 'master' into feature/robot-butler

    They reduce the traceability of the commit history and make it difficult to rebase interactively. Please undo the merge commit and rebase your branch onto the target branch instead.`,
		)
	})
})

describe("a report generated from a mix of three regular commits, two fixup commits, and a merge commit", () => {
	const report = reportOf({
		ruleset: allApplicableRules,
		commitsToValidate: [
			commitOf("Make the program act like a clown"),
			commitOf(
				"fixup! Resolve a bug that thought it was a feature",
				"cafed00d",
			),
			mergeCommitOf(
				"Keep my branch up to date",
				["badf00d", "deadc0de", "d15ea5e"],
				"d06f00d",
			),
			commitOf("Fix this confusing plate of spaghetti"),
			commitOf("fixup! Add some extra love to the code", "0ff1ce"),
			commitOf("Apply strawberry jam to make the code sweeter"),
		],
	})

	it("reports two violated rules", () => {
		expect(report).toBe(
			`Fixup commits detected:
    cafed00d fixup! Resolve a bug that thought it was a feature
    0ff1ce fixup! Add some extra love to the code

    Please rebase interactively to consolidate the fixup commits before merging the pull request.

Merge commits detected:
    d06f00d Keep my branch up to date

    They reduce the traceability of the commit history and make it difficult to rebase interactively. Please undo the merge commit and rebase your branch onto the target branch instead.`,
		)
	})
})

describe("a report generated from a mix of two regular commits, two squash commits, two merge commits, and two fixup commits", () => {
	const report = reportOf({
		ruleset: allApplicableRules,
		commitsToValidate: [
			commitOf("Fix this confusing plate of spaghetti"),
			commitOf("squash! Make the formatter happy again :)", "b105f00d"),
			mergeCommitOf(
				"Merge branch 'main' into bugfix/dance-party-playlist",
				["badf00d", "cafed00d"],
				"cafebabe",
			),
			mergeCommitOf(
				"Keep my branch up to date",
				["badf00d", "d15ea5e"],
				"deadc0de",
			),
			commitOf(
				"fixup! Resolve a bug that thought it was a feature",
				"cafed00d",
			),
			commitOf("squash! Organise the bookshelf", "d06f00d"),
			commitOf("Release the robot butler"),
			commitOf("fixup! Add some extra love to the code", "0ff1ce"),
		],
	})

	it("reports three violated rules", () => {
		expect(report).toBe(
			`Fixup commits detected:
    cafed00d fixup! Resolve a bug that thought it was a feature
    0ff1ce fixup! Add some extra love to the code

    Please rebase interactively to consolidate the fixup commits before merging the pull request.

Squash commits detected:
    b105f00d squash! Make the formatter happy again :)
    d06f00d squash! Organise the bookshelf

    Please rebase interactively to consolidate the squash commits before merging the pull request.

Merge commits detected:
    cafebabe Merge branch 'main' into bugfix/dance-party-playlist
    deadc0de Keep my branch up to date

    They reduce the traceability of the commit history and make it difficult to rebase interactively. Please undo the merge commit and rebase your branch onto the target branch instead.`,
		)
	})
})

describe("a report generated from a mix of two regular commits, two commits with decapitalised subject lines (of which one is also a squash commit), and a fixup commit", () => {
	const report = reportOf({
		ruleset: allApplicableRules,
		commitsToValidate: [
			commitOf("Release the robot butler"),
			commitOf("throw a tantrum", "d15ea5e"),
			commitOf("fixup! Add some extra love to the code", "0ff1ce"),
			commitOf("squash! make it work", "cafed00d"),
			commitOf("Fix this confusing plate of spaghetti"),
		],
	})

	it("reports three violated rules", () => {
		expect(report).toBe(
			`Non-capitalised subject lines detected:
    d15ea5e throw a tantrum
    cafed00d squash! make it work

    Subject lines (the foremost line in the commit message) must start with an uppercase letter. Please rebase interactively to reword the commits before merging the pull request.

Fixup commits detected:
    0ff1ce fixup! Add some extra love to the code

    Please rebase interactively to consolidate the fixup commits before merging the pull request.

Squash commits detected:
    cafed00d squash! make it work

    Please rebase interactively to consolidate the squash commits before merging the pull request.`,
		)
	})
})

describe("a report generated from a mix of a commit with trailing punctuation in the subject line and a squash commit", () => {
	const report = reportOf({
		ruleset: allApplicableRules,
		commitsToValidate: [
			commitOf("Make the program act like a clown.", "0ff1ce"),
			commitOf("squash! Organise the bookshelf", "d06f00d"),
		],
	})

	it("reports two violated rules", () => {
		expect(report).toBe(
			`Squash commits detected:
    d06f00d squash! Organise the bookshelf

    Please rebase interactively to consolidate the squash commits before merging the pull request.

Subject lines with trailing punctuation detected:
    0ff1ce Make the program act like a clown.

    Subject lines (the foremost line in the commit message) must not end with a punctuation mark. Please rebase interactively to reword the commits before merging the pull request.`,
		)
	})
})
