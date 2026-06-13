import { describe, expect, it } from "vitest"
import { fakeCommitFactory } from "#commits/Commit.fixtures.ts"
import type { Commit } from "#commits/Commit.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import { userIdentityConcern } from "#rules/concerns/UserIdentityConcern.ts"
import type { RuleKey, RuleOptions } from "#rules/Rule.ts"
import { useCommitterEmailPatterns } from "#rules/UseCommitterEmailPatterns.ts"
import type { Vector } from "#types/Vector.ts"

const rule = "useCommitterEmailPatterns" satisfies RuleKey
const enabled: RuleOptions<typeof rule> = {
	patterns: [
		String.raw`\d+\+.+@users\.noreply\.github\.com`,
		String.raw`noreply@github\.com`,
		String.raw`.+@fastforward\.com`,
	],
}

const fakeCommit = fakeCommitFactory()

describe.each`
	committerEmail
	${""}
	${" "}
	${"\t\t"}
	${"claus@santasworkshop.com"}
	${"12345678+unicorn@github.com"}
	${"bunny@theeastercompany.com"}
	${"  tmnt@fastforward.com "}
	${"baxter.stockman@tmnt.com"}
	${"  scl@fictivecompany.com  "}
`(
	"when the committer's email address of $committerEmail does not satisfy any of the accepted patterns",
	(props: { committerEmail: string }) => {
		const commit = fakeCommit({ committerEmail: props.committerEmail })

		describe("and the rule is enabled", () => {
			const actualConcerns = useCommitterEmailPatterns([commit], enabled)

			it("raises a concern about the committer's email address", () => {
				expect(actualConcerns).toEqual<Concerns>([
					userIdentityConcern(rule, commit.sha, { field: "committer:email" }),
				])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = useCommitterEmailPatterns([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe.each`
	committerEmail
	${"12345678+santaclaus@users.noreply.github.com"}
	${"87654321+littlemermaid@users.noreply.github.com"}
	${"25199993+noname@users.noreply.github.com"}
	${"noreply@github.com"}
	${"april.oneil@fastforward.com"}
	${"cj@fastforward.com"}
`(
	"when the committer's email address of $committerEmail satisfies some accepted pattern",
	(props: { committerEmail: string }) => {
		const commit = fakeCommit({ committerEmail: props.committerEmail })

		describe("and the rule is enabled", () => {
			const actualConcerns = useCommitterEmailPatterns([commit], enabled)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = useCommitterEmailPatterns([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe("when verifying a set of multiple commits and some commits have committer email addresses that do not satisfy any of the accepted patterns", () => {
	const commits: Vector<Commit, 7> = [
		fakeCommit({ committerEmail: "" }),
		fakeCommit({ committerEmail: "bunny@theeastercompany.com" }),
		fakeCommit({ committerEmail: "25199993+noname@users.noreply.github.com" }),
		fakeCommit({ committerEmail: "  op@fastforward.com  " }),
		fakeCommit({ committerEmail: "tmnt@fastforward.com" }),
		fakeCommit({ committerEmail: "claus@santasworkshop.com" }),
		fakeCommit({ committerEmail: "hello@fictivecompany.com" }),
	]

	describe("and the rule is enabled", () => {
		const actualConcerns = useCommitterEmailPatterns(commits, enabled)

		it("raises concerns about the commits with invalid committer email addresses", () => {
			expect(actualConcerns).toEqual<Concerns>([
				userIdentityConcern(rule, commits[0].sha, { field: "committer:email" }),
				userIdentityConcern(rule, commits[1].sha, { field: "committer:email" }),
				userIdentityConcern(rule, commits[3].sha, { field: "committer:email" }),
				userIdentityConcern(rule, commits[5].sha, { field: "committer:email" }),
				userIdentityConcern(rule, commits[6].sha, { field: "committer:email" }),
			])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = useCommitterEmailPatterns(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})

describe("when verifying a set of multiple commits and all commits have committer email addresses that satisfy some accepted pattern", () => {
	const commits: Vector<Commit, 6> = [
		fakeCommit({ committerEmail: "12345678+santaclaus@users.noreply.github.com" }),
		fakeCommit({ committerEmail: "87654321+littlemermaid@users.noreply.github.com" }),
		fakeCommit({ committerEmail: "25199993+noname@users.noreply.github.com" }),
		fakeCommit({ committerEmail: "noreply@github.com" }),
		fakeCommit({ committerEmail: "april.oneil@fastforward.com" }),
		fakeCommit({ committerEmail: "cj@fastforward.com" }),
	]

	describe("and the rule is enabled", () => {
		const actualConcerns = useCommitterEmailPatterns(commits, enabled)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = useCommitterEmailPatterns(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})
