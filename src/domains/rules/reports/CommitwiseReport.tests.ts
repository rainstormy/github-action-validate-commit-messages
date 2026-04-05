import { describe, expect, it } from "vitest"
import { fakeCommitFactory } from "#commits/Commit.fixtures.ts"
import type { Commit, Commits } from "#commits/Commit.ts"
import { fakeConfiguration } from "#configurations/Configuration.fixtures.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import { commitwiseReport } from "#rules/reports/CommitwiseReport.ts"
import { type RuleContext, type RuleKey, ruleContext } from "#rules/Rule.ts"
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

describe("when 'useCapitalisedSubjectLines' has a concern about characters 0-1", () => {
	const commit = fakeCommit({
		sha: "497de39943643a56f7a69d3d19723e3035318644",
		message: "release the robot butler",
	})
	const concern = subjectLineConcern(inRule("useCapitalisedSubjectLines"), commit.sha, {
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
	const concern = subjectLineConcern(inRule("useCapitalisedSubjectLines"), commit.sha, {
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

describe("when 'noSquashMarkers' has a concern about characters 0-6", () => {
	const commit = fakeCommit({
		sha: "ffebad193fe7d02aa9b19b70ee132a26f14f8caf",
		message: "amend!Apply strawberry jam to make the code sweeter",
	})
	const concern = subjectLineConcern(inRule("noSquashMarkers"), commit.sha, { range: [0, 6] })

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
	const concern = subjectLineConcern(inRule("noSquashMarkers"), commit.sha, { range: [1, 14] })

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

describe.todo("when there are multiple concerns of different types", () => {
	const commits: Vector<Commit, 3> = [fakeCommit(), fakeCommit(), fakeCommit()]
	const concerns: Concerns = []

	it("describes all rule violations, grouped by their commits", () => {
		const actualOutput = commitwiseReport(commits, concerns)
		expect(actualOutput).toBe("TODO")
	})
})

function inRule(key: RuleKey): RuleContext {
	return ruleContext(key, configuration.rules[key])
}
