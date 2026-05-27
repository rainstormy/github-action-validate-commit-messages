import { describe, expect, it } from "vitest"
import { fakeCommitFactory } from "#commits/Commit.fixtures.ts"
import type { Commit, Commits } from "#commits/Commit.ts"
import { fakeConfiguration } from "#configurations/Configuration.fixtures.ts"
import { issueLinkConfiguration } from "#configurations/IssueLinkTokenConfiguration.ts"
import { bodyLineConcern } from "#rules/concerns/BodyLineConcern.ts"
import { commitConcern } from "#rules/concerns/CommitConcern.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import { userIdentityConcern } from "#rules/concerns/UserIdentityConcern.ts"
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

describe("when 'noExcessiveCommitsPerBranch' has a concern about an excessive commit when the limit is 1", () => {
	const configuration = fakeConfiguration({
		rules: { noExcessiveCommitsPerBranch: { maxCommits: 1 } },
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "9a7e6aa14b8c6e5dd49d7a6a18443bf1f67c520",
		message: "invite the parser to brunch",
	})
	const concern = commitConcern("noExcessiveCommitsPerBranch", commit.sha)

	it("describes the rule violation in the commit", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
9a7e6aa invite the parser to brunch
      ╭────────────────────────────
      ╰─ Branches must not contain more than 1 commit.
         (noExcessiveCommitsPerBranch)
`.trim(),
		)
	})
})

describe("when 'noExcessiveCommitsPerBranch' has a concern about an excessive commit when the limit is 3", () => {
	const configuration = fakeConfiguration({
		rules: { noExcessiveCommitsPerBranch: { maxCommits: 3 } },
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "75bedf83e2b573dc812eba9f14f2b7c6741e670",
		message: "Refactor the jam queue",
	})
	const concern = commitConcern("noExcessiveCommitsPerBranch", commit.sha)

	it("describes the rule violation in the commit", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
75bedf8 Refactor the jam queue
      ╭───────────────────────
      ╰─ Branches must not contain more than 3 commits.
         (noExcessiveCommitsPerBranch)
`.trim(),
		)
	})
})

