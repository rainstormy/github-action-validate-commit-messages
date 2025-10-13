import { describe, expect, it } from "vitest"
import { legacyV1ParseCommit } from "#legacy-v1/rules/LegacyV1Commit.ts"
import { legacyV1CommitRefinerFrom } from "#legacy-v1/rules/LegacyV1CommitRefiner.ts"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule.ts"
import { count } from "#legacy-v1/utilities/StringUtilities.ts"
import {
	legacyV1DummyDefaultConfiguration,
	legacyV1DummyGithubStyleIssueReferencesAsPrefixConfiguration,
	legacyV1DummyGithubStyleIssueReferencesAsSuffixConfiguration,
	legacyV1DummyJiraStyleIssueReferencesConfiguration,
} from "#legacy-v1/validator/LegacyV1Configuration.dummies.ts"
import { legacyV1RulesFrom } from "#legacy-v1/validator/LegacyV1Validator.ts"

describe("when the configuration has default settings", () => {
	const rules: ReadonlyArray<LegacyV1Rule> = legacyV1RulesFrom(
		legacyV1DummyDefaultConfiguration,
	)
	const refineCommit = legacyV1CommitRefinerFrom(rules)

	describe.each`
		sha          | subjectLine                                               | body                                                                                                                                                                                                              | parentShas                            | authorName           | authorEmailAddress                                    | committerName       | committerEmailAddress                               | squashPrefixes          | refinedSubjectLine                                        | bodyLines                                                                                       | coAuthors
		${"0ff1ce"}  | ${"Release the robot butler"}                             | ${"\n\nThis is a dummy commit message body."}                                                                                                                                                                     | ${["c0ffee"]}                         | ${"Santa Claus"}     | ${"12345678+santaclaus@users.noreply.github.com"}     | ${"Easter Bunny"}   | ${"98765432+easterbunny@user.noreply.github.com"}   | ${[]}                   | ${"Release the robot butler"}                             | ${["", "This is a dummy commit message body."]}                                                 | ${[]}
		${"d06f00d"} | ${"Fix this confusing plate of spaghetti"}                | ${""}                                                                                                                                                                                                             | ${["deadc0de"]}                       | ${"Gingerbread Man"} | ${"23456789+gingerbreadman@users.noreply.github.com"} | ${"Little Mermaid"} | ${"87654321+littlemermaid@user.noreply.github.com"} | ${[]}                   | ${"Fix this confusing plate of spaghetti"}                | ${[]}                                                                                           | ${[]}
		${"0ff1ce"}  | ${"fixup!"}                                               | ${""}                                                                                                                                                                                                             | ${["c0ffee"]}                         | ${null}              | ${"12345678+santaclaus@users.noreply.github.com"}     | ${"GitHub"}         | ${"noreply@github.com"}                             | ${["fixup!"]}           | ${""}                                                     | ${[]}                                                                                           | ${[]}
		${"0ff1ce"}  | ${"fixup! Resolve a bug that thought it was a feature"}   | ${""}                                                                                                                                                                                                             | ${["c0ffee"]}                         | ${"Santa Claus"}     | ${null}                                               | ${"Easter Bunny"}   | ${"98765432+easterbunny@user.noreply.github.com"}   | ${["fixup!"]}           | ${"Resolve a bug that thought it was a feature"}          | ${[]}                                                                                           | ${[]}
		${"0ff1ce"}  | ${"fixup!  Add some extra love to the code"}              | ${""}                                                                                                                                                                                                             | ${["c0ffee"]}                         | ${null}              | ${null}                                               | ${"Easter Bunny"}   | ${"98765432+easterbunny@user.noreply.github.com"}   | ${["fixup!"]}           | ${"Add some extra love to the code"}                      | ${[]}                                                                                           | ${[]}
		${"0ff1ce"}  | ${"fixup! fixup! Fix this confusing plate of spaghetti"}  | ${""}                                                                                                                                                                                                             | ${["c0ffee"]}                         | ${"Santa Claus"}     | ${"12345678+santaclaus@users.noreply.github.com"}     | ${null}             | ${"98765432+easterbunny@user.noreply.github.com"}   | ${["fixup!", "fixup!"]} | ${"Fix this confusing plate of spaghetti"}                | ${[]}                                                                                           | ${[]}
		${"0ff1ce"}  | ${" amend!Apply strawberry jam to make the code sweeter"} | ${"\n\nThis is a dummy commit message body."}                                                                                                                                                                     | ${["c0ffee"]}                         | ${"Santa Claus"}     | ${"12345678+santaclaus@users.noreply.github.com"}     | ${"Easter Bunny"}   | ${null}                                             | ${["amend!"]}           | ${"Apply strawberry jam to make the code sweeter"}        | ${["", "This is a dummy commit message body."]}                                                 | ${[]}
		${"0ff1ce"}  | ${"amend! Solve the problem"}                             | ${""}                                                                                                                                                                                                             | ${["c0ffee"]}                         | ${"Santa Claus"}     | ${"12345678+santaclaus@users.noreply.github.com"}     | ${null}             | ${null}                                             | ${["amend!"]}           | ${"Solve the problem"}                                    | ${[]}                                                                                           | ${[]}
		${"0ff1ce"}  | ${"squash!Make the formatter happy again :)"}             | ${""}                                                                                                                                                                                                             | ${["c0ffee"]}                         | ${"Santa Claus"}     | ${"12345678+santaclaus@users.noreply.github.com"}     | ${"Easter Bunny"}   | ${"98765432+easterbunny@user.noreply.github.com"}   | ${["squash!"]}          | ${"Make the formatter happy again :)"}                    | ${[]}                                                                                           | ${[]}
		${"0ff1ce"}  | ${"squash!   Organise the bookshelf"}                     | ${"\n\nThis is a dummy commit message body."}                                                                                                                                                                     | ${["c0ffee"]}                         | ${"Santa Claus"}     | ${"12345678+santaclaus@users.noreply.github.com"}     | ${"Easter Bunny"}   | ${"98765432+easterbunny@user.noreply.github.com"}   | ${["squash!"]}          | ${"Organise the bookshelf"}                               | ${["", "This is a dummy commit message body."]}                                                 | ${[]}
		${"0ff1ce"}  | ${"Make the commit scream fixup! again"}                  | ${""}                                                                                                                                                                                                             | ${["c0ffee"]}                         | ${"Santa Claus"}     | ${"12345678+santaclaus@users.noreply.github.com"}     | ${"Easter Bunny"}   | ${"98765432+easterbunny@user.noreply.github.com"}   | ${[]}                   | ${"Make the commit scream fixup! again"}                  | ${[]}                                                                                           | ${[]}
		${"0ff1ce"}  | ${"Update src/main.ts"}                                   | ${"\n\nCo-Authored-By: Easter Bunny <easter.bunny@example.com>"}                                                                                                                                                  | ${["c0ffee"]}                         | ${"Santa Claus"}     | ${"12345678+santaclaus@users.noreply.github.com"}     | ${"Easter Bunny"}   | ${"98765432+easterbunny@user.noreply.github.com"}   | ${[]}                   | ${"Update src/main.ts"}                                   | ${[""]}                                                                                         | ${["Easter Bunny <easter.bunny@example.com>"]}
		${"0ff1ce"}  | ${"Do some pair programming"}                             | ${"\n\nThis commit is a collab.\nCo-authored-by: Santa Claus <santa.claus@example.com>\nCo-authored-by: Gingerbread Man <gingerbread.man@example.com>\nReported-by: Little Mermaid <little.mermaid@example.com>"} | ${["c0ffee"]}                         | ${"Santa Claus"}     | ${"12345678+santaclaus@users.noreply.github.com"}     | ${"Easter Bunny"}   | ${"98765432+easterbunny@user.noreply.github.com"}   | ${[]}                   | ${"Do some pair programming"}                             | ${["", "This commit is a collab.", "Reported-by: Little Mermaid <little.mermaid@example.com>"]} | ${["Santa Claus <santa.claus@example.com>", "Gingerbread Man <gingerbread.man@example.com>"]}
		${"0ff1ce"}  | ${"Keep my branch up to date"}                            | ${""}                                                                                                                                                                                                             | ${["badf00d", "deadc0de", "d15ea5e"]} | ${"Santa Claus"}     | ${"12345678+santaclaus@users.noreply.github.com"}     | ${"Easter Bunny"}   | ${"98765432+easterbunny@user.noreply.github.com"}   | ${[]}                   | ${"Keep my branch up to date"}                            | ${[]}                                                                                           | ${[]}
		${"0ff1ce"}  | ${"Merge branch 'main' into bugfix/dance-party-playlist"} | ${"\n\nConflicts:\n\n src/grumpy-cat.ts\n src/summer-vacation-plans.ts"}                                                                                                                                          | ${["cafebabe", "cafed00d"]}           | ${"Santa Claus"}     | ${"12345678+santaclaus@users.noreply.github.com"}     | ${"Easter Bunny"}   | ${"98765432+easterbunny@user.noreply.github.com"}   | ${[]}                   | ${"Merge branch 'main' into bugfix/dance-party-playlist"} | ${["", "Conflicts:", "", " src/grumpy-cat.ts", " src/summer-vacation-plans.ts"]}                | ${[]}
	`(
		"a commit with a subject line of $subjectLine that is a child of $parentShas",
		(testRow: {
			readonly sha: string
			readonly subjectLine: string
			readonly body: string
			readonly parentShas: ReadonlyArray<string>
			readonly authorName: string | null
			readonly authorEmailAddress: string | null
			readonly committerName: string | null
			readonly committerEmailAddress: string | null
			readonly squashPrefixes: ReadonlyArray<string>
			readonly refinedSubjectLine: string
			readonly bodyLines: ReadonlyArray<string>
			readonly coAuthors: ReadonlyArray<string>
		}) => {
			const {
				sha,
				subjectLine,
				body,
				parentShas,
				authorName,
				authorEmailAddress,
				committerName,
				committerEmailAddress,
				squashPrefixes,
				refinedSubjectLine,
				bodyLines,
				coAuthors,
			} = testRow

			const commit = refineCommit(
				legacyV1ParseCommit({
					sha,
					author: {
						name: authorName,
						emailAddress: authorEmailAddress,
					},
					committer: {
						name: committerName,
						emailAddress: committerEmailAddress,
					},
					commitMessage: `${subjectLine}${body}`,
					parents: parentShas.map((parentSha) => ({ sha: parentSha })),
				}),
			)

			it(`has a SHA of '${sha}'`, () => {
				expect(commit.sha).toStrictEqual(sha)
			})

			it(`has an original subject line of '${subjectLine}'`, () => {
				expect(commit.originalSubjectLine).toStrictEqual(subjectLine)
			})

			it(`has a refined subject line of '${refinedSubjectLine}'`, () => {
				expect(commit.refinedSubjectLine).toStrictEqual(refinedSubjectLine)
			})

			it(`has ${formatSquashPrefixes(squashPrefixes)}`, () => {
				expect(commit.squashPrefixes).toStrictEqual(squashPrefixes)
			})

			it("has no issue references", () => {
				expect(commit.issueReferences).toHaveLength(0)
			})

			it(`has ${formatParents(parentShas)}`, () => {
				const parents = parentShas.map((parentSha) => ({ sha: parentSha }))
				expect(commit.parents).toStrictEqual(parents)
			})

			it(`has ${formatAuthorName(authorName)}`, () => {
				expect(commit.author.name).toStrictEqual(authorName)
			})

			it(`has ${formatAuthorEmailAddress(authorEmailAddress)}`, () => {
				expect(commit.author.emailAddress).toStrictEqual(authorEmailAddress)
			})

			it(`has ${formatCommitterName(committerName)}`, () => {
				expect(commit.committer.name).toStrictEqual(committerName)
			})

			it(`has ${formatCommitterEmailAddress(committerEmailAddress)}`, () => {
				expect(commit.committer.emailAddress).toStrictEqual(
					committerEmailAddress,
				)
			})

			it(`has ${formatBodyLines(bodyLines)}`, () => {
				expect(commit.bodyLines).toStrictEqual(bodyLines)
			})

			it(`has ${formatCoAuthors(coAuthors)}`, () => {
				expect(commit.coAuthors).toStrictEqual(coAuthors)
			})
		},
	)
})

