import { describe, expect, it } from "vitest"
import { fakeCommitFactory } from "#commits/Commit.fixtures.ts"
import type { Commit } from "#commits/Commit.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import { userIdentityConcern } from "#rules/concerns/UserIdentityConcern.ts"
import type { RuleKey, RuleOptions } from "#rules/Rule.ts"
import { useAuthorNamePatterns } from "#rules/UseAuthorNamePatterns.ts"
import type { Vector } from "#types/Vector.ts"

const rule = "useAuthorNamePatterns" satisfies RuleKey
const enabled: RuleOptions<typeof rule> = {
	patterns: [String.raw`\p{Lu}.*\s.+`, String.raw`dependabot\[bot\]`, String.raw`renovate\[bot\]`],
}

const fakeCommit = fakeCommitFactory()

describe.each`
	authorName
	${""}
	${" "}
	${"\t\t"}
	${"santa claus"}
	${"Santa.claus"}
	${"Jeanne"}
	${"  Santa Claus  "}
	${"dependabot"}
	${"renovate"}
`(
	"when the author's name of $authorName does not satisfy any of the accepted patterns",
	(props: { authorName: string }) => {
		const commit = fakeCommit({ authorName: props.authorName })

		describe("and the rule is enabled", () => {
			const actualConcerns = useAuthorNamePatterns([commit], enabled)

			it("raises a concern about the author's name", () => {
				expect(actualConcerns).toEqual<Concerns>([
					userIdentityConcern(rule, commit.sha, { field: "author:name" }),
				])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = useAuthorNamePatterns([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe.each`
	authorName
	${"Santa Claus"}
	${"The Little Mermaid"}
	${"Jeanne d'Arc"}
	${"Master Splinter"}
	${"dependabot[bot]"}
	${"renovate[bot]"}
`(
	"when the author's name of $authorName satisfies some accepted pattern",
	(props: { authorName: string }) => {
		const commit = fakeCommit({ authorName: props.authorName })

		describe("and the rule is enabled", () => {
			const actualConcerns = useAuthorNamePatterns([commit], enabled)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = useAuthorNamePatterns([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe("when verifying a set of multiple commits and some commits have author names that do not satisfy any of the accepted patterns", () => {
	const commits: Vector<Commit, 7> = [
		fakeCommit({ authorName: "santa claus" }),
		fakeCommit({ authorName: "Bebop" }),
		fakeCommit({ authorName: "Jeanne d'Arc" }),
		fakeCommit({ authorName: "Santa Claus" }),
		fakeCommit({ authorName: "renovate" }),
		fakeCommit({ authorName: "Master Splinter" }),
		fakeCommit({ authorName: "dependabot[bot]" }),
	]

	describe("and the rule is enabled", () => {
		const actualConcerns = useAuthorNamePatterns(commits, enabled)

		it("raises concerns about the commits with invalid author names", () => {
			expect(actualConcerns).toEqual<Concerns>([
				userIdentityConcern(rule, commits[0].sha, { field: "author:name" }),
				userIdentityConcern(rule, commits[1].sha, { field: "author:name" }),
				userIdentityConcern(rule, commits[4].sha, { field: "author:name" }),
			])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = useAuthorNamePatterns(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})

describe("when verifying a set of multiple commits and all commits have author names that satisfy some accepted pattern", () => {
	const commits: Vector<Commit, 5> = [
		fakeCommit({ authorName: "Santa Claus" }),
		fakeCommit({ authorName: "The Little Mermaid" }),
		fakeCommit({ authorName: "Jeanne d'Arc" }),
		fakeCommit({ authorName: "Master Splinter" }),
		fakeCommit({ authorName: "dependabot[bot]" }),
	]

	describe("and the rule is enabled", () => {
		const actualConcerns = useAuthorNamePatterns(commits, enabled)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = useAuthorNamePatterns(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})
