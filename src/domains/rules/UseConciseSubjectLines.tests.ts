import { describe, expect, it } from "vitest"
import { fakeCommitFactory } from "#commits/Commit.fixtures.ts"
import type { Commit } from "#commits/Commit.ts"
import { fakeConfiguration } from "#configurations/Configuration.fixtures.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey, RuleOptions } from "#rules/Rule.ts"
import { useConciseSubjectLines } from "#rules/UseConciseSubjectLines.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import { fakeCommitSha } from "#types/CommitSha.fixtures.ts"
import type { CommitSha } from "#types/CommitSha.ts"
import type { Vector } from "#types/Vector.ts"

const rule = "useConciseSubjectLines" satisfies RuleKey
const enabled20: RuleOptions<typeof rule> = { maxLength: 20 }
const enabled50: RuleOptions<typeof rule> = { maxLength: 50 }
const enabled72: RuleOptions<typeof rule> = { maxLength: 72 }

const fakeCommit = fakeCommitFactory(fakeConfiguration())

describe.each`
	subjectLine                                                                             | expectedRange20 | expectedRange50 | expectedRange72
	${"Upgrade dependency @opentelemetry/exporter-metrics-otlp-http to the newest version"} | ${[20, 82]}     | ${[50, 82]}     | ${[72, 82]}
	${"make a genuine attempt to fix the bugs that the users were complaining about"}       | ${[20, 76]}     | ${[50, 76]}     | ${[72, 76]}
	${"shelve the broken cursor until the warm summer weather makes it shine again"}        | ${[20, 75]}     | ${[50, 75]}     | ${[72, 75]}
`(
	"when the subject line of $subjectLine exceeds 72 characters",
	(props: {
		subjectLine: string
		expectedRange20: CharacterRange
		expectedRange50: CharacterRange
		expectedRange72: CharacterRange
	}) => {
		const commit = fakeCommit({ message: props.subjectLine })

		describe("and the rule is enabled with a maximum length of 20 characters", () => {
			const actualConcerns = useConciseSubjectLines([commit], enabled20)

			it("raises a concern about the characters that exceed the limit", () => {
				expect(actualConcerns).toEqual<Concerns>([
					subjectLineConcern(rule, commit.sha, { range: props.expectedRange20 }),
				])
			})
		})

		describe("and the rule is enabled with a maximum length of 50 characters", () => {
			const actualConcerns = useConciseSubjectLines([commit], enabled50)

			it("raises a concern about the characters that exceed the limit", () => {
				expect(actualConcerns).toEqual<Concerns>([
					subjectLineConcern(rule, commit.sha, { range: props.expectedRange50 }),
				])
			})
		})

		describe("and the rule is enabled with a maximum length of 72 characters", () => {
			const actualConcerns = useConciseSubjectLines([commit], enabled72)

			it("raises a concern about the characters that exceed the limit", () => {
				expect(actualConcerns).toEqual<Concerns>([
					subjectLineConcern(rule, commit.sha, { range: props.expectedRange72 }),
				])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = useConciseSubjectLines([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe.each`
	subjectLine                                                                   | expectedRange20 | expectedRange50
	${"retrieve data from the exclusive third-party service"}                     | ${[20, 52]}     | ${[50, 52]}
	${"Forget to close the backtick section in `RapidTransportService"}           | ${[20, 62]}     | ${[50, 62]}
	${"Compare the list of items to the objects downloaded from the server"}      | ${[20, 67]}     | ${[50, 67]}
	${"Resolve memory issues to make the code work better than it did last year"} | ${[20, 72]}     | ${[50, 72]}
`(
	"when the subject line of $subjectLine exceeds 50 characters, but not 72 characters",
	(props: {
		subjectLine: string
		expectedRange20: CharacterRange
		expectedRange50: CharacterRange
	}) => {
		const commit = fakeCommit({ message: props.subjectLine })

		describe("and the rule is enabled with a maximum length of 20 characters", () => {
			const actualConcerns = useConciseSubjectLines([commit], enabled20)

			it("raises a concern about the characters that exceed the limit", () => {
				expect(actualConcerns).toEqual<Concerns>([
					subjectLineConcern(rule, commit.sha, { range: props.expectedRange20 }),
				])
			})
		})

		describe("and the rule is enabled with a maximum length of 50 characters", () => {
			const actualConcerns = useConciseSubjectLines([commit], enabled50)

			it("raises a concern about the characters that exceed the limit", () => {
				expect(actualConcerns).toEqual<Concerns>([
					subjectLineConcern(rule, commit.sha, { range: props.expectedRange50 }),
				])
			})
		})

		describe("and the rule is enabled with a maximum length of 72 characters", () => {
			const actualConcerns = useConciseSubjectLines([commit], enabled72)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = useConciseSubjectLines([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe.each`
	subjectLine                                                                                 | expectedRange20 | expectedRange50
	${"Fixed a bug, but have probably introduced another one #510"}                             | ${[20, 53]}     | ${[50, 53]}
	${"fixup! forgot to save my changes before entering the merge chaos"}                       | ${[27, 64]}     | ${[57, 64]}
	${"fixup! GH-291 Resolve memory issues to make the code work better than it did last year"} | ${[34, 86]}     | ${[64, 86]}
`(
	"when the subject line of $subjectLine contains insignificant tokens and still exceeds 50 characters, but not 72 characters",
	(props: {
		subjectLine: string
		expectedRange20: CharacterRange
		expectedRange50: CharacterRange
	}) => {
		const commit = fakeCommit({ message: props.subjectLine })

		describe("and the rule is enabled with a maximum length of 20 characters", () => {
			const actualConcerns = useConciseSubjectLines([commit], enabled20)

			it("raises a concern about the characters that exceed the limit", () => {
				expect(actualConcerns).toEqual<Concerns>([
					subjectLineConcern(rule, commit.sha, { range: props.expectedRange20 }),
				])
			})
		})

		describe("and the rule is enabled with a maximum length of 50 characters", () => {
			const actualConcerns = useConciseSubjectLines([commit], enabled50)

			it("raises a concern about the characters that exceed the limit", () => {
				expect(actualConcerns).toEqual<Concerns>([
					subjectLineConcern(rule, commit.sha, { range: props.expectedRange50 }),
				])
			})
		})

		describe("and the rule is enabled with a maximum length of 72 characters", () => {
			const actualConcerns = useConciseSubjectLines([commit], enabled72)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = useConciseSubjectLines([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe.each`
	subjectLine                                                              | expectedRange20
	${"Make the user interface less chaotic (GH-11) (GL-17)"}                | ${[20, 36]}
	${"<#71238> free up unclaimed disk space"}                               | ${[29, 37]}
	${"#1104: Upgrade rainstormy/updraft in GitHub Actions flows"}           | ${[27, 57]}
	${"`pnpm dlx` is the preferred way now"}                                 | ${[30, 35]}
	${"revisit the boolean properties in the `IceCreamMachine` constructor"} | ${[20, 67]}
	${"Remove redundant call to `wrapper`"}                                  | ${[20, 25]}
	${"Enable `firewall` protection again"}                                  | ${[30, 34]}
	${"(GH-72): fix security vulnerability in `BridgeService`"}              | ${[29, 39]}
	${"Make a smile to the `camera` again"}                                  | ${[28, 34]}
	${"revisit the glorious `MaxDPS` algorithm"}                             | ${[20, 39]}
	${"Squash! Make the program act like a clown"}                           | ${[28, 41]}
`(
	"when the subject line of $subjectLine contains insignificant tokens and still exceeds 20 characters, but not 50 characters",
	(props: { subjectLine: string; expectedRange20: CharacterRange }) => {
		const commit = fakeCommit({ message: props.subjectLine })

		describe("and the rule is enabled with a maximum length of 20 characters", () => {
			const actualConcerns = useConciseSubjectLines([commit], enabled20)

			it("raises a concern about the characters that exceed the limit", () => {
				expect(actualConcerns).toEqual<Concerns>([
					subjectLineConcern(rule, commit.sha, { range: props.expectedRange20 }),
				])
			})
		})

		describe("and the rule is enabled with a maximum length of 50 characters", () => {
			const actualConcerns = useConciseSubjectLines([commit], enabled50)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})

		describe("and the rule is enabled with a maximum length of 72 characters", () => {
			const actualConcerns = useConciseSubjectLines([commit], enabled72)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = useConciseSubjectLines([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe.each`
	subjectLine
	${'Revert "bugfix"'}
	${'Revert "retrieve data from the exclusive third-party service"'}
	${'Revert "Revert "Revert "Fix the nasty bug from yesterday"""'}
	${'fixup! Revert "keep the lowercase story around long enough to exceed the limit"'}
`(
	"when the subject line of $subjectLine contains a revert marker",
	(props: { subjectLine: string }) => {
		const commit = fakeCommit({ message: props.subjectLine })

		describe.each`
			options
			${enabled20}
			${enabled50}
			${enabled72}
		`(
			"and the rule is enabled with a maximum length of $options.maxLength characters",
			(options: RuleOptions<typeof rule>) => {
				const actualConcerns = useConciseSubjectLines([commit], options)

				it("does not raise any concerns", () => {
					expect(actualConcerns).toEqual<Concerns>([])
				})
			},
		)

		describe("and the rule is disabled", () => {
			const actualConcerns = useConciseSubjectLines([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe.each`
	parents                                                | subjectLine
	${[fakeCommitSha(), fakeCommitSha()]}                  | ${"Merge branch 'main' into bugfix/dance-party-playlist"}
	${[fakeCommitSha(), fakeCommitSha(), fakeCommitSha()]} | ${"Keep my branch up to date"}
`(
	"when the commit is a merge commit with $parents.length parents",
	(props: { parents: Array<CommitSha>; subjectLine: string }) => {
		const commit = fakeCommit({ message: props.subjectLine, parents: props.parents })

		describe.each`
			options
			${enabled20}
			${enabled50}
			${enabled72}
		`(
			"and the rule is enabled with a maximum length of $options.maxLength characters",
			(options: RuleOptions<typeof rule>) => {
				const actualConcerns = useConciseSubjectLines([commit], options)

				it("does not raise any concerns", () => {
					expect(actualConcerns).toEqual<Concerns>([])
				})
			},
		)

		describe("and the rule is disabled", () => {
			const actualConcerns = useConciseSubjectLines([commit], null)

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
	${"clean up"}
	${"test"}
	${"Refactor some stuff"}
	${"Move `RapidTransportService` up"}
	${"Upgrade React"}
`(
	"when the subject line of $subjectLine does not exceed 20 characters",
	(props: { subjectLine: string }) => {
		const commit = fakeCommit({ message: props.subjectLine })

		describe.each`
			options
			${enabled20}
			${enabled50}
			${enabled72}
		`(
			"and the rule is enabled with a maximum length of $options.maxLength characters",
			(options: RuleOptions<typeof rule>) => {
				const actualConcerns = useConciseSubjectLines([commit], options)

				it("does not raise any concerns", () => {
					expect(actualConcerns).toEqual<Concerns>([])
				})
			},
		)

		describe("and the rule is disabled", () => {
			const actualConcerns = useConciseSubjectLines([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe("when verifying a set of multiple commits and some commits have long subject lines", () => {
	const commits: Vector<Commit, 12> = [
		fakeCommit({ message: "Retrieve data from the exclusive third-party service" }),
		fakeCommit({ message: "Refactor the taxi module" }),
		fakeCommit({
			message: "Downgrade dependency @opentelemetry/exporter-metrics-otlp-http to 0.100.5-beta.3",
		}),
		fakeCommit({ message: "revisit the boolean properties in the `IceCreamMachine` constructor" }),
		fakeCommit({ message: "test" }),
		fakeCommit({ message: "#728 free up unclaimed disk space" }),
		fakeCommit({ message: "Fix the bug" }),
		fakeCommit({
			message: "Compare the list of items to the objects downloaded from the premium server",
		}),
		fakeCommit({ message: "Unsubscribe from the service" }),
		fakeCommit({ message: "fixup! Unsubscribe from the service" }),
		fakeCommit({
			message:
				"Upgrade `rainstormy/github-action-validate-commit-messages in GitHub Actions` to the newest version",
		}),
		fakeCommit({
			message: "make a genuine attempt to fix the bugs that the users were complaining about",
		}),
	]

	describe("and the rule is enabled with a maximum length of 20 characters", () => {
		const actualConcerns = useConciseSubjectLines(commits, enabled20)

		it("raises concerns about the commits whose subject lines exceed 20 characters", () => {
			expect(actualConcerns).toEqual<Concerns>([
				subjectLineConcern(rule, commits[0].sha, { range: [20, 52] }),
				subjectLineConcern(rule, commits[1].sha, { range: [20, 24] }),
				subjectLineConcern(rule, commits[3].sha, { range: [20, 67] }),
				subjectLineConcern(rule, commits[5].sha, { range: [25, 33] }),
				subjectLineConcern(rule, commits[7].sha, { range: [20, 75] }),
				subjectLineConcern(rule, commits[8].sha, { range: [20, 28] }),
				subjectLineConcern(rule, commits[9].sha, { range: [27, 35] }),
				subjectLineConcern(rule, commits[10].sha, { range: [89, 99] }),
				subjectLineConcern(rule, commits[11].sha, { range: [20, 76] }),
			])
		})
	})

	describe("and the rule is enabled with a maximum length of 50 characters", () => {
		const actualConcerns = useConciseSubjectLines(commits, enabled50)

		it("raises concerns about the commits whose subject lines exceed 50 characters", () => {
			expect(actualConcerns).toEqual<Concerns>([
				subjectLineConcern(rule, commits[0].sha, { range: [50, 52] }),
				subjectLineConcern(rule, commits[7].sha, { range: [50, 75] }),
				subjectLineConcern(rule, commits[11].sha, { range: [50, 76] }),
			])
		})
	})

	describe("and the rule is enabled with a maximum length of 72 characters", () => {
		const actualConcerns = useConciseSubjectLines(commits, enabled72)

		it("raises concerns about the commits whose subject lines exceed 72 characters", () => {
			expect(actualConcerns).toEqual<Concerns>([
				subjectLineConcern(rule, commits[7].sha, { range: [72, 75] }),
				subjectLineConcern(rule, commits[11].sha, { range: [72, 76] }),
			])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = useConciseSubjectLines(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})

describe("when verifying a set of multiple commits and all commits have concise subject lines", () => {
	const commits: Vector<Commit, 4> = [
		fakeCommit({ message: "Fix the bug (GH-27)" }),
		fakeCommit({ message: "#41: Refactor the factory" }),
		fakeCommit({ message: "Upgrade Vitest to 4.1.2" }),
		fakeCommit({ message: "Subscribe to the `RapidTransportService`" }),
	]

	describe.each`
		options
		${enabled20}
		${enabled50}
		${enabled72}
	`(
		"and the rule is enabled with a maximum length of $options.maxLength characters",
		(options: RuleOptions<typeof rule>) => {
			const actualConcerns = useConciseSubjectLines(commits, options)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		},
	)

	describe("and the rule is disabled", () => {
		const actualConcerns = useConciseSubjectLines(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})
