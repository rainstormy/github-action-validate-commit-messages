import { describe, expect, it } from "vitest"
import { fakeCommitFactory } from "#commits/Commit.fixtures.ts"
import type { Commit } from "#commits/Commit.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import { userIdentityConcern } from "#rules/concerns/UserIdentityConcern.ts"
import type { RuleKey, RuleOptions } from "#rules/Rule.ts"
import { useCommitterNamePatterns } from "#rules/UseCommitterNamePatterns.ts"
import type { Vector } from "#types/Vector.ts"

const rule = "useCommitterNamePatterns" satisfies RuleKey
const enabled: RuleOptions<typeof rule> = {
	patterns: [
		String.raw`\p{Lu}.*\s.+`,
		String.raw`dependabot\[bot\]`,
		String.raw`renovate\[bot\]`,
		String.raw`GitHub`,
	],
}

const fakeCommit = fakeCommitFactory()

describe.each`
	committerName
	${""}
	${" "}
	${"\t\t"}
	${"master splinter"}
	${"Santa.claus"}
	${"Leonardo"}
	${"  Santa Claus  "}
	${"dependabot"}
	${"renovate[bot"}
	${"github"}
`(
	"when the committer's name of $committerName does not satisfy any of the accepted patterns",
	(props: { committerName: string }) => {
		const commit = fakeCommit({ committerName: props.committerName })

		describe("and the rule is enabled", () => {
			const actualConcerns = useCommitterNamePatterns([commit], enabled)

			it("raises a concern about the committer's name", () => {
				expect(actualConcerns).toEqual<Concerns>([
					userIdentityConcern(rule, commit.sha, { field: "committer:name" }),
				])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = useCommitterNamePatterns([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe.each`
	committerName
	${"Santa Claus"}
	${"The Little Mermaid"}
	${"Leonardo da Vinci"}
	${"Jeanne d'Arc"}
	${"Master Splinter"}
	${"dependabot[bot]"}
	${"renovate[bot]"}
	${"GitHub"}
`(
	"when the committer's name of $committerName satisfies some accepted pattern",
	(props: { committerName: string }) => {
		const commit = fakeCommit({ committerName: props.committerName })

		describe("and the rule is enabled", () => {
			const actualConcerns = useCommitterNamePatterns([commit], enabled)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = useCommitterNamePatterns([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe("when verifying a set of multiple commits and some commits have committer names that do not satisfy any of the accepted patterns", () => {
	const commits: Vector<Commit, 7> = [
		fakeCommit({ committerName: "santa claus" }),
		fakeCommit({ committerName: "Bebop" }),
		fakeCommit({ committerName: "Jeanne d'Arc" }),
		fakeCommit({ committerName: "Santa Claus" }),
		fakeCommit({ committerName: "dependabot" }),
		fakeCommit({ committerName: "Master Splinter" }),
		fakeCommit({ committerName: "dependabot[bot]" }),
	]

	describe("and the rule is enabled", () => {
		const actualConcerns = useCommitterNamePatterns(commits, enabled)

		it("raises concerns about the commits with invalid committer names", () => {
			expect(actualConcerns).toEqual<Concerns>([
				userIdentityConcern(rule, commits[0].sha, { field: "committer:name" }),
				userIdentityConcern(rule, commits[1].sha, { field: "committer:name" }),
				userIdentityConcern(rule, commits[4].sha, { field: "committer:name" }),
			])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = useCommitterNamePatterns(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})

describe("when verifying a set of multiple commits and all commits have committer names that satisfy some accepted pattern", () => {
	const commits: Vector<Commit, 5> = [
		fakeCommit({ committerName: "Santa Claus" }),
		fakeCommit({ committerName: "Leonardo da Vinci" }),
		fakeCommit({ committerName: "Jeanne d'Arc" }),
		fakeCommit({ committerName: "Master Splinter" }),
		fakeCommit({ committerName: "renovate[bot]" }),
	]

	describe("and the rule is enabled", () => {
		const actualConcerns = useCommitterNamePatterns(commits, enabled)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = useCommitterNamePatterns(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})
