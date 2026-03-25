import { describe, expect, it } from "vitest"
import { fakeCommit } from "#commits/Commit.fixtures.ts"
import type { Commit, Commits } from "#commits/Commit.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import { commitwiseReport } from "#rules/reports/CommitwiseReport.ts"
import type { Vector } from "#types/Vector.ts"

describe("when there are no concerns", () => {
	const commits: Commits = []
	const concerns: Concerns = []

	it("is empty", () => {
		const actualReport = commitwiseReport(commits, concerns)
		expect(actualReport).toBe("")
	})
})

describe("when 'useCapitalisedSubjectLines' has a concern about characters 0-1", () => {
	const commit = fakeCommit({
		sha: "497de39943643a56f7a69d3d19723e3035318644",
		message: "release the robot butler",
	})
	const concern = subjectLineConcern({
		rule: "useCapitalisedSubjectLines",
		commit: commit.sha,
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
	const concern = subjectLineConcern({
		rule: "useCapitalisedSubjectLines",
		commit: commit.sha,
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

describe.todo("when there are multiple concerns of different types", () => {
	const commits: Vector<Commit, 3> = [fakeCommit(), fakeCommit(), fakeCommit()]
	const concerns: Concerns = []

	it("describes all rule violations, grouped by their commits", () => {
		const actualOutput = commitwiseReport(commits, concerns)
		expect(actualOutput).toBe("TODO")
	})
})
