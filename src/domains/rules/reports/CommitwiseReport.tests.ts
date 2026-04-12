import { describe, expect, it } from "vitest"
import { fakeCommitFactory } from "#commits/Commit.fixtures.ts"
import type { Commit, Commits } from "#commits/Commit.ts"
import { fakeConfiguration } from "#configurations/Configuration.fixtures.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import { commitwiseReport } from "#rules/reports/CommitwiseReport.ts"
import { ruleContext } from "#rules/Rule.ts"
import type { Vector } from "#types/Vector.ts"

const configuration = fakeConfiguration()
const fakeCommit = fakeCommitFactory(configuration)

describe("when there are no concerns", () => {
	const commits: Commits = []
	const concerns: Concerns = []

	it("is empty", () => {
		const actualReport = commitwiseReport(commits, concerns)
		expect(actualReport).toBe("")
	})
})

describe("when 'noRevertRevertCommits' has a concern about characters 0-16", () => {
	const commit = fakeCommit({
		sha: "d4e7a978cea34b727ea52f90c928fd535e4aee",
		message: 'Revert "Revert "Make the program act like a clown""',
	})
	const concern = subjectLineConcern(ruleContext("noRevertRevertCommits"), commit.sha, {
		range: [0, 16],
	})

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([commit], [concern])
		expect(actualOutput).toBe(
			`
d4e7a97 Revert "Revert "Make the program act like a clown""
        ───────┬────────
               ╰─ Cherry-pick the original commit instead of reverting it over.
                  (noRevertRevertCommits)
`.trim(),
		)
	})
})

describe("when 'noRevertRevertCommits' has a concern about characters 1-26", () => {
	const commit = fakeCommit({
		sha: "34aa41b818c40682cabeecd5623dfe51df7a4a5",
		message: ' revert "revert  "revert "repair the soft ice machine """',
	})
	const concern = subjectLineConcern(ruleContext("noRevertRevertCommits"), commit.sha, {
		range: [1, 26],
	})

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([commit], [concern])
		expect(actualOutput).toBe(
			`
34aa41b  revert "revert  "revert "repair the soft ice machine """
         ────────────┬────────────
                     ╰─ Cherry-pick the original commit instead of reverting it over.
                        (noRevertRevertCommits)
`.trim(),
		)
	})
})

describe("when 'noSquashMarkers' has a concern about characters 0-6", () => {
	const commit = fakeCommit({
		sha: "ffebad193fe7d02aa9b19b70ee132a26f14f8caf",
		message: "amend!Apply strawberry jam to make the code sweeter",
	})
	const concern = subjectLineConcern(ruleContext("noSquashMarkers"), commit.sha, { range: [0, 6] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([commit], [concern])
		expect(actualOutput).toBe(
			`
ffebad1 amend!Apply strawberry jam to make the code sweeter
        ──┬───
          ╰─ Commits with squash markers must be combined with their ancestors.
             (noSquashMarkers)
`.trim(),
		)
	})
})

describe("when 'noSquashMarkers' has a concern about characters 1-14", () => {
	const commit = fakeCommit({
		sha: "56c750b0811fbcad2b237b2b99fc7d3fc91b926",
		message: " fixup! fixup! found a funny easter egg",
	})
	const concern = subjectLineConcern(ruleContext("noSquashMarkers"), commit.sha, {
		range: [1, 14],
	})

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([commit], [concern])
		expect(actualOutput).toBe(
			`
56c750b  fixup! fixup! found a funny easter egg
         ──────┬──────
               ╰─ Commits with squash markers must be combined with their ancestors.
                  (noSquashMarkers)
`.trim(),
		)
	})
})

describe("when 'useCapitalisedSubjectLines' has a concern about characters 0-1", () => {
	const commit = fakeCommit({
		sha: "497de39943643a56f7a69d3d19723e3035318644",
		message: "release the robot butler",
	})
	const concern = subjectLineConcern(ruleContext("useCapitalisedSubjectLines"), commit.sha, {
		range: [0, 1],
	})

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([commit], [concern])
		expect(actualOutput).toBe(
			`
497de39 release the robot butler
        ┬
        ╰─ The first letter in subject lines must be in uppercase.
           (useCapitalisedSubjectLines)
`.trim(),
		)
	})
})