describe("when 'noExcessiveCommitsPerBranch' has a concern about an excessive commit when the limit is 10", () => {
	const configuration = fakeConfiguration({
		rules: { noExcessiveCommitsPerBranch: { maxCommits: 10 } },
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "f753a247a54bb4c20e9968dca75ef915f2b1ca",
		message: "last minute fix",
	})
	const concern = commitConcern("noExcessiveCommitsPerBranch", commit.sha)

	it("describes the rule violation in the commit", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
f753a24 last minute fix
      ╭────────────────
      ╰─ Branches must not contain more than 10 commits.
         (noExcessiveCommitsPerBranch)
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

	it("describes the rule violation in the commit", () => {
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

describe("when 'noMergeCommits' has a concern about the commit with a long subject line", () => {
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "71516e17c94c69de4eeafff60fac072764d2",
		parents: [fakeCommitSha(), fakeCommitSha(), fakeCommitSha()],
		message: "amend! Merge branch 'feature/new-coffee-machine' into feature/office-overhaul",
	})
	const concern = commitConcern("noMergeCommits", commit.sha)

	it("describes the rule violation in the commit", () => {
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

describe("when 'noRepeatedSubjectLines' has a concern about the commit", () => {
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "8c1fbd48d21686c574a01fd2db4be1c991d897",
		message: "test",
	})
	const concern = commitConcern("noRepeatedSubjectLines", commit.sha)

	it("describes the rule violation in the commit", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
8c1fbd4 test
      ╭─────
      ╰─ Commits must have unique subject lines within a branch.
         (noRepeatedSubjectLines)
`.trim(),
		)
	})
})

describe("when 'noRepeatedSubjectLines' has a concern about the commit with a long subject line", () => {
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "f3359c9a89b46736a36fa2117515af2f5c93",
		message:
			"GH-246 Replace guesswork with a tiny chart and upgrade the `ButterflyService` to 8.0.31",
	})
	const concern = commitConcern("noRepeatedSubjectLines", commit.sha)

	it("describes the rule violation in the commit", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
f3359c9 GH-246 Replace guesswork with a tiny chart and upgrade the \`ButterflyService\` to 8.0.31
      ╭────────────────────────────────────────────────────────────────────────────────────────
      ╰─ Commits must have unique subject lines within a branch.
         (noRepeatedSubjectLines)
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

describe("when 'useAuthorEmailPatterns' has a concern about a missing author email address", () => {
	const configuration = fakeConfiguration({
		rules: {
			useAuthorEmailPatterns: {
				patterns: [String.raw`\d+\+.+@users\.noreply\.github\.com`],
			},
		},
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "87c2ab2dff91967340adee6a79d40f4fd6b781b",
		authorEmail: "",
		message: "Upgrade the workshop espresso workflow",
	})
	const concern = userIdentityConcern("useAuthorEmailPatterns", commit.sha, {
		field: "author:email",
	})

	it("describes the rule violation in the author's email address", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
87c2ab2 Upgrade the workshop espresso workflow
╰─ authored by: 
              ╭─
              ╰─ Email addresses of commit authors must match an accepted pattern.
                 (useAuthorEmailPatterns)
                 
                 Accepted patterns:
                   ∙ ${String.raw`\d+\+.+@users\.noreply\.github\.com`}
`.trim(),
		)
	})
})

describe("when 'useAuthorEmailPatterns' has a concern about the author's email address", () => {
	const configuration = fakeConfiguration({
		rules: {
			useAuthorEmailPatterns: {
				patterns: [
					String.raw`\d+\+.+@users\.noreply\.github\.com`,
					String.raw`.+@fictivecompany\.com`,
				],
			},
		},
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "4014427db76e7f114209216c738649e9e1505f",
		authorEmail: "claus@santasworkshop.com",
		message: "Teach the sleigh to parallel park",
	})
	const concern = userIdentityConcern("useAuthorEmailPatterns", commit.sha, {
		field: "author:email",
	})

	it("describes the rule violation in the author's email address", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
4014427 Teach the sleigh to parallel park
╰─ authored by: claus@santasworkshop.com
              ╭─────────────────────────
              ╰─ Email addresses of commit authors must match an accepted pattern.
                 (useAuthorEmailPatterns)
                 
                 Accepted patterns:
                   ∙ ${String.raw`\d+\+.+@users\.noreply\.github\.com`}
                   ∙ ${String.raw`.+@fictivecompany\.com`}
`.trim(),
		)
	})
})

describe("when 'useAuthorNamePatterns' has a concern about a missing author name", () => {
	const configuration = fakeConfiguration({
		rules: {
			useAuthorNamePatterns: {
				patterns: [String.raw`\p{Lu}.*\s.+`],
			},
		},
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "f16fc9f48c40829a87cbc36f42aa6578834ed0c6",
		authorName: "",
		message: "overpowered code",
	})
	const concern = userIdentityConcern("useAuthorNamePatterns", commit.sha, {
		field: "author:name",
	})

	it("describes the rule violation in the author's name", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
f16fc9f overpowered code
╰─ authored by: 
              ╭─
              ╰─ Names of commit authors must match an accepted pattern.
                 (useAuthorNamePatterns)
                 
                 Accepted patterns:
                   ∙ ${String.raw`\p{Lu}.*\s.+`}
`.trim(),
		)
	})
})

describe("when 'useAuthorNamePatterns' has a concern about the author's name", () => {
	const configuration = fakeConfiguration({
		rules: {
			useAuthorNamePatterns: {
				patterns: [String.raw`\p{Lu}.*\s.+`, String.raw`dependabot\[bot\]`],
			},
		},
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "e4236bf51670f99f245f3a5552fa2b7e6bd8c1",
		authorName: "santa.claus",
		message: "I’m not lazy, I’m on energy-saving mode",
	})
	const concern = userIdentityConcern("useAuthorNamePatterns", commit.sha, {
		field: "author:name",
	})

	it("describes the rule violation in the author's name", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
e4236bf I’m not lazy, I’m on energy-saving mode
╰─ authored by: santa.claus
              ╭────────────
              ╰─ Names of commit authors must match an accepted pattern.
                 (useAuthorNamePatterns)
                 
                 Accepted patterns:
                   ∙ ${String.raw`\p{Lu}.*\s.+`}
                   ∙ ${String.raw`dependabot\[bot\]`}
`.trim(),
		)
	})
})

describe("when 'useCommitterEmailPatterns' has a concern about a missing committer email address", () => {
	const configuration = fakeConfiguration({
		rules: {
			useCommitterEmailPatterns: {
				patterns: [String.raw`\d+\+.+@users\.noreply\.github\.com`],
			},
		},
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "28a5bed21c189fc505af3696c7ff7a3a79524e",
		committerEmail: "",
		message: "Remove stale confetti from the deployment logs",
	})
	const concern = userIdentityConcern("useCommitterEmailPatterns", commit.sha, {
		field: "committer:email",
	})

	it("describes the rule violation in the committer's email address", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
28a5bed Remove stale confetti from the deployment logs
╰─ committed by: 
               ╭─
               ╰─ Email addresses of committers must match an accepted pattern.
                  (useCommitterEmailPatterns)
                  
                  Accepted patterns:
                    ∙ ${String.raw`\d+\+.+@users\.noreply\.github\.com`}
`.trim(),
		)
	})
})

