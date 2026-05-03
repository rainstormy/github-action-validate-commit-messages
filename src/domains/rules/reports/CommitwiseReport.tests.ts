import { describe, expect, it } from "vitest"
import { fakeCommitFactory } from "#commits/Commit.fixtures.ts"
import type { Commit, Commits } from "#commits/Commit.ts"
import { fakeConfiguration } from "#configurations/Configuration.fixtures.ts"
import { commitConcern } from "#rules/concerns/CommitConcern.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import { commitwiseReport } from "#rules/reports/CommitwiseReport.ts"
import { fakeCommitSha } from "#types/CommitSha.fixtures.ts"
import type { Vector } from "#types/Vector.ts"

describe("when there are no concerns", () => {
	const configuration = fakeConfiguration()

	const commits: Commits = []
	const concerns: Concerns = []

	it("is empty", () => {
		const actualReport = commitwiseReport(concerns, commits, configuration)
		expect(actualReport).toBe("")
	})
})

describe("when 'noBlankSubjectLines' has a concern about characters 0-1 of the subject line", () => {
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "52f07a2d665e6d3b3b50b8fca2af298c100ac804c",
		message: "",
	})
	const concern = subjectLineConcern("noBlankSubjectLines", commit.sha, { range: [0, 1] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
52f07a2 
        ┬
        ╰─ Subject lines must contain at least one non-whitespace character.
           (noBlankSubjectLines)
`.trim(),
		)
	})
})

describe("when 'noBlankSubjectLines' has a concern about characters 15-16 of the subject line", () => {
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "2ba57d6e3490324db1bacf22ae288481357ef5c",
		message: 'amend! Revert " "',
	})
	const concern = subjectLineConcern("noBlankSubjectLines", commit.sha, { range: [15, 16] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
2ba57d6 amend! Revert " "
                       ┬
                       ╰─ Subject lines must contain at least one non-whitespace character.
                          (noBlankSubjectLines)
`.trim(),
		)
	})
})

describe("when 'noMergeCommits' has a concern about the commit", () => {
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "507c835ff93e38ed1540ff58fb72f7837f9af13",
		parents: [fakeCommitSha(), fakeCommitSha()],
		message: "Merge branch 'main' into bugfix/dance-party-playlist",
	})
	const concern = commitConcern("noMergeCommits", commit.sha)

	it("describes the rule violation", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
507c835 Merge branch 'main' into bugfix/dance-party-playlist
      ╭─────────────────────────────────────────────────────
      ╰─ Merge commits are not allowed.
         (noMergeCommits)
`.trim(),
		)
	})
})

describe("when 'noMergeCommits' has a concern about the commit", () => {
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "71516e17c94c69de4eeafff60fac072764d2",
		parents: [fakeCommitSha(), fakeCommitSha(), fakeCommitSha()],
		message: "amend! Merge branch 'feature/new-coffee-machine' into feature/office-overhaul",
	})
	const concern = commitConcern("noMergeCommits", commit.sha)

	it("describes the rule violation", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
71516e1 amend! Merge branch 'feature/new-coffee-machine' into feature/office-overhaul
      ╭──────────────────────────────────────────────────────────────────────────────
      ╰─ Merge commits are not allowed.
         (noMergeCommits)
`.trim(),
		)
	})
})

