import { describe, expect, it } from "vitest"
import { fakeCommitFactory } from "#commits/Commit.fixtures.ts"
import { fakeConfiguration } from "#configurations/Configuration.fixtures.ts"
import { commitConcern } from "#rules/concerns/CommitConcern.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import { noMergeCommits } from "#rules/NoMergeCommits.ts"
import { ruleContext } from "#rules/Rule.ts"
import { fakeCommitSha } from "#types/CommitSha.fixtures.ts"
import type { CommitSha } from "#types/CommitSha.ts"

const enabled = ruleContext("noMergeCommits")

const fakeCommit = fakeCommitFactory(fakeConfiguration())

describe.each`
	parents                                                | subjectLine
	${[fakeCommitSha(), fakeCommitSha()]}                  | ${"Merge branch 'main' into bugfix/dance-party-playlist"}
	${[fakeCommitSha(), fakeCommitSha()]}                  | ${"Merge pull request #440 from renovate/battle-shell-7.x"}
	${[fakeCommitSha(), fakeCommitSha(), fakeCommitSha()]} | ${"amend! Merge branch 'feature/new-coffee-machine' into feature/office-overhaul"}
	${[fakeCommitSha(), fakeCommitSha(), fakeCommitSha()]} | ${"Keep my branch up to date"}
`(
	"when the commit is a merge commit with $parents.length parents and has a subject line of $subjectLine",
	(props: { parents: Array<CommitSha>; subjectLine: string }) => {
		const commit = fakeCommit({ message: props.subjectLine, parents: props.parents })

		describe("and the rule is enabled", () => {
			const actualConcerns = noMergeCommits([commit], enabled.options)

			it("raises a concern about the entire commit", () => {
				expect(actualConcerns).toEqual<Concerns>([commitConcern(enabled, commit.sha)])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = noMergeCommits([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe.each`
	parents              | subjectLine
	${[]}                | ${"init"}
	${[]}                | ${"Establish the repository"}
	${[fakeCommitSha()]} | ${"just an ordinary commit"}
	${[fakeCommitSha()]} | ${"Release the robot butler"}
`(
	"when the commit is not a merge commit and has a subject line of $subjectLine",
	(props: { parents: Array<CommitSha>; subjectLine: string }) => {
		const commit = fakeCommit({ message: props.subjectLine, parents: props.parents })

		describe("and the rule is enabled", () => {
			const actualConcerns = noMergeCommits([commit], enabled.options)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = noMergeCommits([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)
