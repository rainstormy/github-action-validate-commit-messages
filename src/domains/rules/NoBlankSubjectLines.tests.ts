import { describe, expect, it } from "vitest"
import { fakeCommitFactory } from "#commits/Commit.fixtures.ts"
import type { Commit } from "#commits/Commit.ts"
import { fakeConfiguration } from "#configurations/Configuration.fixtures.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import { noBlankSubjectLines } from "#rules/NoBlankSubjectLines.ts"
import { ruleContext } from "#rules/Rule.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { Vector } from "#types/Vector.ts"

const enabled = ruleContext("noBlankSubjectLines")

const fakeCommit = fakeCommitFactory(fakeConfiguration())

describe.each`
	subjectLine | expectedRange
	${""}       | ${[0, 1]}
	${" "}      | ${[0, 1]}
	${"     "}  | ${[0, 1]}
	${"\t\t"}   | ${[0, 1]}
`(
	"when the subject line of $subjectLine is blank",
	(props: { subjectLine: string; expectedRange: CharacterRange }) => {
		const commit = fakeCommit({ message: props.subjectLine })

		describe("and the rule is enabled", () => {
			const actualConcerns = noBlankSubjectLines([commit], enabled.options)

			it("raises a concern about the first character in the subject line", () => {
				expect(actualConcerns).toEqual<Concerns>([
					subjectLineConcern(enabled, commit.sha, {
						range: props.expectedRange,
					}),
				])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = noBlankSubjectLines([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe.each`
	subjectLine                                  | expectedRange
	${"#1"}                                      | ${[2, 3]}
	${"(GH-17)  "}                               | ${[7, 8]}
	${"#2 #3 (GL-1)"}                            | ${[12, 13]}
	${"fixup!"}                                  | ${[6, 7]}
	${"squash!  "}                               | ${[7, 8]}
	${"  amend!"}                                | ${[8, 9]}
	${'Revert ""'}                               | ${[8, 9]}
	${'Revert "Revert """'}                      | ${[16, 17]}
	${"fixup! fixup! "}                          | ${[13, 14]}
	${" squash! "}                               | ${[8, 9]}
	${'amend! Revert " "'}                       | ${[15, 16]}
	${'squash!fixup! revert " revert " GH-67 "'} | ${[37, 38]}
`(
	"when the subject line of $subjectLine starts with ignorable tokens and is blank otherwise",
	(props: { subjectLine: string; expectedRange: CharacterRange }) => {
		const commit = fakeCommit({ message: props.subjectLine })

		describe("and the rule is enabled", () => {
			const actualConcerns = noBlankSubjectLines([commit], enabled.options)

			it("raises a concern about the first character after the ignorable tokens", () => {
				expect(actualConcerns).toEqual<Concerns>([
					subjectLineConcern(enabled, commit.sha, {
						range: props.expectedRange,
					}),
				])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = noBlankSubjectLines([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe.each`
	subjectLine
	${"."}
	${"-"}
	${"'"}
	${"``"}
	${"test"}
	${"bugfix "}
	${"init project"}
	${"Add a search feature for the recipe database"}
	${" Fix authentication bug in login flow"}
	${"Update the soft ice machine firmware"}
	${"Let `SoftIceMachineAdapter` produce the goods"}
	${"resolve issues in #21 to make the code work"}
	${"Refactor `HotChocolateMachine`"}
`("when the subject line of $subjectLine is not blank", (props: { subjectLine: string }) => {
	const commit = fakeCommit({ message: props.subjectLine })

	describe("and the rule is enabled", () => {
		const actualConcerns = noBlankSubjectLines([commit], enabled.options)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = noBlankSubjectLines([commit], null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})

describe("when verifying a set of multiple commits and some commits have blank subject lines", () => {
	const commits: Vector<Commit, 6> = [
		fakeCommit({ message: "" }),
		fakeCommit({ message: "#29  " }),
		fakeCommit({ message: "Add a vending machine for ideas" }),
		fakeCommit({ message: " refactor the onboarding wizard" }),
		fakeCommit({ message: " " }),
		fakeCommit({ message: "Introduce a popcorn-based error recovery strategy" }),
	]

	describe("and the rule is enabled", () => {
		const actualConcerns = noBlankSubjectLines(commits, enabled.options)

		it("raises concerns about the commits with blank subject lines", () => {
			expect(actualConcerns).toEqual<Concerns>([
				subjectLineConcern(enabled, commits[0].sha, { range: [0, 1] }),
				subjectLineConcern(enabled, commits[1].sha, { range: [3, 4] }),
				subjectLineConcern(enabled, commits[4].sha, { range: [0, 1] }),
			])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = noBlankSubjectLines(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})

describe("when verifying a set of multiple commits and no commits have blank subject lines", () => {
	const commits: Vector<Commit, 4> = [
		fakeCommit({ message: "init" }),
		fakeCommit({ message: "Enable the coffee machine integration tests" }),
		fakeCommit({ message: 'Revert "Add a second rubber duck to the debugging kit"' }),
		fakeCommit({ message: " Drop the legacy spaghetti tower module" }),
	]

	describe("and the rule is enabled", () => {
		const actualConcerns = noBlankSubjectLines(commits, enabled.options)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = noBlankSubjectLines(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})