describe("when the configuration overrides 'no-squash-commits--disallowed-prefixes' with 'wip!' and 'amend!'", () => {
	const rules: ReadonlyArray<LegacyV1Rule> = legacyV1RulesFrom({
		...legacyV1DummyDefaultConfiguration,
		noSquashCommits: {
			disallowedPrefixes: ["wip!", "amend!"],
		},
	})
	const refineCommit = legacyV1CommitRefinerFrom(rules)

	describe.each`
		subjectLine                                       | body                                          | squashPrefixes | refinedSubjectLine
		${"wip!"}                                         | ${""}                                         | ${["wip!"]}    | ${""}
		${"wip! Release the robot butler"}                | ${"\n\nThis is a dummy commit message body."} | ${["wip!"]}    | ${"Release the robot butler"}
		${"amend! Fix this confusing plate of spaghetti"} | ${""}                                         | ${["amend!"]}  | ${"Fix this confusing plate of spaghetti"}
		${"fixup! Sneak in a funny easter egg"}           | ${""}                                         | ${[]}          | ${"fixup! Sneak in a funny easter egg"}
		${"squash! Add some extra love to the code"}      | ${""}                                         | ${[]}          | ${"squash! Add some extra love to the code"}
	`(
		"a commit with a subject line of $subjectLine",
		(testRow: {
			readonly subjectLine: string
			readonly body: string
			readonly squashPrefixes: ReadonlyArray<string>
			readonly refinedSubjectLine: string
		}) => {
			const { subjectLine, body, squashPrefixes, refinedSubjectLine } = testRow

			const commit = refineCommit(
				legacyV1ParseCommit({
					sha: "0ff1ce",
					author: {
						name: "Santa Claus",
						emailAddress: "12345678+santaclaus@users.noreply.github.com",
					},
					committer: {
						name: "Santa Claus",
						emailAddress: "12345678+santaclaus@users.noreply.github.com",
					},
					commitMessage: `${subjectLine}${body}`,
					parents: [{ sha: "deadc0de" }],
				}),
			)

			it(`has an original subject line of '${subjectLine}'`, () => {
				expect(commit.originalSubjectLine).toStrictEqual(subjectLine)
			})

			it(`has a refined subject line of '${refinedSubjectLine}'`, () => {
				expect(commit.refinedSubjectLine).toStrictEqual(refinedSubjectLine)
			})

			it(`has ${formatSquashPrefixes(squashPrefixes)}`, () => {
				expect(commit.squashPrefixes).toStrictEqual(squashPrefixes)
			})
		},
	)
})

