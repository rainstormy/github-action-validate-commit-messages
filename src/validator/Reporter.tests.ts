import type { RawCommit } from "+rules/Commit"
import { dummyCommit } from "+rules/Commit.dummies"
import type { Configuration } from "+validator/Configuration"
import {
	dummyDefaultConfiguration,
	dummyGithubStyleIssueReferencesAsPrefixConfiguration,
	dummyJiraStyleIssueReferencesConfiguration,
	dummyLegendaryCompanyEmailAddressesAndFourLetterNamesConfiguration,
	dummyNoreplyGithubOrFictiveCompanyEmailAddressesAndTwoWordOrThreeLetterNamesConfiguration,
} from "+validator/Configuration.dummies"
import { instructiveReporter } from "+validator/Reporter"
import { validatorFrom } from "+validator/Validator"
import { describe, expect, it } from "vitest"

describe("when the configuration has default settings", () => {
	const validate = validateInstructionsFrom(dummyDefaultConfiguration)

	describe("a report generated from no commits", () => {
		const report = validate([])

		it("is empty", () => {
			expect(report).toHaveLength(0)
		})
	})

	describe("a report generated from three valid commits", () => {
		const report = validate([
			dummyCommit({ subjectLine: "Make the program act like a clown" }),
			dummyCommit({
				subjectLine: "Apply strawberry jam to make the code sweeter",
			}),
			dummyCommit({ subjectLine: "Fix a typo" }),
		])

		it("is empty", () => {
			expect(report).toHaveLength(0)
		})
	})

	describe("a report generated from a valid commit and a commit with a decapitalised subject line", () => {
		const report = validate([
			dummyCommit({ subjectLine: "Have fun" }),
			dummyCommit({ sha: "d15ea5e", subjectLine: "throw a tantrum" }),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please capitalise the subject line:
    d15ea5e throw a tantrum

    Reword the commit message to make the foremost line start with an uppercase letter.
    Standardising the commit message format will help you preserve the readability of the commit history.`,
			])
		})
	})

	describe("a report generated from two commits with a decapitalised subject line", () => {
		const report = validate([
			dummyCommit({ sha: "badd06", subjectLine: "have fun" }),
			dummyCommit({ sha: "c0ffee", subjectLine: "release the robot butler" }),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please capitalise the subject lines:
    badd06 have fun
    c0ffee release the robot butler

    Reword each commit message to make the foremost line start with an uppercase letter.
    Standardising the commit message format will help you preserve the readability of the commit history.`,
			])
		})
	})

	describe("a report generated from a valid commit and a commit without an empty line between the subject line and body", () => {
		const report = validate([
			dummyCommit({
				sha: "0ff1ce",
				subjectLine: "Improve some stuff",
				body: "This makes things even better.",
			}),
			dummyCommit({ subjectLine: "Refactor the taxi module" }),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please separate the subject line from the message body with an empty line:
    0ff1ce Improve some stuff

    Reword the commit message to insert an empty line before the message body.
    Standardising the commit message format will help you preserve the readability of the commit history.`,
			])
		})
	})

	describe("a report generated from two commits without an empty line between the subject line and body", () => {
		const report = validate([
			dummyCommit({
				sha: "badf00d",
				subjectLine: "Introduce a cool feature",
				body: "It's awesome.",
			}),
			dummyCommit({
				sha: "d06f00d",
				subjectLine: "Write unit tests",
				body: "This will future-proof the code.",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please separate the subject lines from the message bodies with an empty line:
    badf00d Introduce a cool feature
    d06f00d Write unit tests

    Reword each commit message to insert an empty line before the message body.
    Standardising the commit message format will help you preserve the readability of the commit history.`,
			])
		})
	})

	describe("a report generated from a valid commit and a commit with a non-imperative subject line", () => {
		const report = validate([
			dummyCommit({ sha: "badf00d", subjectLine: "WIP for now" }),
			dummyCommit({ subjectLine: "Use the newest data" }),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please start the subject line with a verb in the imperative mood:
    badf00d WIP for now

    Reword the commit message to make the foremost line start with a verb that reads like an instruction.
    Standardising the commit message format will help you preserve the readability of the commit history.

    For example, instead of 'Added a feature', 'Formatting', 'It works', or 'Always validate',
    prefer 'Add a feature', 'Format the code', 'Make it work', or 'Do the validation every time'.`,
			])
		})
	})

	describe("a report generated from four commits with a non-imperative subject line", () => {
		const report = validate([
			dummyCommit({ sha: "badf00d", subjectLine: "Yet another fix" }),
			dummyCommit({ sha: "d15ea5e", subjectLine: "Formatting again" }),
			dummyCommit({ sha: "c0ffee", subjectLine: "It works now" }),
			dummyCommit({ sha: "d06f00d", subjectLine: "Lunch break" }),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please start the subject lines with a verb in the imperative mood:
    badf00d Yet another fix
    d15ea5e Formatting again
    c0ffee It works now
    d06f00d Lunch break

    Reword each commit message to make the foremost line start with a verb that reads like an instruction.
    Standardising the commit message format will help you preserve the readability of the commit history.

    For example, instead of 'Added a feature', 'Formatting', 'It works', or 'Always validate',
    prefer 'Add a feature', 'Format the code', 'Make it work', or 'Do the validation every time'.`,
			])
		})
	})

	describe("a report generated from a valid commit and a commit with a body line that is too long", () => {
		const report = validate([
			dummyCommit({ subjectLine: "Enforce server-side validation" }),
			dummyCommit({
				sha: "c0ffee",
				subjectLine: "Ship to production",
				body: "\nWe have decided to give the customers an amazing surprise in this version.",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please wrap long lines in the message body:
    c0ffee Ship to production

    Reword the commit message to keep each line in the message body within 72 characters.
    Keeping the body lines short will help you preserve the readability of the commit history in various Git clients.`,
			])
		})
	})

	describe("a report generated from two commits with body lines that are too long", () => {
		const report = validate([
			dummyCommit({
				sha: "d06f00d",
				subjectLine: "Install necessary dependencies",
				body: "\nWe discovered some more dependencies after running this command:\n\n```shell\nyarn install\n```\n\nIt turns out that we do in fact need the following dependencies after all. This commit installs them.\n\n```shell\nyarn add @elements/hydrogen@1.0.0 @elements/nitrogen@2.5.0 @elements/oxygen@2.6.0\n```",
			}),
			dummyCommit({
				sha: "badf00d",
				subjectLine: "Retrieve some exclusive data",
				body: "\nWe have to retrieve some rare data from the third-party service. This commit adds the necessary code to do so.",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please wrap long lines in the message bodies:
    d06f00d Install necessary dependencies
    badf00d Retrieve some exclusive data

    Reword each commit message to keep each line in the message body within 72 characters.
    Keeping the body lines short will help you preserve the readability of the commit history in various Git clients.`,
			])
		})
	})

	describe("a report generated from a valid commit and a commit with a subject line that is too long", () => {
		const report = validate([
			dummyCommit({ subjectLine: "Enforce server-side validation" }),
			dummyCommit({
				sha: "0ff1ce",
				subjectLine: "Ship the evaluation of ultra-rare objects to production",
				body: "\nThat is good.",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please keep the subject line concise:
    0ff1ce Ship the evaluation of ultra-rare objects to production

    Reword the commit message to keep the foremost line within 50 characters.
    Keeping the subject line short will help you preserve the readability of the commit history in various Git clients.`,
			])
		})
	})

	describe("a report generated from two commits with subject lines that are too long", () => {
		const report = validate([
			dummyCommit({
				sha: "d06f00d",
				subjectLine:
					"Install some extremely redundant heavyweight dependencies",
				body: "\nWe had to make the bundle heavier to make it appear more valuable.",
			}),
			dummyCommit({
				sha: "badf00d",
				subjectLine: "Retrieve data from the exclusive third-party service",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please keep the subject lines concise:
    d06f00d Install some extremely redundant heavyweight dependencies
    badf00d Retrieve data from the exclusive third-party service

    Reword each commit message to keep the foremost line within 50 characters.
    Keeping the subject lines short will help you preserve the readability of the commit history in various Git clients.`,
			])
		})
	})

	describe("a report generated from a valid commit and a commit with a single-word subject line", () => {
		const report = validate([
			dummyCommit({ subjectLine: "Adjust the procedure" }),
			dummyCommit({ sha: "c0ffee", subjectLine: "Test" }),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please include at least two words in the subject line:
    c0ffee Test

    Reword the commit message to make the foremost line contain at least two words.
    Providing more context in the commit message will help you preserve the traceability of the commit history.`,
			])
		})
	})

	describe("a report generated from two commits with a single-word subject line", () => {
		const report = validate([
			dummyCommit({ sha: "0ff1ce", subjectLine: "Fix" }),
			dummyCommit({ sha: "c0ffee", subjectLine: "Update" }),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please include at least two words in the subject lines:
    0ff1ce Fix
    c0ffee Update

    Reword each commit message to make the foremost line contain at least two words.
    Providing more context in the commit messages will help you preserve the traceability of the commit history.`,
			])
		})
	})

	describe("a report generated from a valid commit and a commit with a co-author", () => {
		const report = validate([
			dummyCommit({ subjectLine: "Make it right this time" }),
			dummyCommit({
				sha: "d06f00d",
				subjectLine: "Do some pair programming",
				body: "\nCo-authored-by: Santa Claus <santa.claus@example.com>",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please avoid having co-authors in the commit:
    d06f00d Do some pair programming

    Reword the commit message to remove the 'Co-authored-by:' trailers in the message body.
    Removing the co-authors will help you preserve the authenticity of the commit, as co-authors are unable to sign commits.`,
			])
		})
	})

	describe("a report generated from two commits with co-authors", () => {
		const report = validate([
			dummyCommit({
				sha: "cafebabe",
				subjectLine: "Update src/main.ts",
				body: "\nCo-Authored-By: Everloving Easter Bunny <everloving.easter.bunny@example.com>",
			}),
			dummyCommit({
				sha: "cafed00d",
				subjectLine: "Do some mob programming",
				body: "\nThis commit is a collab.\nCo-authored-by: Santa Claus <santa.claus@example.com>\nCo-authored-by: Gingerbread Man <gingerbread.man@example.com>\nReported-by: Little Mermaid <little.mermaid@example.com>",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please avoid having co-authors in the commits:
    cafebabe Update src/main.ts
    cafed00d Do some mob programming

    Reword each commit message to remove the 'Co-authored-by:' trailers in the message body.
    Removing the co-authors will help you preserve the authenticity of the commits, as co-authors are unable to sign commits.`,
			])
		})
	})

	describe("a report generated from a valid commit and a merge commit", () => {
		const report = validate([
			dummyCommit({ subjectLine: "Fix this confusing plate of spaghetti" }),
			dummyCommit({
				sha: "d06f00d",
				subjectLine: "Merge branch 'master' into feature/robot-butler",
				numberOfParents: 2,
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please avoid the merge commit:
    d06f00d Merge branch 'master' into feature/robot-butler

    Undo the merge commit and rebase your branch onto the target branch instead.
    Avoiding merge commits will help you preserve the traceability of the commit history as well as the ability to rebase interactively.`,
			])
		})
	})

	describe("a report generated from two merge commits", () => {
		const report = validate([
			dummyCommit({
				sha: "d06f00d",
				subjectLine: "Keep my branch up to date",
				numberOfParents: 3,
			}),
			dummyCommit({
				sha: "badf00d",
				subjectLine: "Merge branch 'master' into feature/robot-butler",
				numberOfParents: 2,
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please avoid the merge commits:
    d06f00d Keep my branch up to date
    badf00d Merge branch 'master' into feature/robot-butler

    Undo the merge commits and rebase your branch onto the target branch instead.
    Avoiding merge commits will help you preserve the traceability of the commit history as well as the ability to rebase interactively.`,
			])
		})
	})

	describe("a report generated from a valid commit and a revert of a revert commit", () => {
		const report = validate([
			dummyCommit({ subjectLine: 'Revert "Repair the soft ice machine"' }),
			dummyCommit({
				sha: "c0ffee",
				subjectLine: 'Revert "Revert "Repair the soft ice machine""',
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please consolidate the revert of the revert commit:
    c0ffee Revert "Revert "Repair the soft ice machine""

    Undo the revert of the revert commit and re-apply the original commit.
    Avoiding unnecessary commits will help you preserve the traceability of the commit history.`,
			])
		})
	})

	describe("a report generated from two reverts of revert commits", () => {
		const report = validate([
			dummyCommit({
				sha: "d06f00d",
				subjectLine: 'Revert "Revert "Repair the soft ice machine""',
			}),
			dummyCommit({
				sha: "badf00d",
				subjectLine: 'Revert "Revert "Revert "Repair the soft ice machine"""',
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please consolidate the reverts of the revert commits:
    d06f00d Revert "Revert "Repair the soft ice machine""
    badf00d Revert "Revert "Revert "Repair the soft ice machine"""

    Undo the reverts of the revert commits and re-apply the original commits.
    Avoiding unnecessary commits will help you preserve the traceability of the commit history.`,
			])
		})
	})

	describe("a report generated from a valid commit and a squash commit", () => {
		const report = validate([
			dummyCommit({
				sha: "0ff1ce",
				subjectLine: "squash! Make the formatter happy again :)",
			}),
			dummyCommit({ subjectLine: "Release the robot butler" }),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please consolidate the squash commit:
    0ff1ce squash! Make the formatter happy again :)

    Rebase interactively to combine the commit with the original one.
    Avoiding unnecessary commits will help you preserve the traceability of the commit history.`,
			])
		})
	})

	describe("a report generated from three squash commits", () => {
		const report = validate([
			dummyCommit({
				sha: "0ff1ce",
				subjectLine: "fixup! Make the program act like a clown",
			}),
			dummyCommit({
				sha: "d06f00d",
				subjectLine: "amend! Apply strawberry jam to make the code sweeter",
			}),
			dummyCommit({
				sha: "badf00d",
				subjectLine: "squash! Fix a typo",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please consolidate the squash commits:
    0ff1ce fixup! Make the program act like a clown
    d06f00d amend! Apply strawberry jam to make the code sweeter
    badf00d squash! Fix a typo

    Rebase interactively to combine the commits with the original ones.
    Avoiding unnecessary commits will help you preserve the traceability of the commit history.`,
			])
		})
	})

	describe("a report generated from a valid commit and a commit with trailing punctuation in the subject line", () => {
		const report = validate([
			dummyCommit({ subjectLine: "Organise the bookshelf" }),
			dummyCommit({
				sha: "0ff1ce",
				subjectLine: "Make the program act like a clown.",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please avoid trailing punctuation in the subject line:
    0ff1ce Make the program act like a clown.

    Reword the commit message to delete the punctuation characters at the end of the foremost line.
    Standardising the commit message format will help you preserve the readability of the commit history.`,
			])
		})
	})

	describe("a report generated from two commits with trailing punctuation in the subject line", () => {
		const report = validate([
			dummyCommit({
				sha: "cafebabe",
				subjectLine: "Begin the implementation with more to come+",
			}),
			dummyCommit({
				sha: "cafed00d",
				subjectLine: "Wonder if this will work?",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please avoid trailing punctuation in the subject lines:
    cafebabe Begin the implementation with more to come+
    cafed00d Wonder if this will work?

    Reword each commit message to delete the punctuation characters at the end of the foremost line.
    Standardising the commit message format will help you preserve the readability of the commit history.`,
			])
		})
	})

	describe("a report generated from a valid commit and a commit with unexpected whitespace", () => {
		const report = validate([
			dummyCommit({ subjectLine: "Hunt down the bugs" }),
			dummyCommit({ sha: "d06f00d", subjectLine: "Do it right this  time" }),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please avoid unexpected whitespace:
    d06f00d Do it right this  time

    Reword the commit message to remove leading, trailing, and consecutive whitespace characters. Indentation is allowed in the message body.
    Standardising the commit message format will help you preserve the readability of the commit history.`,
			])
		})
	})

	describe("a report generated from three commits with unexpected whitespace", () => {
		const report = validate([
			dummyCommit({ sha: "0ff1ce", subjectLine: " Do it over" }),
			dummyCommit({ sha: "badf00d", subjectLine: "Bring it on  " }),
			dummyCommit({
				sha: "d06f00d",
				subjectLine: "Make it work",
				body: "\nIt'd better  work this time.",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please avoid unexpected whitespace:
    0ff1ce Do it over
    badf00d Bring it on
    d06f00d Make it work

    Reword each commit message to remove leading, trailing, and consecutive whitespace characters. Indentation is allowed in the message body.
    Standardising the commit message format will help you preserve the readability of the commit history.`,
			])
		})
	})

	describe("a report generated from two commits with the same subject line", () => {
		const report = validate([
			dummyCommit({
				sha: "0ff1ce",
				subjectLine: "Make the program act like a clown",
			}),
			dummyCommit({
				sha: "badf00d",
				subjectLine: "Make the program act like a clown",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please consolidate the commit that repeats the subject line of a previous commit:
    badf00d Make the program act like a clown

    Rebase interactively to combine the commit with the previous one.
    Avoiding unnecessary commits will help you preserve the traceability of the commit history.`,
			])
		})
	})

	describe("a report generated from three commits with the same subject line and two other commits with the same subject line", () => {
		const report = validate([
			dummyCommit({
				sha: "0ff1ce",
				subjectLine: "Apply strawberry jam to make the code sweeter",
			}),
			dummyCommit({
				sha: "d06f00d",
				subjectLine: "Have fun",
			}),
			dummyCommit({
				sha: "cafebabe",
				subjectLine: "Have fun",
			}),
			dummyCommit({
				sha: "badf00d",
				subjectLine: "Apply strawberry jam to make the code sweeter",
			}),
			dummyCommit({
				sha: "cafed00d",
				subjectLine: "Have fun",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please consolidate the commits that repeat the subject line of a previous commit:
    cafebabe Have fun
    badf00d Apply strawberry jam to make the code sweeter
    cafed00d Have fun

    Rebase interactively to combine the commits with the previous one.
    Avoiding unnecessary commits will help you preserve the traceability of the commit history.`,
			])
		})
	})

	describe("a report generated from two commits with the same subject line and two squash commits", () => {
		const report = validate([
			dummyCommit({
				sha: "0ff1ce",
				subjectLine: "Improve some stuff",
			}),
			dummyCommit({
				sha: "d06f00d",
				subjectLine: "Improve some stuff",
			}),
			dummyCommit({
				sha: "cafebabe",
				subjectLine: "squash! Improve some stuff",
			}),
			dummyCommit({
				sha: "cafed00d",
				subjectLine: "fixup! Improve some stuff",
			}),
		])

		it("contains a series of instructions on how to resolve the violated rules", () => {
			expect(report).toStrictEqual([
				`Please consolidate the squash commits:
    cafebabe squash! Improve some stuff
    cafed00d fixup! Improve some stuff

    Rebase interactively to combine the commits with the original ones.
    Avoiding unnecessary commits will help you preserve the traceability of the commit history.`,

				`Please consolidate the commit that repeats the subject line of a previous commit:
    d06f00d Improve some stuff

    Rebase interactively to combine the commit with the previous one.
    Avoiding unnecessary commits will help you preserve the traceability of the commit history.`,
			])
		})
	})

	describe("a report generated from three valid commits, two squash commits, and a merge commit", () => {
		const report = validate([
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
		])

		it("contains a series of instructions on how to resolve the violated rules", () => {
			expect(report).toStrictEqual([
				`Please avoid the merge commit:
    d06f00d Keep my branch up to date

    Undo the merge commit and rebase your branch onto the target branch instead.
    Avoiding merge commits will help you preserve the traceability of the commit history as well as the ability to rebase interactively.`,

				`Please consolidate the squash commits:
    cafed00d fixup! Resolve a bug that thought it was a feature
    0ff1ce amend! Add some extra love to the code

    Rebase interactively to combine the commits with the original ones.
    Avoiding unnecessary commits will help you preserve the traceability of the commit history.`,
			])
		})
	})

	describe("a report generated from a squash commit with a decapitalised, single-word, non-imperative subject line", () => {
		const report = validate([
			dummyCommit({ sha: "d15ea5e", subjectLine: "squash! formatting" }),
		])

		it("contains a series of instructions on how to resolve the violated rules", () => {
			expect(report).toStrictEqual([
				`Please capitalise the subject line:
    d15ea5e squash! formatting

    Reword the commit message to make the foremost line start with an uppercase letter.
    Standardising the commit message format will help you preserve the readability of the commit history.`,

				`Please start the subject line with a verb in the imperative mood:
    d15ea5e squash! formatting

    Reword the commit message to make the foremost line start with a verb that reads like an instruction.
    Standardising the commit message format will help you preserve the readability of the commit history.

    For example, instead of 'Added a feature', 'Formatting', 'It works', or 'Always validate',
    prefer 'Add a feature', 'Format the code', 'Make it work', or 'Do the validation every time'.`,

				`Please include at least two words in the subject line:
    d15ea5e squash! formatting

    Reword the commit message to make the foremost line contain at least two words.
    Providing more context in the commit message will help you preserve the traceability of the commit history.`,

				`Please consolidate the squash commit:
    d15ea5e squash! formatting

    Rebase interactively to combine the commit with the original one.
    Avoiding unnecessary commits will help you preserve the traceability of the commit history.`,
			])
		})
	})
})