describe("when 'useCapitalisedSubjectLines' has a concern about characters 7-8", () => {
	const commit = fakeCommit({
		sha: "92d6b11650c6b63d64fd77522241b7f50ff5b",
		message: "fixup! resolve a bug that thought it was a feature",
	})
	const concern = subjectLineConcern(ruleContext("useCapitalisedSubjectLines"), commit.sha, {
		range: [7, 8],
	})

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([commit], [concern])
		expect(actualOutput).toBe(
			`
92d6b11 fixup! resolve a bug that thought it was a feature
               ┬
               ╰─ The first letter in subject lines must be in uppercase.
                  (useCapitalisedSubjectLines)
`.trim(),
		)
	})
})

describe("when 'useConciseSubjectLines' has a concern about characters 20-25", () => {
	const commit = fakeCommit({
		sha: "68e921648c4a19e93d72f42a5d39c3eba704e41",
		message: "Remove redundant call to `wrapper`",
	})
	const concern = subjectLineConcern(
		ruleContext("useConciseSubjectLines", { maxLength: 20 }),
		commit.sha,
		{ range: [20, 25] },
	)

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([commit], [concern])
		expect(actualOutput).toBe(
			`
68e9216 Remove redundant call to \`wrapper\`
                            ──┬──
                              ╰─ Subject lines must not exceed 20 characters.
                                 (useConciseSubjectLines)
`.trim(),
		)
	})
})

describe("when 'useConciseSubjectLines' has a concern about characters 20-67", () => {
	const commit = fakeCommit({
		sha: "9bed522bd48f0aee7574635bb23f5decdc4999",
		message: "revisit the boolean properties in the `IceCreamMachine` constructor",
	})
	const concern = subjectLineConcern(
		ruleContext("useConciseSubjectLines", { maxLength: 20 }),
		commit.sha,
		{ range: [20, 67] },
	)

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([commit], [concern])
		expect(actualOutput).toBe(
			`
9bed522 revisit the boolean properties in the \`IceCreamMachine\` constructor
                            ───────────────────────┬───────────────────────
     Subject lines must not exceed 20 characters. ─╯
     (useConciseSubjectLines)
`.trim(),
		)
	})
})

describe("when 'useConciseSubjectLines' has a concern about characters 50-52", () => {
	const commit = fakeCommit({
		sha: "e8c95d69587a51685070837aaf3a8746e3cbba8",
		message: "Retrieve data from the exclusive third-party service",
	})
	const concern = subjectLineConcern(
		ruleContext("useConciseSubjectLines", { maxLength: 50 }),
		commit.sha,
		{ range: [50, 52] },
	)

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([commit], [concern])
		expect(actualOutput).toBe(
			`
e8c95d6 Retrieve data from the exclusive third-party service
                                                          ─┬
             Subject lines must not exceed 50 characters. ─╯
             (useConciseSubjectLines)
`.trim(),
		)
	})
})

describe("when 'useConciseSubjectLines' has a concern about characters 72-76", () => {
	const commit = fakeCommit({
		sha: "be86674322213fb408d176589fadbcd44a2df",
		message: "make a genuine attempt to fix the bugs that the users were complaining about",
	})
	const concern = subjectLineConcern(
		ruleContext("useConciseSubjectLines", { maxLength: 72 }),
		commit.sha,
		{ range: [72, 76] },
	)

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([commit], [concern])
		expect(actualOutput).toBe(
			`
be86674 make a genuine attempt to fix the bugs that the users were complaining about
                                                                                ──┬─
                                    Subject lines must not exceed 72 characters. ─╯
                                    (useConciseSubjectLines)
`.trim(),
		)
	})
})

describe.todo("when there are multiple concerns of different types", () => {
	const commits: Vector<Commit, 3> = [fakeCommit(), fakeCommit(), fakeCommit()]
	const concerns: Concerns = []

	it("describes all rule violations, grouped by their commits", () => {
		const actualOutput = commitwiseReport(commits, concerns)
		expect(actualOutput).toBe("TODO")
	})
})