describe("when the configuration overrides 'issue-references-in-subject-lines--patterns' with GitHub-style issue references as prefix", () => {
	const rules: ReadonlyArray<LegacyV1Rule> = legacyV1RulesFrom(
		legacyV1DummyGithubStyleIssueReferencesAsPrefixConfiguration,
	)
	const refineCommit = legacyV1CommitRefinerFrom(rules)

	describe.each`
		subjectLine                                                        | body                                          | squashPrefixes | issueReferences             | refinedSubjectLine
		${"#1"}                                                            | ${""}                                         | ${[]}          | ${["#1"]}                   | ${""}
		${"#2 Release the robot butler"}                                   | ${"\n\nThis is a dummy commit message body."} | ${[]}          | ${["#2"]}                   | ${"Release the robot butler"}
		${"(#12) Fix this confusing plate of spaghetti"}                   | ${""}                                         | ${[]}          | ${["(#12)"]}                | ${"Fix this confusing plate of spaghetti"}
		${"amend!#59: Sneak in a funny easter egg"}                        | ${""}                                         | ${["amend!"]}  | ${["#59:"]}                 | ${"Sneak in a funny easter egg"}
		${" #8 #9 Solve the problem"}                                      | ${""}                                         | ${[]}          | ${["#8", "#9"]}             | ${"Solve the problem"}
		${"(#15) #30 #45: make the program act like a clown #60"}          | ${"\n\nThis is a dummy commit message body."} | ${[]}          | ${["(#15)", "#30", "#45:"]} | ${"make the program act like a clown #60"}
		${"Add some extra love to the code #7"}                            | ${""}                                         | ${[]}          | ${[]}                       | ${"Add some extra love to the code #7"}
		${"squash! Apply strawberry jam to make the code sweeter (#7044)"} | ${"\n\nThis is a dummy commit message body."} | ${["squash!"]} | ${[]}                       | ${"Apply strawberry jam to make the code sweeter (#7044)"}
		${"Make the user interface less chaotic (#11) #17 "}               | ${""}                                         | ${[]}          | ${[]}                       | ${"Make the user interface less chaotic (#11) #17"}
		${"squash! #12 Throw a tantrum #34 #56 #78 #90"}                   | ${"\n\nThis is a dummy commit message body."} | ${["squash!"]} | ${["#12"]}                  | ${"Throw a tantrum #34 #56 #78 #90"}
		${"fixup! Close #1337 by fixing the bug"}                          | ${""}                                         | ${["fixup!"]}  | ${[]}                       | ${"Close #1337 by fixing the bug"}
	`(
		"a commit with a subject line of $subjectLine",
		(testRow: {
			readonly subjectLine: string
			readonly body: string
			readonly squashPrefixes: ReadonlyArray<string>
			readonly issueReferences: ReadonlyArray<string>
			readonly refinedSubjectLine: string
		}) => {
			const {
				subjectLine,
				body,
				squashPrefixes,
				issueReferences,
				refinedSubjectLine,
			} = testRow

			const commit = refineCommit(
				legacyV1ParseCommit({
					sha: "0ff1ce",
					author: {
						name: "Santa Claus",
						emailAddress: "12345678+santaclaus@users.noreply.github.com",
					},
					committer: {
						name: "Santa Claus",
						emailAddress: "12345678+santaclaus@users.noreply.github.com",
					},
					commitMessage: `${subjectLine}${body}`,
					parents: [{ sha: "deadc0de" }],
				}),
			)

			it(`has an original subject line of '${subjectLine}'`, () => {
				expect(commit.originalSubjectLine).toStrictEqual(subjectLine)
			})

			it(`has a refined subject line of '${refinedSubjectLine}'`, () => {
				expect(commit.refinedSubjectLine).toStrictEqual(refinedSubjectLine)
			})

			it(`has ${formatSquashPrefixes(squashPrefixes)}`, () => {
				expect(commit.squashPrefixes).toStrictEqual(squashPrefixes)
			})

			it(`has ${formatIssueReferences(issueReferences)}`, () => {
				expect(commit.issueReferences).toStrictEqual(issueReferences)
			})
		},
	)
})

