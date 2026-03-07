import { describe, expect, it } from "vitest"
import { fakeCommit } from "#commits/Commit.fixtures.ts"
import type { Commit } from "#commits/Commit.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import { useCapitalisedSubjectLines } from "#rules/UseCapitalisedSubjectLines.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { Vector } from "#types/Vector.ts"

const ruleName = "useCapitalisedSubjectLines"
const rule = useCapitalisedSubjectLines()

describe.each`
	subjectLine                                             | expectedCharacterRange
	${"test"}                                               | ${[0, 1]}
	${"release the robot butler"}                           | ${[0, 1]}
	${"  some refactoring "}                                | ${[2, 3]}
	${"fix this confusing plate of spaghetti"}              | ${[0, 1]}
	${"never give up!!"}                                    | ${[0, 1]}
	${"fixup! resolve a bug that thought it was a feature"} | ${[7, 8]}
	${"squash! make the program act like a clown"}          | ${[8, 9]}
	${"GH-12 organise the bookshelf."}                      | ${[6, 7]}
	${"amend! solve the problem!"}                          | ${[7, 8]}
	${" fix it"}                                            | ${[1, 2]}
	${"#7 #8 resolve a bug that thought it was a feature"}  | ${[6, 7]}
	${"amend! GH-55: make the program act like a clown"}    | ${[14, 15]}
	${"i thought this was a good idea"}                     | ${[0, 1]}
	${"   wip"}                                             | ${[3, 4]}
`(
	"when the subject line of $subjectLine starts with a lowercase letter",
	(props: { subjectLine: string; expectedCharacterRange: CharacterRange }) => {
		const commit = fakeCommit({ message: props.subjectLine })

		it("raises a concern about the first non-capitalised character", () => {
			const actualConcerns = rule([commit])
			expect(actualConcerns).toEqual<Concerns>([
				subjectLineConcern(ruleName, commit.sha, props.expectedCharacterRange),
			])
		})
	},
)

describe.each`
	subjectLine
	${"Refactor the taxi module"}
	${" Unsubscribe from the service"}
	${"Formatting."}
	${"WIP"}
	${"amend!(#42)Soften the API boundaries"}
	${"  fixup!  Added some extra love to the code"}
	${"squash! GH-3 Make the formatter happy again :)"}
	${"#7044: Solve the problem"}
	${'Revert "Release the robot butler"'}
	${"   Hunt down the bugs "}
	${"Compare the list of items to the objects downloaded from the server"}
	${"Resolve issues in #21 to make the code work better"}
	${"Finally..."}
	${"Let `SoftIceMachineAdapter` produce the goods that we need"}
`(
	"when the subject line of $subjectLine starts with an uppercase letter",
	(props: { subjectLine: string }) => {
		const commit = fakeCommit({ message: props.subjectLine })

		it("does not raise any concerns", () => {
			const actualConcerns = rule([commit])
			expect(actualConcerns).toEqual<Concerns>([])
		})
	},
)

describe.each`
	subjectLine
	${"..."}
	${"1337"}
	${"1 2 3 this is a test"}
	${"99 reasons to upgrade the framework, but this is not one of them"}
	${"!wip"}
	${"_ marks the spot"}
`(
	"when the subject line of $subjectLine starts with a non-letter",
	(props: { subjectLine: string }) => {
		const commit = fakeCommit({ message: props.subjectLine })

		it("does not raise any concerns", () => {
			const actualConcerns = rule([commit])
			expect(actualConcerns).toEqual<Concerns>([])
		})
	},
)

describe.each`
	subjectLine
	${""}
	${" "}
	${"\t\t"}
	${"amend!"}
	${"#12"}
`(
	"when the subject line of $subjectLine is blank",
	(props: { subjectLine: string }) => {
		const commit = fakeCommit({ message: props.subjectLine })

		it("does not raise any concerns", () => {
			const actualConcerns = rule([commit])
			expect(actualConcerns).toEqual<Concerns>([])
		})
	},
)

describe("when verifying a set of multiple commits and some commits have non-capitalised subject lines", () => {
	const commits: Vector<Commit, 7> = [
		fakeCommit({ message: "test" }),
		fakeCommit({ message: "Refactor the taxi module" }),
		fakeCommit({ message: "WIP" }),
		fakeCommit({ message: "fix this confusing plate of spaghetti" }),
		fakeCommit({ message: " Unsubscribe from the service" }),
		fakeCommit({
			message: "fixup! resolve a bug that thought it was a feature",
		}),
		fakeCommit({ message: "squash! Make the program act like a clown" }),
	]

	it("raises concerns about the commits with non-capitalised subject lines", () => {
		const actualConcerns = rule(commits)
		expect(actualConcerns).toEqual<Concerns>([
			subjectLineConcern(ruleName, commits[0].sha, [0, 1]),
			subjectLineConcern(ruleName, commits[3].sha, [0, 1]),
			subjectLineConcern(ruleName, commits[5].sha, [7, 8]),
		])
	})
})

describe("when verifying a set of multiple commits and all commits have capitalised subject lines", () => {
	const commits: Vector<Commit, 4> = [
		fakeCommit({ message: "Always use the newest data" }),
		fakeCommit({ message: "It works!" }),
		fakeCommit({ message: 'Revert "Bugfix"' }),
		fakeCommit({ message: "Ignore the parameter with _" }),
	]

	it("does not raise any concerns", () => {
		const actualConcerns = rule(commits)
		expect(actualConcerns).toEqual<Concerns>([])
	})
})
