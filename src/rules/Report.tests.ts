import { dummyCommit, dummyMergeCommit } from "+commits"
import { dummyConfiguration } from "+configuration"
import { reportFrom } from "+rules"

describe("a report generated from no commits", () => {
	const report = reportFrom({
		configuration: dummyConfiguration,
		commitsToValidate: [],
	})

	it("is empty", () => {
		expect(report).toBe("")
	})
})

describe("a report generated from three regular commits", () => {
	const report = reportFrom({
		configuration: dummyConfiguration,
		commitsToValidate: [
			dummyCommit({ subjectLine: "Make the program act like a clown" }),
			dummyCommit({
				subjectLine: "Apply strawberry jam to make the code sweeter",
			}),
			dummyCommit({ subjectLine: "Fix a typo" }),
		],
	})

	it("is empty", () => {
		expect(report).toBe("")
	})
})

describe("a report generated from a squash commit and a regular commit", () => {
	const report = reportFrom({
		configuration: dummyConfiguration,
		commitsToValidate: [
			dummyCommit({
				sha: "0ff1ce",
				subjectLine: "squash! Make the formatter happy again :)",
			}),
			dummyCommit({ subjectLine: "Release the robot butler" }),
		],
	})

	it("reports one violated rule", () => {
		expect(report).toBe(
			`Squash commits detected:
    0ff1ce squash! Make the formatter happy again :)

    Please rebase interactively to consolidate the commits before merging the pull request.`,
		)
	})
})

describe("a report generated from a merge commit and a regular commit", () => {
	const report = reportFrom({
		configuration: dummyConfiguration,
		commitsToValidate: [
			dummyMergeCommit({
				sha: "d06f00d",
				subjectLine: "Merge branch 'master' into feature/robot-butler",
				parentShas: ["cafebabe", "cafed00d"],
			}),
			dummyCommit({ subjectLine: "Fix this confusing plate of spaghetti" }),
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

describe("a report generated from a mix of three regular commits, two squash commits, and a merge commit", () => {
	const report = reportFrom({
		configuration: dummyConfiguration,
		commitsToValidate: [
			dummyCommit({ subjectLine: "Make the program act like a clown" }),
			dummyCommit({
				sha: "cafed00d",
				subjectLine: "fixup! Resolve a bug that thought it was a feature",
			}),
			dummyMergeCommit({
				sha: "d06f00d",
				subjectLine: "Keep my branch up to date",
				parentShas: ["badf00d", "deadc0de", "d15ea5e"],
			}),
			dummyCommit({ subjectLine: "Fix this confusing plate of spaghetti" }),
			dummyCommit({
				sha: "0ff1ce",
				subjectLine: "amend! Add some extra love to the code",
			}),
			dummyCommit({
				subjectLine: "Apply strawberry jam to make the code sweeter",
			}),
		],
	})

	it("reports two violated rules", () => {
		expect(report).toBe(
			`Merge commits detected:
    d06f00d Keep my branch up to date

    They reduce the traceability of the commit history and make it difficult to rebase interactively. Please undo the merge commit and rebase your branch onto the target branch instead.

Squash commits detected:
    cafed00d fixup! Resolve a bug that thought it was a feature
    0ff1ce amend! Add some extra love to the code

    Please rebase interactively to consolidate the commits before merging the pull request.`,
		)
	})
})

describe("a report generated from a mix of two regular commits, four squash commits, two merge commits", () => {
	const report = reportFrom({
		configuration: dummyConfiguration,
		commitsToValidate: [
			dummyCommit({ subjectLine: "Fix this confusing plate of spaghetti" }),
			dummyCommit({
				sha: "b105f00d",
				subjectLine: "squash! Make the formatter happy again :)",
			}),
			dummyMergeCommit({
				sha: "cafebabe",
				subjectLine: "Merge branch 'main' into bugfix/dance-party-playlist",
				parentShas: ["badf00d", "cafed00d"],
			}),
			dummyMergeCommit({
				sha: "deadc0de",
				subjectLine: "Keep my branch up to date",
				parentShas: ["badf00d", "d15ea5e"],
			}),
			dummyCommit({
				sha: "cafed00d",
				subjectLine: "amend! Resolve a bug that thought it was a feature",
			}),
			dummyCommit({
				sha: "d06f00d",
				subjectLine: "squash! Organise the bookshelf",
			}),
			dummyCommit({ subjectLine: "Release the robot butler" }),
			dummyCommit({
				sha: "0ff1ce",
				subjectLine: "fixup! Add some extra love to the code",
			}),
		],
	})

	it("reports three violated rules", () => {
		expect(report).toBe(
			`Merge commits detected:
    cafebabe Merge branch 'main' into bugfix/dance-party-playlist
    deadc0de Keep my branch up to date

    They reduce the traceability of the commit history and make it difficult to rebase interactively. Please undo the merge commit and rebase your branch onto the target branch instead.

Squash commits detected:
    b105f00d squash! Make the formatter happy again :)
    cafed00d amend! Resolve a bug that thought it was a feature
    d06f00d squash! Organise the bookshelf
    0ff1ce fixup! Add some extra love to the code

    Please rebase interactively to consolidate the commits before merging the pull request.`,
		)
	})
})

describe("a report generated from a mix of two regular commits, two commits with decapitalised subject lines (of which one is also a squash commit), and a squash commit", () => {
	const report = reportFrom({
		configuration: dummyConfiguration,
		commitsToValidate: [
			dummyCommit({ subjectLine: "Release the robot butler" }),
			dummyCommit({ sha: "d15ea5e", subjectLine: "throw a tantrum" }),
			dummyCommit({
				sha: "0ff1ce",
				subjectLine: "fixup! Add some extra love to the code",
			}),
			dummyCommit({ sha: "cafed00d", subjectLine: "squash! make it work" }),
			dummyCommit({ subjectLine: "Fix this confusing plate of spaghetti" }),
		],
	})

	it("reports three violated rules", () => {
		expect(report).toBe(
			`Non-capitalised subject lines detected:
    d15ea5e throw a tantrum
    cafed00d squash! make it work

    Subject lines (the foremost line in the commit message) must start with an uppercase letter. Please rebase interactively to reword the commits before merging the pull request.

Squash commits detected:
    0ff1ce fixup! Add some extra love to the code
    cafed00d squash! make it work

    Please rebase interactively to consolidate the commits before merging the pull request.`,
		)
	})
})

describe("a report generated from a mix of a commit with trailing punctuation in the subject line and a squash commit", () => {
	const report = reportFrom({
		configuration: dummyConfiguration,
		commitsToValidate: [
			dummyCommit({
				sha: "0ff1ce",
				subjectLine: "Make the program act like a clown.",
			}),
			dummyCommit({
				sha: "d06f00d",
				subjectLine: "squash! Organise the bookshelf",
			}),
		],
	})

	it("reports two violated rules", () => {
		expect(report).toBe(
			`Squash commits detected:
    d06f00d squash! Organise the bookshelf

    Please rebase interactively to consolidate the commits before merging the pull request.

Subject lines with trailing punctuation detected:
    0ff1ce Make the program act like a clown.

    Subject lines (the foremost line in the commit message) must not end with a punctuation mark. Please rebase interactively to reword the commits before merging the pull request.`,
		)
	})
})