describe("when the configuration overrides 'issue-references-in-subject-lines--patterns' with GitHub-style issue references as suffix", () => {
	const rules: ReadonlyArray<LegacyV1Rule> = legacyV1RulesFrom(
		legacyV1DummyGithubStyleIssueReferencesAsSuffixConfiguration,
	)
	const refineCommit = legacyV1CommitRefinerFrom(rules)

	describe.each`
		subjectLine                                                        | body                                          | squashPrefixes | issueReferences                 | refinedSubjectLine
		${"#1"}                                                            | ${""}                                         | ${[]}          | ${["#1"]}                       | ${""}
		${"#2 Release the robot butler"}                                   | ${"\n\nThis is a dummy commit message body."} | ${[]}          | ${[]}                           | ${"#2 Release the robot butler"}
		${"(#12) Fix this confusing plate of spaghetti"}                   | ${""}                                         | ${[]}          | ${[]}                           | ${"(#12) Fix this confusing plate of spaghetti"}
		${"amend!#59: Sneak in a funny easter egg"}                        | ${""}                                         | ${["amend!"]}  | ${[]}                           | ${"#59: Sneak in a funny easter egg"}
		${" #8 #9 Solve the problem"}                                      | ${""}                                         | ${[]}          | ${[]}                           | ${"#8 #9 Solve the problem"}
		${"(#15) #30 #45: make the program act like a clown #60"}          | ${"\n\nThis is a dummy commit message body."} | ${[]}          | ${["#60"]}                      | ${"(#15) #30 #45: make the program act like a clown"}
		${"Add some extra love to the code #7"}                            | ${""}                                         | ${[]}          | ${["#7"]}                       | ${"Add some extra love to the code"}
		${"squash! Apply strawberry jam to make the code sweeter (#7044)"} | ${"\n\nThis is a dummy commit message body."} | ${["squash!"]} | ${["(#7044)"]}                  | ${"Apply strawberry jam to make the code sweeter"}
		${"Make the user interface less chaotic (#11) #17 "}               | ${""}                                         | ${[]}          | ${["#17", "(#11)"]}             | ${"Make the user interface less chaotic"}
		${"squash! #12 Throw a tantrum #34 #56 #78 #90"}                   | ${"\n\nThis is a dummy commit message body."} | ${["squash!"]} | ${["#90", "#78", "#56", "#34"]} | ${"#12 Throw a tantrum"}
		${"fixup! Close #1337 by fixing the bug"}                          | ${""}                                         | ${["fixup!"]}  | ${[]}                           | ${"Close #1337 by fixing the bug"}
	`(
		"a commit with a subject line of $subjectLine",
		(testRow: {
			readonly subjectLine: string
			readonly body: string
			readonly squashPrefixes: ReadonlyArray<string>
			readonly issueReferences: ReadonlyArray<string>
			readonly refinedSubjectLine: string
		}) => {
			const {
				subjectLine,
				body,
				squashPrefixes,
				issueReferences,
				refinedSubjectLine,
			} = testRow

			const commit = refineCommit(
				legacyV1ParseCommit({
					sha: "0ff1ce",
					author: {
						name: "Santa Claus",
						emailAddress: "12345678+santaclaus@users.noreply.github.com",
					},
					committer: {
						name: "Santa Claus",
						emailAddress: "12345678+santaclaus@users.noreply.github.com",
					},
					commitMessage: `${subjectLine}${body}`,
					parents: [{ sha: "deadc0de" }],
				}),
			)

			it(`has an original subject line of '${subjectLine}'`, () => {
				expect(commit.originalSubjectLine).toStrictEqual(subjectLine)
			})

			it(`has a refined subject line of '${refinedSubjectLine}'`, () => {
				expect(commit.refinedSubjectLine).toStrictEqual(refinedSubjectLine)
			})

			it(`has ${formatSquashPrefixes(squashPrefixes)}`, () => {
				expect(commit.squashPrefixes).toStrictEqual(squashPrefixes)
			})

			it(`has ${formatIssueReferences(issueReferences)}`, () => {
				expect(commit.issueReferences).toStrictEqual(issueReferences)
			})
		},
	)
})

