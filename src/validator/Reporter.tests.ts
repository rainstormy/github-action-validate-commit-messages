import type { RawCommit } from "+rules"
import { dummyCommit } from "+rules"
import type { Configuration } from "+validator"
import {
	dummyDefaultConfiguration,
	dummyGithubStyleIssueReferencesAsPrefixConfiguration,
	dummyJiraStyleIssueReferencesConfiguration,
	hintedCommitListReporter,
	validatorFrom,
} from "+validator"

describe("when the configuration has default settings", () => {
	const validate = validateHintedCommitListFrom(dummyDefaultConfiguration)

	describe("a report generated from no commits", () => {
		const commits: ReadonlyArray<RawCommit> = []
		const report = validate(commits)

		it("is empty", () => {
			expect(report).toBe("")
		})
	})

	describe("a report generated from three regular commits", () => {
		const commits: ReadonlyArray<RawCommit> = [
			dummyCommit({ subjectLine: "Make the program act like a clown" }),
			dummyCommit({
				subjectLine: "Apply strawberry jam to make the code sweeter",
			}),
			dummyCommit({ subjectLine: "Fix a typo" }),
		]
		const report = validate(commits)

		it("is empty", () => {
			expect(report).toBe("")
		})
	})

	describe("a report generated from a squash commit and a regular commit", () => {
		const commits: ReadonlyArray<RawCommit> = [
			dummyCommit({
				sha: "0ff1ce",
				subjectLine: "squash! Make the formatter happy again :)",
			}),
			dummyCommit({ subjectLine: "Release the robot butler" }),
		]
		const report = validate(commits)

		it("contains a list of violated rules and invalid commits", () => {
			expect(report).toBe(
				`Squash commits detected:
    0ff1ce squash! Make the formatter happy again :)

    Please rebase interactively to consolidate the commits before merging the pull request.`,
			)
		})
	})

	describe("a report generated from a merge commit and a regular commit", () => {
		const commits: ReadonlyArray<RawCommit> = [
			dummyCommit({
				sha: "d06f00d",
				subjectLine: "Merge branch 'master' into feature/robot-butler",
				numberOfParents: 2,
			}),
			dummyCommit({ subjectLine: "Fix this confusing plate of spaghetti" }),
		]
		const report = validate(commits)

		it("contains a list of violated rules and invalid commits", () => {
			expect(report).toBe(
				`Merge commits detected:
    d06f00d Merge branch 'master' into feature/robot-butler

    They reduce the traceability of the commit history and make it difficult to rebase interactively.
    Please undo the merge commit and rebase your branch onto the target branch instead.`,
			)
		})
	})

	describe("a report generated from three regular commits, two squash commits, and a merge commit", () => {
		const commits: ReadonlyArray<RawCommit> = [
			dummyCommit({ subjectLine: "Make the program act like a clown" }),
			dummyCommit({
				sha: "cafed00d",
				subjectLine: "fixup! Resolve a bug that thought it was a feature",
			}),
			dummyCommit({
				sha: "d06f00d",
				subjectLine: "Keep my branch up to date",
				numberOfParents: 3,
			}),
			dummyCommit({ subjectLine: "Fix this confusing plate of spaghetti" }),
			dummyCommit({
				sha: "0ff1ce",
				subjectLine: "amend! Add some extra love to the code",
			}),
			dummyCommit({
				subjectLine: "Apply strawberry jam to make the code sweeter",
			}),
		]
		const report = validate(commits)

		it("contains a list of violated rules and invalid commits", () => {
			expect(report).toBe(
				`Merge commits detected:
    d06f00d Keep my branch up to date

    They reduce the traceability of the commit history and make it difficult to rebase interactively.
    Please undo the merge commit and rebase your branch onto the target branch instead.

Squash commits detected:
    cafed00d fixup! Resolve a bug that thought it was a feature
    0ff1ce amend! Add some extra love to the code

    Please rebase interactively to consolidate the commits before merging the pull request.`,
			)
		})
	})

	describe("a report generated from two regular commits, four squash commits, and two merge commits", () => {
		const commits: ReadonlyArray<RawCommit> = [
			dummyCommit({ subjectLine: "Fix this confusing plate of spaghetti" }),
			dummyCommit({
				sha: "b105f00d",
				subjectLine: "squash! Make the formatter happy again :)",
			}),
			dummyCommit({
				sha: "cafebabe",
				subjectLine: "Merge branch 'main' into bugfix/dance-party-playlist",
				numberOfParents: 2,
			}),
			dummyCommit({
				sha: "deadc0de",
				subjectLine: "Keep my branch up to date",
				numberOfParents: 2,
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
		]
		const report = validate(commits)

		it("contains a list of violated rules and invalid commits", () => {
			expect(report).toBe(
				`Merge commits detected:
    cafebabe Merge branch 'main' into bugfix/dance-party-playlist
    deadc0de Keep my branch up to date

    They reduce the traceability of the commit history and make it difficult to rebase interactively.
    Please undo the merge commit and rebase your branch onto the target branch instead.

Squash commits detected:
    b105f00d squash! Make the formatter happy again :)
    cafed00d amend! Resolve a bug that thought it was a feature
    d06f00d squash! Organise the bookshelf
    0ff1ce fixup! Add some extra love to the code

    Please rebase interactively to consolidate the commits before merging the pull request.`,
			)
		})
	})

	describe("a report generated from two regular commits, two commits with decapitalised subject lines (of which one is also a squash commit), and a squash commit", () => {
		const commits: ReadonlyArray<RawCommit> = [
			dummyCommit({ subjectLine: "Release the robot butler" }),
			dummyCommit({ sha: "d15ea5e", subjectLine: "throw a tantrum" }),
			dummyCommit({
				sha: "0ff1ce",
				subjectLine: "fixup! Add some extra love to the code",
			}),
			dummyCommit({ sha: "cafed00d", subjectLine: "squash! make it work" }),
			dummyCommit({ subjectLine: "Fix this confusing plate of spaghetti" }),
		]
		const report = validate(commits)

		it("contains a list of violated rules and invalid commits", () => {
			expect(report).toBe(
				`Non-capitalised subject lines detected:
    d15ea5e throw a tantrum
    cafed00d squash! make it work

    Subject lines (the foremost line in the commit message) must start with an uppercase letter.
    Please rebase interactively to reword the commits before merging the pull request.

Squash commits detected:
    0ff1ce fixup! Add some extra love to the code
    cafed00d squash! make it work

    Please rebase interactively to consolidate the commits before merging the pull request.`,
			)
		})
	})

	describe("a report generated from a commit with trailing punctuation in the subject line and a squash commit", () => {
		const commits: ReadonlyArray<RawCommit> = [
			dummyCommit({
				sha: "0ff1ce",
				subjectLine: "Make the program act like a clown.",
			}),
			dummyCommit({
				sha: "d06f00d",
				subjectLine: "squash! Organise the bookshelf",
			}),
		]
		const report = validate(commits)

		it("contains a list of violated rules and invalid commits", () => {
			expect(report).toBe(
				`Squash commits detected:
    d06f00d squash! Organise the bookshelf

    Please rebase interactively to consolidate the commits before merging the pull request.

Subject lines with trailing punctuation detected:
    0ff1ce Make the program act like a clown.

    Subject lines (the foremost line in the commit message) must not end with a punctuation mark.
    Please rebase interactively to reword the commits before merging the pull request.`,
			)
		})
	})
})

describe("when the configuration overrides 'issue-references-in-subject-lines--patterns' with GitHub-style issue references as prefix", () => {
	const validate = validateHintedCommitListFrom(
		dummyGithubStyleIssueReferencesAsPrefixConfiguration,
	)

	describe("a report generated from two regular commits with an issue reference and two regular commits without an issue reference", () => {
		const commits: ReadonlyArray<RawCommit> = [
			dummyCommit({ subjectLine: "#1 Make the program act like a clown" }),
			dummyCommit({
				sha: "d06f00d",
				subjectLine: "Apply strawberry jam to make the code sweeter",
			}),
			dummyCommit({ subjectLine: "#2 Fix a typo" }),
			dummyCommit({ sha: "badf00d", subjectLine: "Organise the bookshelf" }),
		]
		const report = validate(commits)

		it("contains a list of violated rules and invalid commits", () => {
			expect(report).toBe(
				`Subject lines without issue reference detected:
    d06f00d Apply strawberry jam to make the code sweeter
    badf00d Organise the bookshelf

    Subject lines (the foremost line in the commit message) must include a reference to an issue in an issue tracking system.
    Valid patterns: \\(#[1-9][0-9]*\\) #[1-9][0-9]*: #[1-9][0-9]*
    Please rebase interactively to reword the commits before merging the pull request.`,
			)
		})
	})
})

describe("when the configuration overrides 'issue-references-in-subject-lines--patterns' with Jira-style issue references", () => {
	const validate = validateHintedCommitListFrom(
		dummyJiraStyleIssueReferencesConfiguration,
	)

	describe("a report generated from a squash commit with an issue reference and a squash commit with a decapitalised subject line with trailing punctuation and without an issue reference", () => {
		const commits: ReadonlyArray<RawCommit> = [
			dummyCommit({
				sha: "d06f00d",
				subjectLine: "squash! UNICORN-1 Make the program act like a clown",
			}),
			dummyCommit({ sha: "badf00d", subjectLine: "squash! fix a typo." }),
		]
		const report = validate(commits)

		it("contains a list of violated rules and invalid commits", () => {
			expect(report).toBe(
				`Non-capitalised subject lines detected:
    badf00d squash! fix a typo.

    Subject lines (the foremost line in the commit message) must start with an uppercase letter.
    Please rebase interactively to reword the commits before merging the pull request.

Squash commits detected:
    d06f00d squash! UNICORN-1 Make the program act like a clown
    badf00d squash! fix a typo.

    Please rebase interactively to consolidate the commits before merging the pull request.

Subject lines with trailing punctuation detected:
    badf00d squash! fix a typo.

    Subject lines (the foremost line in the commit message) must not end with a punctuation mark.
    Please rebase interactively to reword the commits before merging the pull request.

Subject lines without issue reference detected:
    badf00d squash! fix a typo.

    Subject lines (the foremost line in the commit message) must include a reference to an issue in an issue tracking system.
    Valid patterns: \\(UNICORN-[1-9][0-9]*\\) UNICORN-[1-9][0-9]*: UNICORN-[1-9][0-9]*
    Please rebase interactively to reword the commits before merging the pull request.`,
			)
		})
	})
})

function validateHintedCommitListFrom(
	configuration: Configuration,
): (commits: ReadonlyArray<RawCommit>) => string {
	return (commits) =>
		validatorFrom(configuration)(
			commits,
			hintedCommitListReporter(configuration),
		)
}
