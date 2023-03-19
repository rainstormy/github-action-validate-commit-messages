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

	describe("a report generated from two regular commits, a squash commit, and two commits with decapitalised subject lines of which one is also a squash commit that does not start with a verb in the imperative mood", () => {
		const commits: ReadonlyArray<RawCommit> = [
			dummyCommit({ subjectLine: "Release the robot butler" }),
			dummyCommit({ sha: "d15ea5e", subjectLine: "throw a tantrum" }),
			dummyCommit({
				sha: "0ff1ce",
				subjectLine: "fixup! Added some extra love to the code",
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

Subject lines in non-imperative mood detected:
    0ff1ce fixup! Added some extra love to the code

    Subject lines (the foremost line in the commit message) must start with a verb in the imperative mood.
    The subject line should read like an instruction to satisfy this sentence: "When applied, this commit will [subject line]."

    For example, prefer "this commit will [Add a feature]" or "this commit will [Format the code]" or "this commit will [Make it work]"
    instead of "this commit will [Added a feature]" or "this commit will [Formatting]" or "this commit will [It works]".

    Please rebase interactively to reword the commits before merging the pull request.

Squash commits detected:
    0ff1ce fixup! Added some extra love to the code
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

	describe("a report generated from a commit with a decapitalised single-word subject line with trailing whitespace", () => {
		const commits: ReadonlyArray<RawCommit> = [
			dummyCommit({ sha: "d06f00d", subjectLine: "test " }),
		]
		const report = validate(commits)

		it("contains a list of violated rules and invalid commits", () => {
			expect(report).toBe(
				`Non-capitalised subject lines detected:
    d06f00d test

    Subject lines (the foremost line in the commit message) must start with an uppercase letter.
    Please rebase interactively to reword the commits before merging the pull request.

Subject lines with less than two words detected:
    d06f00d test

    Subject lines (the foremost line in the commit message) must contain at least two words.
    Please rebase interactively to reword the commits before merging the pull request.

Inappropriate whitespace detected:
    d06f00d test

    Subject lines (the foremost line in the commit message) must not contain leading, trailing, or consecutive whitespace characters.
    Commit message bodies must not contain consecutive whitespace characters, except for indentation.
    Please rebase interactively to reword the commits before merging the pull request.`,
			)
		})
	})

	describe("a report generated from commits with subject lines that do not start with a verb in the imperative mood of which one also consists of just a single word", () => {
		const commits: ReadonlyArray<RawCommit> = [
			dummyCommit({ sha: "0ff1ce", subjectLine: "Fixed a typo" }),
			dummyCommit({ sha: "d06f00d", subjectLine: "Formatting" }),
		]
		const report = validate(commits)

		it("contains a list of violated rules and invalid commits", () => {
			expect(report).toBe(
				`Subject lines in non-imperative mood detected:
    0ff1ce Fixed a typo
    d06f00d Formatting

    Subject lines (the foremost line in the commit message) must start with a verb in the imperative mood.
    The subject line should read like an instruction to satisfy this sentence: "When applied, this commit will [subject line]."

    For example, prefer "this commit will [Add a feature]" or "this commit will [Format the code]" or "this commit will [Make it work]"
    instead of "this commit will [Added a feature]" or "this commit will [Formatting]" or "this commit will [It works]".

    Please rebase interactively to reword the commits before merging the pull request.

Subject lines with less than two words detected:
    d06f00d Formatting

    Subject lines (the foremost line in the commit message) must contain at least two words.
    Please rebase interactively to reword the commits before merging the pull request.`,
			)
		})
	})

	describe("a report generated from a commit with a subject line that is too long and a commit with a body line that is too long", () => {
		const commits: ReadonlyArray<RawCommit> = [
			dummyCommit({
				sha: "0ff1ce",
				subjectLine:
					"Compare the list of items to the objects downloaded from the server",
				body: "\nThat is good.",
			}),
			dummyCommit({
				sha: "d06f00d",
				subjectLine: "Install necessary dependencies",
				body: "\nWe discovered some more dependencies after running this command:\n\n```shell\nyarn install\n```\n\nIt turns out that we do in fact need the following dependencies after all. This commit installs them.\n\n```shell\nyarn add @elements/hydrogen@1.0.0 @elements/nitrogen@2.5.0 @elements/oxygen@2.6.0\n```",
			}),
		]
		const report = validate(commits)

		it("contains a list of violated rules and invalid commits", () => {
			expect(report).toBe(
				`Commits with long lines detected:
    0ff1ce Compare the list of items to the objects downloaded from the server
    d06f00d Install necessary dependencies

    Subject lines (the foremost line in the commit message) must not exceed 50 characters.
    Lines in the commit message body must not exceed 72 characters.
    Please rebase interactively to reword the commits before merging the pull request.`,
			)
		})
	})

	describe("a report generated from a commit with leading whitespace in the subject line and a commit without an empty line between the subject line and body which also contains consecutive whitespace", () => {
		const commits: ReadonlyArray<RawCommit> = [
			dummyCommit({ sha: "off1ce", subjectLine: " Do it right this time" }),
			dummyCommit({
				sha: "d06f00d",
				subjectLine: "Make it work",
				body: "It'd better  work this time.",
			}),
		]
		const report = validate(commits)

		it("contains a list of violated rules and invalid commits", () => {
			expect(report).toBe(
				`Missing separator between subject line and body detected:
    d06f00d Make it work

    One empty line must separate the subject line (the foremost line) from the following lines in the commit message.
    Please rebase interactively to reword the commits before merging the pull request.

Inappropriate whitespace detected:
    off1ce Do it right this time
    d06f00d Make it work

    Subject lines (the foremost line in the commit message) must not contain leading, trailing, or consecutive whitespace characters.
    Commit message bodies must not contain consecutive whitespace characters, except for indentation.
    Please rebase interactively to reword the commits before merging the pull request.`,
			)
		})
	})

	describe("a report generated from a regular commit and a commit without an empty line between the subject line and body", () => {
		const commits: ReadonlyArray<RawCommit> = [
			dummyCommit({ subjectLine: "Make it right this time" }),
			dummyCommit({
				sha: "off1ce",
				subjectLine: "Improve some stuff",
				body: "This makes things even better.",
			}),
		]
		const report = validate(commits)

		it("contains a list of violated rules and invalid commits", () => {
			expect(report).toBe(
				`Missing separator between subject line and body detected:
    off1ce Improve some stuff

    One empty line must separate the subject line (the foremost line) from the following lines in the commit message.
    Please rebase interactively to reword the commits before merging the pull request.`,
			)
		})
	})

	describe("a report generated from a revert commit, a revert of the revert commit, and a revert of the doubly revert commit", () => {
		const commits: ReadonlyArray<RawCommit> = [
			dummyCommit({ subjectLine: 'Revert "Repair the soft ice machine"' }),
			dummyCommit({
				sha: "off1ce",
				subjectLine: 'Revert "Revert "Repair the soft ice machine""',
			}),
			dummyCommit({
				sha: "d06f00d",
				subjectLine: 'Revert "Revert "Revert "Repair the soft ice machine"""',
			}),
		]
		const report = validate(commits)

		it("contains a list of violated rules and invalid commits", () => {
			expect(report).toBe(
				`Revert of revert commits detected:
    off1ce Revert "Revert "Repair the soft ice machine""
    d06f00d Revert "Revert "Revert "Repair the soft ice machine"""

    They reduce the traceability of the commit history.
    Please undo the revert of the revert commit and re-apply the original commit before merging the pull request.`,
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

describe("when the configuration overrides 'limit-line-lengths--max-subject-line-characters' with 1 and 'limit-line-lengths--max-body-line-characters' with 32", () => {
	const validate = validateHintedCommitListFrom({
		...dummyDefaultConfiguration,
		limitLineLengths: {
			maximumCharactersInSubjectLine: 1,
			maximumCharactersInBodyLine: 32,
		},
	})

	describe("a report generated from a commit with a subject line that is too long and a commit with a body line that is too long", () => {
		const commits: ReadonlyArray<RawCommit> = [
			dummyCommit({
				sha: "0ff1ce",
				subjectLine: "Introduce a cool feature",
				body: "\nThat is good.",
			}),
			dummyCommit({
				sha: "d06f00d",
				subjectLine: "Help fix the bug",
				body: "\nIt was really just a matter of time.",
			}),
		]
		const report = validate(commits)

		it("contains a list of violated rules and invalid commits", () => {
			expect(report).toBe(
				`Commits with long lines detected:
    0ff1ce Introduce a cool feature
    d06f00d Help fix the bug

    Subject lines (the foremost line in the commit message) must not exceed 1 character.
    Lines in the commit message body must not exceed 32 characters.
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