describe("when the configuration overrides 'issue-references-in-subject-lines--patterns' with Jira-style issue references", () => {
	const rules: ReadonlyArray<LegacyV1Rule> = legacyV1RulesFrom(
		legacyV1DummyJiraStyleIssueReferencesConfiguration,
	)
	const refineCommit = legacyV1CommitRefinerFrom(rules)

	describe.each`
		subjectLine                                                               | body                                          | squashPrefixes | issueReferences       | refinedSubjectLine
		${"UNICORN-1 Release the robot butler"}                                   | ${"\n\nThis is a dummy commit message body."} | ${[]}          | ${["UNICORN-1"]}      | ${"Release the robot butler"}
		${"(UNICORN-12) Fix this confusing plate of spaghetti"}                   | ${""}                                         | ${[]}          | ${["(UNICORN-12)"]}   | ${"Fix this confusing plate of spaghetti"}
		${"amend!UNICORN-59 Sneak in a funny easter egg"}                         | ${""}                                         | ${["amend!"]}  | ${["UNICORN-59"]}     | ${"Sneak in a funny easter egg"}
		${"Add some extra love to the code UNICORN-7"}                            | ${""}                                         | ${[]}          | ${["UNICORN-7"]}      | ${"Add some extra love to the code"}
		${"squash! Apply strawberry jam to make the code sweeter (UNICORN-7044)"} | ${"\n\nThis is a dummy commit message body."} | ${["squash!"]} | ${["(UNICORN-7044)"]} | ${"Apply strawberry jam to make the code sweeter"}
		${"fixup! Close UNICORN-1337 by fixing the bug"}                          | ${""}                                         | ${["fixup!"]}  | ${[]}                 | ${"Close UNICORN-1337 by fixing the bug"}
	`(
		"a commit with a subject line of $subjectLine",
		(testRow: {
			readonly subjectLine: string
			readonly body: string
			readonly squashPrefixes: ReadonlyArray<string>
			readonly issueReferences: ReadonlyArray<string>
			readonly refinedSubjectLine: string
		}) => {
			const {
				subjectLine,
				body,
				squashPrefixes,
				issueReferences,
				refinedSubjectLine,
			} = testRow

			const commit = refineCommit(
				legacyV1ParseCommit({
					sha: "0ff1ce",
					author: {
						name: "Santa Claus",
						emailAddress: "12345678+santaclaus@users.noreply.github.com",
					},
					committer: {
						name: "Santa Claus",
						emailAddress: "12345678+santaclaus@users.noreply.github.com",
					},
					commitMessage: `${subjectLine}${body}`,
					parents: [{ sha: "deadc0de" }],
				}),
			)

			it(`has an original subject line of '${subjectLine}'`, () => {
				expect(commit.originalSubjectLine).toStrictEqual(subjectLine)
			})

			it(`has a refined subject line of '${refinedSubjectLine}'`, () => {
				expect(commit.refinedSubjectLine).toStrictEqual(refinedSubjectLine)
			})

			it(`has ${formatSquashPrefixes(squashPrefixes)}`, () => {
				expect(commit.squashPrefixes).toStrictEqual(squashPrefixes)
			})

			it(`has ${formatIssueReferences(issueReferences)}`, () => {
				expect(commit.issueReferences).toStrictEqual(issueReferences)
			})
		},
	)
})