describe("when 'useCommitterEmailPatterns' has a concern about the committer's email address", () => {
	const configuration = fakeConfiguration({
		rules: {
			useCommitterEmailPatterns: {
				patterns: [
					String.raw`\d+\+.+@users\.noreply\.github\.com`,
					String.raw`noreply@github\.com`,
				],
			},
		},
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "55ef98aa89887ba6937a616b6044c7da57f7a",
		committerEmail: "noreply@tmnt.com",
		message: "Teach the release notes to speak plainly",
	})
	const concern = userIdentityConcern("useCommitterEmailPatterns", commit.sha, {
		field: "committer:email",
	})

	it("describes the rule violation in the committer's email address", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
55ef98a Teach the release notes to speak plainly
╰─ committed by: noreply@tmnt.com
               ╭─────────────────
               ╰─ Email addresses of committers must match an accepted pattern.
                  (useCommitterEmailPatterns)
                  
                  Accepted patterns:
                    ∙ ${String.raw`\d+\+.+@users\.noreply\.github\.com`}
                    ∙ ${String.raw`noreply@github\.com`}
`.trim(),
		)
	})
})

describe("when 'useCommitterNamePatterns' has a concern about a missing committer name", () => {
	const configuration = fakeConfiguration({
		rules: {
			useCommitterNamePatterns: {
				patterns: [String.raw`\p{Lu}.*\s.+`],
			},
		},
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "307ce5e6cfe9fbb67f62ca3d40447e9143fb8d38",
		committerName: "",
		message: "retune the tiny deployment bell",
	})
	const concern = userIdentityConcern("useCommitterNamePatterns", commit.sha, {
		field: "committer:name",
	})

	it("describes the rule violation in the committer's name", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
307ce5e retune the tiny deployment bell
╰─ committed by: 
               ╭─
               ╰─ Names of committers must match an accepted pattern.
                  (useCommitterNamePatterns)
                  
                  Accepted patterns:
                    ∙ ${String.raw`\p{Lu}.*\s.+`}
`.trim(),
		)
	})
})

describe("when 'useCommitterNamePatterns' has a concern about the committer's name", () => {
	const configuration = fakeConfiguration({
		rules: {
			useCommitterNamePatterns: {
				patterns: [
					String.raw`\p{Lu}.*\s.+`,
					String.raw`dependabot\[bot\]`,
					String.raw`renovate\[bot\]`,
					String.raw`GitHub`,
				],
			},
		},
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "61a6e5334d93126cec5c594bd75a3c7fee7ec",
		committerName: "master splinter",
		message: "Make the changelog less mysterious",
	})
	const concern = userIdentityConcern("useCommitterNamePatterns", commit.sha, {
		field: "committer:name",
	})

	it("describes the rule violation in the committer's name", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
61a6e53 Make the changelog less mysterious
╰─ committed by: master splinter
               ╭────────────────
               ╰─ Names of committers must match an accepted pattern.
                  (useCommitterNamePatterns)
                  
                  Accepted patterns:
                    ∙ ${String.raw`\p{Lu}.*\s.+`}
                    ∙ ${String.raw`dependabot\[bot\]`}
                    ∙ ${String.raw`renovate\[bot\]`}
                    ∙ ${String.raw`GitHub`}
`.trim(),
		)
	})
})

describe("when 'useImperativeSubjectLines' has a concern about characters 0-5 of the subject line", () => {
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "9e45e097a594deaf39b360fb285be38b5b68a2",
		message: "Added a feature that should have stayed on the whiteboard",
	})
	const concern = subjectLineConcern("useImperativeSubjectLines", commit.sha, { range: [0, 5] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
9e45e09 Added a feature that should have stayed on the whiteboard
        ──┬──
          ╰─ Subject lines must start with a verb in the imperative mood.
             (useImperativeSubjectLines)
`.trim(),
		)
	})
})