describe("when the configuration overrides 'acknowledged-author-email-addresses--patterns' and 'acknowledged-committer-email-addresses--patterns' with GitHub-noreply or fictive company email addresses and 'acknowledged-author-names--patterns' and 'acknowledged-committer-names--patterns' with a two-word or three-letter requirement", () => {
	const validate = validateInstructionsFrom(
		dummyNoreplyGithubOrFictiveCompanyEmailAddressesAndTwoWordOrThreeLetterNamesConfiguration,
	)

	describe("a report generated from a valid commit and a commit with a bad author email address", () => {
		const report = validate([
			dummyCommit({
				author: {
					name: "Santa Claus",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				committer: {
					name: "Santa Claus",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				subjectLine: "Make the program act like a clown",
			}),
			dummyCommit({
				sha: "0ff1ce",
				author: {
					name: "Santa Claus",
					emailAddress: "claus@santasworkshop.com",
				},
				committer: {
					name: "Santa Claus",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				subjectLine: "Apply strawberry jam to make the code sweeter",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please use an acknowledged author email address:
    0ff1ce Apply strawberry jam to make the code sweeter

    Edit the commit to change the email address of its author.
    Standardising the author format will help you preserve the traceability of the commit history and avoid leaking personal information inadvertently.

    Valid author email address patterns:
    \\d+\\+.+@users\\.noreply\\.github\\.com
    .+@fictivecompany\\.com`,
			])
		})
	})

	describe("a report generated from two commits with bad author email addresses", () => {
		const report = validate([
			dummyCommit({
				sha: "600d1dea",
				author: {
					name: "Easter Bunny",
					emailAddress: "bunny@theeastercompany.com",
				},
				committer: {
					name: "Easter Bunny",
					emailAddress: "45678901+easterbunny@users.noreply.github.com",
				},
				subjectLine: "Hunt down the bugs",
			}),
			dummyCommit({
				sha: "bad1dea",
				author: {
					name: "Santa Claus",
					emailAddress: "claus@santasworkshop.com",
				},
				committer: {
					name: "Santa Claus",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				subjectLine: "Refactor the taxi module",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please use acknowledged author email addresses:
    600d1dea Hunt down the bugs
    bad1dea Refactor the taxi module

    Edit each commit to change the email address of its author.
    Standardising the author format will help you preserve the traceability of the commit history and avoid leaking personal information inadvertently.

    Valid author email address patterns:
    \\d+\\+.+@users\\.noreply\\.github\\.com
    .+@fictivecompany\\.com`,
			])
		})
	})

	describe("a report generated from a valid commit and a commit with a bad author name", () => {
		const report = validate([
			dummyCommit({
				author: {
					name: "Santa Claus",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				committer: {
					name: "Santa Claus",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				subjectLine: "Make the program act like a clown",
			}),
			dummyCommit({
				sha: "0ff1ce",
				author: {
					name: "Santa",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				committer: {
					name: "Santa Claus",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				subjectLine: "Apply strawberry jam to make the code sweeter",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please use an acknowledged author name:
    0ff1ce Apply strawberry jam to make the code sweeter

    Edit the commit to change the name of its author.
    Standardising the author format will help you preserve the traceability of the commit history and avoid leaking personal information inadvertently.

    Valid author name patterns:
    .+\\s.+
    \\w{3}`,
			])
		})
	})

	describe("a report generated from two commits with bad author names", () => {
		const report = validate([
			dummyCommit({
				sha: "600d1dea",
				author: {
					name: "Easter-Bunny",
					emailAddress: "45678901+easterbunny@users.noreply.github.com",
				},
				committer: {
					name: "Easter Bunny",
					emailAddress: "45678901+easterbunny@users.noreply.github.com",
				},
				subjectLine: "Hunt down the bugs",
			}),
			dummyCommit({
				sha: "bad1dea",
				author: {
					name: "Santa-Claus",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				committer: {
					name: "Santa Claus",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				subjectLine: "Refactor the taxi module",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please use acknowledged author names:
    600d1dea Hunt down the bugs
    bad1dea Refactor the taxi module

    Edit each commit to change the name of its author.
    Standardising the author format will help you preserve the traceability of the commit history and avoid leaking personal information inadvertently.

    Valid author name patterns:
    .+\\s.+
    \\w{3}`,
			])
		})
	})

	describe("a report generated from a valid commit and a commit with a bad committer email address", () => {
		const report = validate([
			dummyCommit({
				author: {
					name: "Santa Claus",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				committer: {
					name: "Santa Claus",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				subjectLine: "Fix this confusing plate of spaghetti",
			}),
			dummyCommit({
				sha: "badc0de",
				author: {
					name: "Santa Claus",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				committer: {
					name: "Santa Claus",
					emailAddress: "claus@santasworkshop.com",
				},
				subjectLine: "Release the robot butler",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please use an acknowledged committer email address:
    badc0de Release the robot butler

    Edit the commit to change the email address of its committer.
    Standardising the committer format will help you preserve the traceability of the commit history and avoid leaking personal information inadvertently.

    Valid committer email address patterns:
    \\d+\\+.+@users\\.noreply\\.github\\.com
    .+@fictivecompany\\.com`,
			])
		})
	})

	describe("a report generated from two commits with bad committer email addresses", () => {
		const report = validate([
			dummyCommit({
				sha: "600d1dea",
				author: {
					name: "Easter Bunny",
					emailAddress: "45678901+easterbunny@users.noreply.github.com",
				},
				committer: {
					name: "Easter Bunny",
					emailAddress: "bunny@theeastercompany.com",
				},
				subjectLine: "Hunt down the bugs",
			}),
			dummyCommit({
				sha: "bad1dea",
				author: {
					name: "Santa Claus",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				committer: {
					name: "Santa Claus",
					emailAddress: "claus@santasworkshop.com",
				},
				subjectLine: "Refactor the taxi module",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please use acknowledged committer email addresses:
    600d1dea Hunt down the bugs
    bad1dea Refactor the taxi module

    Edit each commit to change the email address of its committer.
    Standardising the committer format will help you preserve the traceability of the commit history and avoid leaking personal information inadvertently.

    Valid committer email address patterns:
    \\d+\\+.+@users\\.noreply\\.github\\.com
    .+@fictivecompany\\.com`,
			])
		})
	})

	describe("a report generated from a valid commit and a commit with a bad committer name", () => {
		const report = validate([
			dummyCommit({
				author: {
					name: "Santa Claus",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				committer: {
					name: "Santa Claus",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				subjectLine: "Fix this confusing plate of spaghetti",
			}),
			dummyCommit({
				sha: "badc0de",
				author: {
					name: "Santa Claus",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				committer: {
					name: "Santa",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				subjectLine: "Release the robot butler",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please use an acknowledged committer name:
    badc0de Release the robot butler

    Edit the commit to change the name of its committer.
    Standardising the committer format will help you preserve the traceability of the commit history and avoid leaking personal information inadvertently.

    Valid committer name patterns:
    .+\\s.+
    \\w{3}`,
			])
		})
	})

	describe("a report generated from two commits with bad committer names", () => {
		const report = validate([
			dummyCommit({
				sha: "600d1dea",
				author: {
					name: "Easter Bunny",
					emailAddress: "45678901+easterbunny@users.noreply.github.com",
				},
				committer: {
					name: "Easter-Bunny",
					emailAddress: "45678901+easterbunny@users.noreply.github.com",
				},
				subjectLine: "Hunt down the bugs",
			}),
			dummyCommit({
				sha: "bad1dea",
				author: {
					name: "Santa Claus",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				committer: {
					name: "Santa-Claus",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				subjectLine: "Refactor the taxi module",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please use acknowledged committer names:
    600d1dea Hunt down the bugs
    bad1dea Refactor the taxi module

    Edit each commit to change the name of its committer.
    Standardising the committer format will help you preserve the traceability of the commit history and avoid leaking personal information inadvertently.

    Valid committer name patterns:
    .+\\s.+
    \\w{3}`,
			])
		})
	})
})

describe("when the configuration overrides 'acknowledged-author-email-addresses--patterns' and 'acknowledged-committer-email-addresses--patterns' with legendary company email addresses and 'acknowledged-author-names--patterns' and 'acknowledged-committer-names--patterns' with a four-letter requirement", () => {
	const validate = validateInstructionsFrom(
		dummyLegendaryCompanyEmailAddressesAndFourLetterNamesConfiguration,
	)

	describe("a report generated from two commits with bad author email addresses and names and bad committer email addresses and names", () => {
		const report = validate([
			dummyCommit({
				sha: "600d1dea",
				author: {
					name: "Easter Bunny",
					emailAddress: "45678901+easterbunny@users.noreply.github.com",
				},
				committer: {
					name: "GitHub",
					emailAddress: "noreply@github.com",
				},
				subjectLine: "Subscribe to the service",
			}),
			dummyCommit({
				sha: "bad1dea",
				author: {
					name: "Santa Claus",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				committer: {
					name: "Santa Claus",
					emailAddress: "12345678+santaclaus@users.noreply.github.com",
				},
				subjectLine: "Update the dependencies",
			}),
		])

		it("contains a series of instructions on how to resolve the violated rules", () => {
			expect(report).toStrictEqual([
				`Please use acknowledged author email addresses:
    600d1dea Subscribe to the service
    bad1dea Update the dependencies

    Edit each commit to change the email address of its author.
    Standardising the author format will help you preserve the traceability of the commit history and avoid leaking personal information inadvertently.

    Valid author email address patterns:
    .+@thelegendary\\.com`,

				`Please use acknowledged author names:
    600d1dea Subscribe to the service
    bad1dea Update the dependencies

    Edit each commit to change the name of its author.
    Standardising the author format will help you preserve the traceability of the commit history and avoid leaking personal information inadvertently.

    Valid author name patterns:
    \\w{4}`,

				`Please use acknowledged committer email addresses:
    600d1dea Subscribe to the service
    bad1dea Update the dependencies

    Edit each commit to change the email address of its committer.
    Standardising the committer format will help you preserve the traceability of the commit history and avoid leaking personal information inadvertently.

    Valid committer email address patterns:
    .+@thelegendary\\.com`,

				`Please use acknowledged committer names:
    600d1dea Subscribe to the service
    bad1dea Update the dependencies

    Edit each commit to change the name of its committer.
    Standardising the committer format will help you preserve the traceability of the commit history and avoid leaking personal information inadvertently.

    Valid committer name patterns:
    \\w{4}`,
			])
		})
	})
})

describe("when the configuration overrides 'issue-references-in-subject-lines--patterns' with GitHub-style issue references as prefix", () => {
	const validate = validateInstructionsFrom(
		dummyGithubStyleIssueReferencesAsPrefixConfiguration,
	)

	describe("a report generated from a valid commit and a commit without an issue reference", () => {
		const report = validate([
			dummyCommit({ subjectLine: "#1 Make the program act like a clown" }),
			dummyCommit({
				sha: "d06f00d",
				subjectLine: "Apply strawberry jam to make the code sweeter",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please include an issue reference at the start of the subject line:
    d06f00d Apply strawberry jam to make the code sweeter

    Reword the commit message to make the foremost line start with a reference to an issue tracking system.
    Providing more context in the commit message will help you preserve the traceability of the commit history.

    Valid issue reference patterns:
    \\(#[1-9][0-9]*\\)
    #[1-9][0-9]*:
    #[1-9][0-9]*`,
			])
		})
	})

	describe("a report generated from two commits without an issue reference", () => {
		const report = validate([
			dummyCommit({ sha: "cafebabe", subjectLine: "Update some dependencies" }),
			dummyCommit({
				sha: "cafed00d",
				subjectLine: "Resolve a bug that thought it was a feature",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please include an issue reference at the start of the subject lines:
    cafebabe Update some dependencies
    cafed00d Resolve a bug that thought it was a feature

    Reword each commit message to make the foremost line start with a reference to an issue tracking system.
    Providing more context in the commit messages will help you preserve the traceability of the commit history.

    Valid issue reference patterns:
    \\(#[1-9][0-9]*\\)
    #[1-9][0-9]*:
    #[1-9][0-9]*`,
			])
		})
	})
})

describe("when the configuration overrides 'issue-references-in-subject-lines--patterns' with Jira-style issue references", () => {
	const validate = validateInstructionsFrom(
		dummyJiraStyleIssueReferencesConfiguration,
	)

	describe("a report generated from a valid commit and a commit without an issue reference", () => {
		const report = validate([
			dummyCommit({
				subjectLine: "UNICORN-1 Make the program act like a clown",
			}),
			dummyCommit({
				sha: "d06f00d",
				subjectLine: "Apply strawberry jam to make the code sweeter",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please include an issue reference at the start or the end of the subject line:
    d06f00d Apply strawberry jam to make the code sweeter

    Reword the commit message to make the foremost line start or end with a reference to an issue tracking system.
    Providing more context in the commit message will help you preserve the traceability of the commit history.

    Valid issue reference patterns:
    \\(UNICORN-[1-9][0-9]*\\)
    UNICORN-[1-9][0-9]*`,
			])
		})
	})

	describe("a report generated from two commits without an issue reference", () => {
		const report = validate([
			dummyCommit({ sha: "cafebabe", subjectLine: "Update some dependencies" }),
			dummyCommit({
				sha: "cafed00d",
				subjectLine: "Resolve a bug that thought it was a feature",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please include an issue reference at the start or the end of the subject lines:
    cafebabe Update some dependencies
    cafed00d Resolve a bug that thought it was a feature

    Reword each commit message to make the foremost line start or end with a reference to an issue tracking system.
    Providing more context in the commit messages will help you preserve the traceability of the commit history.

    Valid issue reference patterns:
    \\(UNICORN-[1-9][0-9]*\\)
    UNICORN-[1-9][0-9]*`,
			])
		})
	})
})

describe("when the configuration overrides 'limit-length-of-body-lines--max-characters' with 32 and 'limit-length-of-subject-lines--max-characters' with 1", () => {
	const validate = validateInstructionsFrom({
		...dummyDefaultConfiguration,
		limitLengthOfBodyLines: {
			maximumCharacters: 32,
		},
		limitLengthOfSubjectLines: {
			maximumCharacters: 1,
		},
	})

	describe("a report generated from two commits with subject lines that are too long and with a body line in one of the commits that is too long", () => {
		const report = validate([
			dummyCommit({
				sha: "0ff1ce",
				subjectLine: "Investigate further",
				body: "\nWe discovered something cool after running a magical command.",
			}),
			dummyCommit({ sha: "c0ffee", subjectLine: "Help fix the bug", body: "" }),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please wrap long lines in the message body:
    0ff1ce Investigate further

    Reword the commit message to keep each line in the message body within 32 characters.
    Keeping the body lines short will help you preserve the readability of the commit history in various Git clients.`,

				`Please keep the subject lines concise:
    0ff1ce Investigate further
    c0ffee Help fix the bug

    Reword each commit message to keep the foremost line within 1 character.
    Keeping the subject lines short will help you preserve the readability of the commit history in various Git clients.`,
			])
		})
	})
})

describe("when the configuration overrides 'limit-length-of-body-lines--max-characters' with 1", () => {
	const validate = validateInstructionsFrom({
		...dummyDefaultConfiguration,
		limitLengthOfBodyLines: {
			maximumCharacters: 1,
		},
	})

	describe("a report generated from a commit with a body line that is too long", () => {
		const report = validate([
			dummyCommit({
				sha: "0ff1ce",
				subjectLine: "Investigate further",
				body: "\nWe discovered something cool after running a magical command.",
			}),
		])

		it("contains instructions on how to resolve the violated rule", () => {
			expect(report).toStrictEqual([
				`Please wrap long lines in the message body:
    0ff1ce Investigate further

    Reword the commit message to keep each line in the message body within 1 character.
    Keeping the body lines short will help you preserve the readability of the commit history in various Git clients.`,
			])
		})
	})
})

function validateInstructionsFrom(
	configuration: Configuration,
): (commits: ReadonlyArray<RawCommit>) => ReadonlyArray<string> {
	return (commits): ReadonlyArray<string> =>
		validatorFrom(configuration)(commits, instructiveReporter(configuration))
}
