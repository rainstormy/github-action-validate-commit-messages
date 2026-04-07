import { describe, expect, it } from "vitest"
import { fakeCommitFactory } from "#commits/Commit.fixtures.ts"
import type { Commit } from "#commits/Commit.ts"
import { fakeConfiguration } from "#configurations/Configuration.fixtures.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import { noRevertRevertCommits } from "#rules/NoRevertRevertCommits.ts"
import { ruleContext } from "#rules/Rule.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { Vector } from "#types/Vector.ts"

const enabled = ruleContext("noRevertRevertCommits")

const fakeCommit = fakeCommitFactory(fakeConfiguration())

describe.each`
	subjectLine                                                               | expectedRange
	${'Revert "Revert "Fix the bug""'}                                        | ${[0, 16]}
	${'Revert  "revert "Repair the soft ice machine""'}                       | ${[0, 17]}
	${' revert " revert "Apply strawberry jam to make the code sweeter " " '} | ${[1, 18]}
	${'  rEvErT "REVERT   "Refactor the authentication module""'}             | ${[2, 20]}
	${'Revert "Revert "Revert "Fix the nasty bug"""'}                         | ${[0, 24]}
	${' revert "revert  "revert "revert "Repair the soft ice machine """"'}   | ${[1, 34]}
`(
	"when the subject line of $subjectLine contains a revert marker with 2 or more 'revert' occurrences",
	(props: { subjectLine: string; expectedRange: CharacterRange }) => {
		const commit = fakeCommit({ message: props.subjectLine })

		describe("and the rule is enabled", () => {
			const actualConcerns = noRevertRevertCommits([commit], enabled.options)

			it("raises a concern about the revert marker", () => {
				expect(actualConcerns).toEqual<Concerns>([
					subjectLineConcern(enabled, commit.sha, { range: props.expectedRange }),
				])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = noRevertRevertCommits([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe.each`
	subjectLine
	${'Revert "Repair the soft ice machine"'}
	${'Revert "Fix a nasty bug"'}
	${'revert "Fix a nasty bug"'}
	${'REVERT "Refactor the authentication module"'}
	${' Revert "Apply strawberry jam to make the code sweeter" '}
	${'Revert  "Make the program act like a clown"'}
	${'fixup! Revert "Add an amazing feature"'}
`(
	"when the subject line of $subjectLine contains a revert marker with 1 'revert' occurrence",
	(props: { subjectLine: string }) => {
		const commit = fakeCommit({ message: props.subjectLine })

		describe("and the rule is enabled", () => {
			const actualConcerns = noRevertRevertCommits([commit], enabled.options)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = noRevertRevertCommits([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe.each`
	subjectLine
	${'fixup! Revert "Revert "Add an amazing feature""'}
	${' squash!amend!  revert  "revert  "retrieve data from the exclusive third-party service""'}
`(
	"when the subject line of $subjectLine contains a squash marker and a revert marker with 2 or more 'revert' occurrences",
	(props: { subjectLine: string }) => {
		const commit = fakeCommit({ message: props.subjectLine })

		describe("and the rule is enabled", () => {
			const actualConcerns = noRevertRevertCommits([commit], enabled.options)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = noRevertRevertCommits([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe.each`
	subjectLine
	${""}
	${" "}
	${"\t\t"}
	${"Refactor the taxi module"}
	${" Unsubscribe from the service"}
	${"Formatting."}
	${"WIP"}
	${"Fix the bug"}
	${"   Hunt down the bugs "}
	${"fixup! Add an amazing feature"}
	${"squash! Make the program act like a clown"}
	${'#7044: Revert "Unsolve the problem"'}
	${"Time to revert it"}
	${'Not a Revert "thing"'}
	${"Revert the last change"}
	${"Reverted some secret stuff"}
	${'fix: Revert "something"'}
`(
	"when the subject line of $subjectLine does not contain a revert marker",
	(props: { subjectLine: string }) => {
		const commit = fakeCommit({ message: props.subjectLine })

		describe("and the rule is enabled", () => {
			const actualConcerns = noRevertRevertCommits([commit], enabled.options)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = noRevertRevertCommits([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe("when verifying a set of multiple commits and some commits have revert markers with 2 or more 'revert' occurrences", () => {
	const commits: Vector<Commit, 9> = [
		fakeCommit({ message: 'Revert "Revert "Fix the bug""' }),
		fakeCommit({ message: 'Revert "Repair the soft ice machine"' }),
		fakeCommit({ message: "Refactor the taxi module" }),
		fakeCommit({ message: 'squash! Revert "Revert "Fix the bug""' }),
		fakeCommit({ message: "WIP" }),
		fakeCommit({ message: ' revert "revert "WIP""' }),
		fakeCommit({ message: 'Revert "Revert "Revert "Add an amazing feature"""' }),
		fakeCommit({ message: " Unsubscribe from the service" }),
		fakeCommit({ message: "Fix the bug" }),
	]

	describe("and the rule is enabled", () => {
		const actualConcerns = noRevertRevertCommits(commits, enabled.options)

		it("raises concerns about the commits with double revert markers", () => {
			expect(actualConcerns).toEqual<Concerns>([
				subjectLineConcern(enabled, commits[0].sha, { range: [0, 16] }),
				subjectLineConcern(enabled, commits[5].sha, { range: [1, 17] }),
				subjectLineConcern(enabled, commits[6].sha, { range: [0, 24] }),
			])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = noRevertRevertCommits(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})

describe("when verifying a set of multiple commits and no commits have revert markers with 2 or more 'revert' occurrences", () => {
	const commits: Vector<Commit, 6> = [
		fakeCommit({ message: 'Revert "Repair the soft ice machine"' }),
		fakeCommit({ message: "Fix the bug" }),
		fakeCommit({ message: 'fixup! Revert "Repair the soft ice machine"' }),
		fakeCommit({ message: "Time to revert it" }),
		fakeCommit({ message: 'Revert "Time to revert it"' }),
		fakeCommit({ message: "1 2 3 this is a test" }),
	]

	describe("and the rule is enabled", () => {
		const actualConcerns = noRevertRevertCommits(commits, enabled.options)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = noRevertRevertCommits(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})