function formatSquashPrefixes(prefixes: ReadonlyArray<string>): string {
	return prefixes.length === 0
		? "no squash prefixes"
		: `${count(prefixes, "squash prefix", "squash prefixes")}: ${prefixes.join(
				", ",
			)}`
}

function formatIssueReferences(references: ReadonlyArray<string>): string {
	return references.length === 0
		? "no issue references"
		: `${count(
				references,
				"issue reference",
				"issue references",
			)}: ${references.join(" ")}`
}

function formatParents(parentShas: ReadonlyArray<string>): string {
	return `${count(
		parentShas,
		"parent commit",
		"parent commits",
	)}: ${parentShas.join(", ")}`
}

function formatAuthorName(authorName: string | null): string {
	return authorName === null
		? "no author name"
		: `an author name of '${authorName}'`
}

function formatAuthorEmailAddress(authorEmailAddress: string | null): string {
	return authorEmailAddress === null
		? "no author email address"
		: `an author email address of '${authorEmailAddress}'`
}

function formatCommitterName(committerName: string | null): string {
	return committerName === null
		? "no committer name"
		: `a committer name of '${committerName}'`
}

function formatCommitterEmailAddress(
	committerEmailAddress: string | null,
): string {
	return committerEmailAddress === null
		? "no committer email address"
		: `a committer email address of '${committerEmailAddress}'`
}

function formatBodyLines(bodyLines: ReadonlyArray<string>): string {
	return bodyLines.length === 0
		? "no body lines"
		: `${count(bodyLines, "body line", "body lines")}: ${bodyLines
				.map((line) => `'${line}'`)
				.join(", ")}`
}

function formatCoAuthors(coAuthors: ReadonlyArray<string>): string {
	return coAuthors.length === 0
		? "no co-authors"
		: `${count(coAuthors, "co-author", "co-authors")}: ${coAuthors.join(", ")}`
}
