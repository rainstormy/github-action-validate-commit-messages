import { describe, expect, it } from "vitest"
import { fakeCommitFactory } from "#commits/Commit.fixtures.ts"
import type { Commit } from "#commits/Commit.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import { userIdentityConcern } from "#rules/concerns/UserIdentityConcern.ts"
import type { RuleKey, RuleOptions } from "#rules/Rule.ts"
import { useAuthorEmailPatterns } from "#rules/UseAuthorEmailPatterns.ts"
import type { Vector } from "#types/Vector.ts"

const rule = "useAuthorEmailPatterns" satisfies RuleKey
const enabled: RuleOptions<typeof rule> = {
	patterns: [String.raw`\d+\+.+@users\.noreply\.github\.com`, String.raw`.+@fictivecompany\.com`],
}

const fakeCommit = fakeCommitFactory()

describe.each`
	authorEmail
	${""}
	${" "}
	${"\t\t"}
	${"claus@santasworkshop.com"}
	${"12345678+unicorn@github.com"}
	${"bunny@theeastercompany.com"}
	${"  tmnt@fastforward.com "}
	${"baxter.stockman@fastforward.com"}
	${"  scl@fictivecompany.com  "}
`(
	"when the author's email address of $authorEmail does not satisfy any of the accepted patterns",
	(props: { authorEmail: string }) => {
		const commit = fakeCommit({ authorEmail: props.authorEmail })

		describe("and the rule is enabled", () => {
			const actualConcerns = useAuthorEmailPatterns([commit], enabled)

			it("raises a concern about the author's email address", () => {
				expect(actualConcerns).toEqual<Concerns>([
					userIdentityConcern(rule, commit.sha, { field: "author:email" }),
				])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = useAuthorEmailPatterns([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe.each`
	authorEmail
	${"12345678+santaclaus@users.noreply.github.com"}
	${"87654321+littlemermaid@users.noreply.github.com"}
	${"25199993+noname@users.noreply.github.com"}
	${"scl@fictivecompany.com"}
	${"lme@fictivecompany.com"}
`(
	"when the author's email address of $authorEmail satisfies some accepted pattern",
	(props: { authorEmail: string }) => {
		const commit = fakeCommit({ authorEmail: props.authorEmail })

		describe("and the rule is enabled", () => {
			const actualConcerns = useAuthorEmailPatterns([commit], enabled)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = useAuthorEmailPatterns([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe("when verifying a set of multiple commits and some commits have author email addresses that do not satisfy any of the accepted patterns", () => {
	const commits: Vector<Commit, 7> = [
		fakeCommit({ authorEmail: "" }),
		fakeCommit({ authorEmail: "bunny@theeastercompany.com" }),
		fakeCommit({ authorEmail: "25199993+noname@users.noreply.github.com" }),
		fakeCommit({ authorEmail: "op@fictivecompany.com" }),
		fakeCommit({ authorEmail: "  tmnt@fastforward.com " }),
		fakeCommit({ authorEmail: "claus@santasworkshop.com" }),
		fakeCommit({ authorEmail: "hello@fictivecompany.com" }),
	]

	describe("and the rule is enabled", () => {
		const actualConcerns = useAuthorEmailPatterns(commits, enabled)

		it("raises concerns about the commits with invalid author email addresses", () => {
			expect(actualConcerns).toEqual<Concerns>([
				userIdentityConcern(rule, commits[0].sha, { field: "author:email" }),
				userIdentityConcern(rule, commits[1].sha, { field: "author:email" }),
				userIdentityConcern(rule, commits[4].sha, { field: "author:email" }),
				userIdentityConcern(rule, commits[5].sha, { field: "author:email" }),
			])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = useAuthorEmailPatterns(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})

describe("when verifying a set of multiple commits and all commits have author email addresses that satisfy some accepted pattern", () => {
	const commits: Vector<Commit, 5> = [
		fakeCommit({ authorEmail: "12345678+santaclaus@users.noreply.github.com" }),
		fakeCommit({ authorEmail: "87654321+littlemermaid@users.noreply.github.com" }),
		fakeCommit({ authorEmail: "25199993+noname@users.noreply.github.com" }),
		fakeCommit({ authorEmail: "scl@fictivecompany.com" }),
		fakeCommit({ authorEmail: "lme@fictivecompany.com" }),
	]

	describe("and the rule is enabled", () => {
		const actualConcerns = useAuthorEmailPatterns(commits, enabled)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = useAuthorEmailPatterns(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})