describe("when 'useImperativeSubjectLines' has a concern about characters 14-18 of the subject line", () => {
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "339b6fcb8aedbe7b19443e39be24f615287a7",
		message: "amend! GH-55: made the console less dramatic",
	})
	const concern = subjectLineConcern("useImperativeSubjectLines", commit.sha, { range: [14, 18] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
339b6fc amend! GH-55: made the console less dramatic
                      ─┬──
                       ╰─ Subject lines must start with a verb in the imperative mood.
                          (useImperativeSubjectLines)
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

describe("when 'useEmptyLineBeforeBodyLines' has a concern about the first body line", () => {
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "f163851c187a568acc631fff402fcca43f41968d",
		message: "Install a quieter keyboard\nThe old one sounded like hail.",
	})
	const concern = bodyLineConcern("useEmptyLineBeforeBodyLines", commit.sha, {
		line: 0,
		range: [0, 1],
	})

	it("describes the rule violation in the body line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
f163851 Install a quieter keyboard
    ╭──
∙ 1 │ The old one sounded like hail.
    · ┬
    · ╰─ Subject lines and message bodies must be separated by exactly one empty line.
    ·    (useEmptyLineBeforeBodyLines)
    ╰──
`.trim(),
		)
	})
})

describe("when 'useEmptyLineBeforeBodyLines' has a concern about an extra empty body line", () => {
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "30fd57b19c55b3746a157f5981838e26865637f2",
		message: "Clean the tiny dashboard\n\n\nThe widgets sparkle.\nAnd the birds are joyful.",
	})
	const concern = bodyLineConcern("useEmptyLineBeforeBodyLines", commit.sha, {
		line: 1,
		range: [0, 1],
	})

	it("describes the rule violation in the body line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
30fd57b Clean the tiny dashboard
    ╭──
  1 │ 
∙ 2 │ 
    · ┬
    · ╰─ Subject lines and message bodies must be separated by exactly one empty line.
    ·    (useEmptyLineBeforeBodyLines)
  3 │ The widgets sparkle.
    ╰──
`.trim(),
		)
	})
})

describe("when 'useIssueLinks' with position 'anywhere' has a concern about characters 0-1 of the subject line", () => {
	const configuration = fakeConfiguration({
		rules: { useIssueLinks: { position: "anywhere" } },
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "c861aeae9dcdea99776d1e56c4de100ba29effb",
		message: "Organise the robot uprising without a ticket",
	})
	const concern = subjectLineConcern("useIssueLinks", commit.sha, { range: [0, 1] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
c861aea Organise the robot uprising without a ticket
        ┬
        ╰─ Subject lines must include an issue link.
           (useIssueLinks)
           
           Examples: #123, GH-123, GL-123
`.trim(),
		)
	})
})

describe("when 'useIssueLinks' with position 'prefix' has a concern about characters 7-8 of the subject line", () => {
	const configuration = fakeConfiguration({
		rules: { useIssueLinks: { position: "prefix" } },
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "fb100238cf55fdcc7c48044df4b5922c0886f5c2d",
		message: "amend! Teach the unit tests to write themselves",
	})
	const concern = subjectLineConcern("useIssueLinks", commit.sha, { range: [7, 8] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
fb10023 amend! Teach the unit tests to write themselves
               ┬
               ╰─ Subject lines must start with an issue link.
                  (useIssueLinks)
                  
                  Examples: #123, GH-123, GL-123
`.trim(),
		)
	})
})

describe("when 'useIssueLinks' with position 'suffix' has a concern about characters 49-50 of the subject line", () => {
	const configuration = fakeConfiguration({
		rules: { useIssueLinks: { position: "suffix" } },
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "d9a30bb22c78cf24fc6a79a3131a33829792bd4",
		message: "make the automated tests question their existence",
	})
	const concern = subjectLineConcern("useIssueLinks", commit.sha, { range: [49, 50] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
d9a30bb make the automated tests question their existence
                                                         ┬
             Subject lines must end with an issue link. ─╯
             (useIssueLinks)
             
             Examples: #123, GH-123, GL-123
`.trim(),
		)
	})
})

describe("when 'useIssueLinks' with position 'suffix' has a concern about characters 26-27 of the subject line", () => {
	const configuration = fakeConfiguration({
		rules: { useIssueLinks: { position: "suffix" } },
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "5761bad8f4bbdd9f22eac552ca15a42dd547692",
		message: "Cooked this commit at 3 AM",
	})
	const concern = subjectLineConcern("useIssueLinks", commit.sha, { range: [26, 27] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
5761bad Cooked this commit at 3 AM
                                  ┬
                                  ╰─ Subject lines must end with an issue link.
                                     (useIssueLinks)
                                     
                                     Examples: #123, GH-123, GL-123
`.trim(),
		)
	})
})