describe("when 'noRevertRevertCommits' has a concern about characters 0-16 of the subject line", () => {
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "d4e7a978cea34b727ea52f90c928fd535e4aee",
		message: 'Revert "Revert "Make the program act like a clown""',
	})
	const concern = subjectLineConcern("noRevertRevertCommits", commit.sha, { range: [0, 16] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
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

describe("when 'noRevertRevertCommits' has a concern about characters 1-26 of the subject line", () => {
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "34aa41b818c40682cabeecd5623dfe51df7a4a5",
		message: ' revert "revert  "revert "repair the soft ice machine """',
	})
	const concern = subjectLineConcern("noRevertRevertCommits", commit.sha, { range: [1, 26] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
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

describe("when 'noSingleWordSubjectLines' has a concern about characters 0-3 of the subject line", () => {
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "964bce7ef85bb4347a0882c5d43c8cece4938f",
		message: "WIP",
	})
	const concern = subjectLineConcern("noSingleWordSubjectLines", commit.sha, { range: [0, 3] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
964bce7 WIP
        ─┬─
         ╰─ Subject lines must contain at least two words.
            (noSingleWordSubjectLines)
`.trim(),
		)
	})
})

describe("when 'noSingleWordSubjectLines' has a concern about characters 11-17 of the subject line", () => {
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "a4b6d0e1aee11f7bc39dfd68858257e236256fbf",
		message: "fixup! #17 bugfix",
	})
	const concern = subjectLineConcern("noSingleWordSubjectLines", commit.sha, { range: [11, 17] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
a4b6d0e fixup! #17 bugfix
                   ──┬───
                     ╰─ Subject lines must contain at least two words.
                        (noSingleWordSubjectLines)
`.trim(),
		)
	})
})

describe("when 'noSquashMarkers' has a concern about characters 0-6 of the subject line", () => {
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "ffebad193fe7d02aa9b19b70ee132a26f14f8caf",
		message: "amend!Apply strawberry jam to make the code sweeter",
	})
	const concern = subjectLineConcern("noSquashMarkers", commit.sha, { range: [0, 6] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
ffebad1 amend!Apply strawberry jam to make the code sweeter
        ──┬───
          ╰─ Combine squash commits with their ancestors.
             (noSquashMarkers)
`.trim(),
		)
	})
})

describe("when 'noSquashMarkers' has a concern about characters 1-14 of the subject line", () => {
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "56c750b0811fbcad2b237b2b99fc7d3fc91b926",
		message: " fixup! fixup! found a funny easter egg",
	})
	const concern = subjectLineConcern("noSquashMarkers", commit.sha, { range: [1, 14] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
56c750b  fixup! fixup! found a funny easter egg
         ──────┬──────
               ╰─ Combine squash commits with their ancestors.
                  (noSquashMarkers)
`.trim(),
		)
	})
})

describe("when 'useCapitalisedSubjectLines' has a concern about characters 0-1 of the subject line", () => {
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "497de39943643a56f7a69d3d19723e3035318644",
		message: "release the robot butler",
	})
	const concern = subjectLineConcern("useCapitalisedSubjectLines", commit.sha, { range: [0, 1] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
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

describe("when 'useCapitalisedSubjectLines' has a concern about characters 7-8 of the subject line", () => {
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "92d6b11650c6b63d64fd77522241b7f50ff5b",
		message: "fixup! resolve a bug that thought it was a feature",
	})
	const concern = subjectLineConcern("useCapitalisedSubjectLines", commit.sha, { range: [7, 8] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
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

describe("when 'useConciseSubjectLines' has a concern about characters 20-25 of the subject line", () => {
	const configuration = fakeConfiguration({
		rules: { useConciseSubjectLines: { maxLength: 20 } },
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "68e921648c4a19e93d72f42a5d39c3eba704e41",
		message: "Remove redundant call to `wrapper`",
	})
	const concern = subjectLineConcern("useConciseSubjectLines", commit.sha, { range: [20, 25] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
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

describe("when 'useConciseSubjectLines' has a concern about characters 20-67 of the subject line", () => {
	const configuration = fakeConfiguration({
		rules: { useConciseSubjectLines: { maxLength: 20 } },
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "9bed522bd48f0aee7574635bb23f5decdc4999",
		message: "revisit the boolean properties in the `IceCreamMachine` constructor",
	})
	const concern = subjectLineConcern("useConciseSubjectLines", commit.sha, { range: [20, 67] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
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

describe("when 'useConciseSubjectLines' has a concern about characters 50-52 of the subject line", () => {
	const configuration = fakeConfiguration({
		rules: { useConciseSubjectLines: { maxLength: 50 } },
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "e8c95d69587a51685070837aaf3a8746e3cbba8",
		message: "Retrieve data from the exclusive third-party service",
	})
	const concern = subjectLineConcern("useConciseSubjectLines", commit.sha, { range: [50, 52] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
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

describe("when 'useConciseSubjectLines' has a concern about characters 72-76 of the subject line", () => {
	const configuration = fakeConfiguration({
		rules: { useConciseSubjectLines: { maxLength: 72 } },
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "be86674322213fb408d176589fadbcd44a2df",
		message: "make a genuine attempt to fix the bugs that the users were complaining about",
	})
	const concern = subjectLineConcern("useConciseSubjectLines", commit.sha, { range: [72, 76] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
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
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commits: Vector<Commit, 3> = [fakeCommit(), fakeCommit(), fakeCommit()]
	const concerns: Concerns = []

	it("describes all rule violations, grouped by their commits", () => {
		const actualOutput = commitwiseReport(concerns, commits, configuration)
		expect(actualOutput).toBe("TODO")
	})
})
