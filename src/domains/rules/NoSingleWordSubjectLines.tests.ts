import { describe, expect, it } from "vitest"
import { fakeCommitFactory } from "#commits/Commit.fixtures.ts"
import type { Commit } from "#commits/Commit.ts"
import { fakeConfiguration } from "#configurations/Configuration.fixtures.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import { noSingleWordSubjectLines } from "#rules/NoSingleWordSubjectLines.ts"
import { ruleContext } from "#rules/Rule.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { Vector } from "#types/Vector.ts"

const enabled = ruleContext("noSingleWordSubjectLines")

const fakeCommit = fakeCommitFactory(fakeConfiguration())

describe.each`
	subjectLine           | expectedRange
	${"-"}                | ${[0, 1]}
	${".."}               | ${[0, 2]}
	${"WIP"}              | ${[0, 3]}
	${"wip!"}             | ${[0, 4]}
	${"init"}             | ${[0, 4]}
	${"test"}             | ${[0, 4]}
	${"bugfix "}          | ${[0, 6]}
	${"Unsubscribe"}      | ${[0, 11]}
	${"#flabbergastered"} | ${[0, 16]}
	${"HOTFIX"}           | ${[0, 6]}
	${" Refactor"}        | ${[1, 9]}
	${"  oops "}          | ${[2, 6]}
	${"strategy-pattern"} | ${[0, 16]}
	${"`Bingo`"}          | ${[0, 7]}
	${"`EternalWealth`"}  | ${[0, 15]}
`(
	"when the subject line of $subjectLine contains exactly one word",
	(props: { subjectLine: string; expectedRange: CharacterRange }) => {
		const commit = fakeCommit({ message: props.subjectLine })

		describe("and the rule is enabled", () => {
			const actualConcerns = noSingleWordSubjectLines([commit], enabled.options)

			it("raises a concern about the single word", () => {
				expect(actualConcerns).toEqual<Concerns>([
					subjectLineConcern(enabled, commit.sha, { range: props.expectedRange }),
				])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = noSingleWordSubjectLines([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe.each`
	subjectLine                                         | expectedRange
	${"#1 fix"}                                         | ${[3, 6]}
	${"(GH-31)   test"}                                 | ${[10, 14]}
	${"GL-7 `Unscheduled-Maintenance`"}                 | ${[5, 30]}
	${"#2 #3 (GL-1) init"}                              | ${[13, 17]}
	${"fixup! WIP"}                                     | ${[7, 10]}
	${"squash!  bad"}                                   | ${[9, 12]}
	${"  amend!Hotfix"}                                 | ${[8, 14]}
	${'Revert "dadada"'}                                | ${[8, 14]}
	${'Revert "Revert "release""'}                      | ${[16, 23]}
	${"fixup! fixup! Restored"}                         | ${[14, 22]}
	${'amend! Revert " redacted"'}                      | ${[16, 24]}
	${'squash!fixup! revert " revert " GH-67 cleanup"'} | ${[38, 45]}
`(
	"when the subject line of $subjectLine starts with ignorable tokens and has exactly one word otherwise",
	(props: { subjectLine: string; expectedRange: CharacterRange }) => {
		const commit = fakeCommit({ message: props.subjectLine })

		describe("and the rule is enabled", () => {
			const actualConcerns = noSingleWordSubjectLines([commit], enabled.options)

			it("raises a concern about the single word", () => {
				expect(actualConcerns).toEqual<Concerns>([
					subjectLineConcern(enabled, commit.sha, { range: props.expectedRange }),
				])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = noSingleWordSubjectLines([commit], null)

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
`("when the subject line of $subjectLine is blank", (props: { subjectLine: string }) => {
	const commit = fakeCommit({ message: props.subjectLine })

	describe("and the rule is enabled", () => {
		const actualConcerns = noSingleWordSubjectLines([commit], enabled.options)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = noSingleWordSubjectLines([commit], null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})

describe.each`
	subjectLine
	${"#1"}
	${"(GH-31)   "}
	${"#2 #3 (GL-1) "}
	${"  amend!"}
	${"fixup! fixup! "}
	${'Revert ""'}
	${'squash!fixup! revert " revert " GH-67 "'}
`(
	"when the subject line of $subjectLine only contains ignorable tokens",
	(props: { subjectLine: string; expectedRange: CharacterRange }) => {
		const commit = fakeCommit({ message: props.subjectLine })

		describe("and the rule is enabled", () => {
			const actualConcerns = noSingleWordSubjectLines([commit], enabled.options)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = noSingleWordSubjectLines([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe.each`
	subjectLine
	${"Add a search feature for the recipe database"}
	${"Fix authentication bug in login flow"}
	${"init project"}
	${"WIP fix the dance party playlist endpoint"}
	${"Refactor the taxi booking module"}
	${"Update the soft ice machine firmware"}
	${"Let `SoftIceMachineAdapter` produce the goods"}
	${"resolve issues in #21 to make the code work"}
	${"Refactor `HotChocolateMachine`"}
	${"release 1.0.0"}
	${"Closes #1"}
	${"amend! Upgrade React to 19.2.0 (#52)"}
`(
	"when the subject line of $subjectLine contains more than one word",
	(props: { subjectLine: string }) => {
		const commit = fakeCommit({ message: props.subjectLine })

		describe("and the rule is enabled", () => {
			const actualConcerns = noSingleWordSubjectLines([commit], enabled.options)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = noSingleWordSubjectLines([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe("when verifying a set of multiple commits and some commits have single-word subject lines", () => {
	const commits: Vector<Commit, 8> = [
		fakeCommit({ message: "init" }),
		fakeCommit({ message: "WIP!!" }),
		fakeCommit({ message: "Add a vending machine for ideas" }),
		fakeCommit({ message: " hotfixed" }),
		fakeCommit({ message: "Refactor the onboarding wizard" }),
		fakeCommit({ message: "do-over" }),
		fakeCommit({ message: "Introduce a popcorn-based error recovery strategy" }),
		fakeCommit({ message: "do not merge" }),
	]

	describe("and the rule is enabled", () => {
		const actualConcerns = noSingleWordSubjectLines(commits, enabled.options)

		it("raises concerns about the commits with single-word subject lines", () => {
			expect(actualConcerns).toEqual<Concerns>([
				subjectLineConcern(enabled, commits[0].sha, { range: [0, 4] }),
				subjectLineConcern(enabled, commits[1].sha, { range: [0, 5] }),
				subjectLineConcern(enabled, commits[3].sha, { range: [1, 9] }),
				subjectLineConcern(enabled, commits[5].sha, { range: [0, 7] }),
			])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = noSingleWordSubjectLines(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})

describe("when verifying a set of multiple commits and no commits have single-word subject lines", () => {
	const commits: Vector<Commit, 4> = [
		fakeCommit({ message: "Establish the repository" }),
		fakeCommit({ message: "Enable the coffee machine integration tests" }),
		fakeCommit({ message: 'Revert "Add a second rubber duck to the debugging kit"' }),
		fakeCommit({ message: " Drop the legacy spaghetti tower module" }),
	]

	describe("and the rule is enabled", () => {
		const actualConcerns = noSingleWordSubjectLines(commits, enabled.options)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = noSingleWordSubjectLines(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})