describe("when 'useIssueLinks' with position 'anywhere' and Jira-style issue links has a concern about characters 10-11 of the subject line", () => {
	const configuration = fakeConfiguration({
		rules: { useIssueLinks: { position: "anywhere" } },
		tokens: { issueLinks: issueLinkConfiguration(["ABC-"]) },
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "d0709d2e4d2c55bf37ec7e7632f655e8e9b3eb",
		message: " squash!  made the code so clean that it sparkles",
	})
	const concern = subjectLineConcern("useIssueLinks", commit.sha, { range: [10, 11] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
d0709d2  squash!  made the code so clean that it sparkles
                  ┬
                  ╰─ Subject lines must include an issue link.
                     (useIssueLinks)
                     
                     Example: ABC-123
`.trim(),
		)
	})
})

describe("when 'useIssueLinks' with position 'prefix' and custom-style issue links has a concern about characters 0-1 of the subject line", () => {
	const configuration = fakeConfiguration({
		rules: { useIssueLinks: { position: "prefix" } },
		tokens: { issueLinks: issueLinkConfiguration(["test#", "experiment#"]) },
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "f6fc2399d62caefc3e4bfd8bf2a8da28fffafe",
		message: "Refactored code, now it’s overpowered",
	})
	const concern = subjectLineConcern("useIssueLinks", commit.sha, { range: [0, 1] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
f6fc239 Refactored code, now it’s overpowered
        ┬
        ╰─ Subject lines must start with an issue link.
           (useIssueLinks)
           
           Examples: test#123, experiment#123
`.trim(),
		)
	})
})

describe("when 'useIssueLinks' with position 'suffix' and Jira-style issue links has a concern about characters 41-42 of the subject line", () => {
	const configuration = fakeConfiguration({
		rules: { useIssueLinks: { position: "suffix" } },
		tokens: { issueLinks: issueLinkConfiguration(["AWESOME-", "UNICORN-", "PROJECT-"]) },
	})
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "cccee2c633f0e65d939df7d9953f59ee9322c323",
		message: "Fixed a bad typo in comment (yes, really)",
	})
	const concern = subjectLineConcern("useIssueLinks", commit.sha, { range: [41, 42] })

	it("describes the rule violation in the subject line", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
cccee2c Fixed a bad typo in comment (yes, really)
                                                 ┬
     Subject lines must end with an issue link. ─╯
     (useIssueLinks)
     
     Examples: AWESOME-123, UNICORN-123, PROJECT-123
`.trim(),
		)
	})
})

describe("when 'useSignedCommits' has a concern about the commit", () => {
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "9b9e2ab8f3248152474f41f728f1221d5bf55a16",
		message: "Sign the pantry inventory app",
		signature: "",
	})
	const concern = commitConcern("useSignedCommits", commit.sha)

	it("describes the rule violation in the commit", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
9b9e2ab Sign the pantry inventory app
      ╭──────────────────────────────
      ╰─ Commits must be signed cryptographically with a signing key.
         (useSignedCommits)
`.trim(),
		)
	})
})

describe("when 'useSignedCommits' has a concern about the commit with a long subject line", () => {
	const configuration = fakeConfiguration()
	const fakeCommit = fakeCommitFactory(configuration)

	const commit = fakeCommit({
		sha: "42cefd126a47bfd368d774047a711519eadc2d5",
		message: "fixup! GH-692 it's raining gold everywhere we go",
		signature: "",
	})
	const concern = commitConcern("useSignedCommits", commit.sha)

	it("describes the rule violation in the commit", () => {
		const actualOutput = commitwiseReport([concern], [commit], configuration)
		expect(actualOutput).toBe(
			`
42cefd1 fixup! GH-692 it's raining gold everywhere we go
      ╭─────────────────────────────────────────────────
      ╰─ Commits must be signed cryptographically with a signing key.
         (useSignedCommits)
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
