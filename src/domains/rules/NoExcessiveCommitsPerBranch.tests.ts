import { describe, expect, it } from "vitest"
import { fakeCommitFactory } from "#commits/Commit.fixtures.ts"
import type { Commit } from "#commits/Commit.ts"
import { commitConcern } from "#rules/concerns/CommitConcern.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import { noExcessiveCommitsPerBranch } from "#rules/NoExcessiveCommitsPerBranch.ts"
import type { RuleKey, RuleOptions } from "#rules/Rule.ts"
import { fakeCommitSha } from "#types/CommitSha.fixtures.ts"
import type { Vector } from "#types/Vector.ts"

const rule = "noExcessiveCommitsPerBranch" satisfies RuleKey
const enabled3: RuleOptions<typeof rule> = { maxCommits: 3 }
const enabled10: RuleOptions<typeof rule> = { maxCommits: 10 }

const fakeCommit = fakeCommitFactory()

describe("when verifying a set of 6 commits when up to 3 commits are allowed", () => {
	const commits: Vector<Commit, 6> = [
		fakeCommit({ message: "Open the bakery dashboard" }),
		fakeCommit({ message: "Add the cinnamon telemetry" }),
		fakeCommit({ message: "Wire the oat milk alert" }),
		fakeCommit({ message: "fix the suspicious croissant counter" }),
		fakeCommit({ message: "refactor the jam queue" }),
		fakeCommit({ message: "Test the emergency toaster" }),
	]

	describe("and the rule is enabled", () => {
		const actualConcerns = noExcessiveCommitsPerBranch(commits, enabled3)

		it("raises concerns about commits 4-6", () => {
			expect(actualConcerns).toEqual<Concerns>([
				commitConcern(rule, commits[3].sha),
				commitConcern(rule, commits[4].sha),
				commitConcern(rule, commits[5].sha),
			])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = noExcessiveCommitsPerBranch(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})

describe("when verifying a set of 3 commits when up to 3 commits are allowed", () => {
	const commits: Vector<Commit, 3> = [
		fakeCommit({ message: "Replace guesswork with a tiny chart" }),
		fakeCommit({ message: "Teach the kettle to apologise" }),
		fakeCommit({ message: "Document the spooky button" }),
	]

	describe("and the rule is enabled", () => {
		const actualConcerns = noExcessiveCommitsPerBranch(commits, enabled3)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = noExcessiveCommitsPerBranch(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})

describe("when verifying a set of 1 commit when up to 3 commits are allowed", () => {
	const commits: Vector<Commit, 1> = [fakeCommit({ message: "label the mystery switch" })]

	describe("and the rule is enabled", () => {
		const actualConcerns = noExcessiveCommitsPerBranch(commits, enabled3)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = noExcessiveCommitsPerBranch(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})

describe("when verifying a set of 12 commits when up to 10 commits are allowed", () => {
	const commits: Vector<Commit, 12> = [
		fakeCommit({ message: "Open the emergency snack drawer" }),
		fakeCommit({ message: "Close the emergency snack drawer" }),
		fakeCommit({ message: "inventory the secret biscuit shelf" }),
		fakeCommit({ message: "Name the suspicious toggle" }),
		fakeCommit({ message: "Install the typo detector" }),
		fakeCommit({ message: "Train the queue to wait politely" }),
		fakeCommit({ message: "sort the dashboard mittens" }),
		fakeCommit({ message: "Dust the release checklist" }),
		fakeCommit({ message: "Label the pocket calculator" }),
		fakeCommit({ message: "Patch the waffle endpoint" }),
		fakeCommit({ message: "rebalance the pastry index" }),
		fakeCommit({ message: "test the emergency toaster again" }),
	]

	describe("and the rule is enabled", () => {
		const actualConcerns = noExcessiveCommitsPerBranch(commits, enabled10)

		it("raises concerns about commits 11-12", () => {
			expect(actualConcerns).toEqual<Concerns>([
				commitConcern(rule, commits[10].sha),
				commitConcern(rule, commits[11].sha),
			])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = noExcessiveCommitsPerBranch(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})

describe("when verifying a set of 10 commits when up to 10 commits are allowed", () => {
	const commits: Vector<Commit, 10> = [
		fakeCommit({ message: "Replace guesswork with a tiny chart" }),
		fakeCommit({ message: "Teach the kettle to apologise" }),
		fakeCommit({ message: "Document the spooky button" }),
		fakeCommit({ message: "shrink the noisy diff" }),
		fakeCommit({ message: "Invite the parser to brunch" }),
		fakeCommit({ message: "mend the build badge" }),
		fakeCommit({ message: "Adjust the polite timeout" }),
		fakeCommit({ message: "Archive the sleepy migration" }),
		fakeCommit({ message: "Untangle the ribbon config" }),
		fakeCommit({ message: "tidy the peanut gallery" }),
	]

	describe("and the rule is enabled", () => {
		const actualConcerns = noExcessiveCommitsPerBranch(commits, enabled10)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = noExcessiveCommitsPerBranch(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})

describe("when verifying a set of 4 commits when up to 10 commits are allowed", () => {
	const commits: Vector<Commit, 4> = [
		fakeCommit({ message: "label the mystery switch" }),
		fakeCommit({ message: "make the release notes less dramatic" }),
		fakeCommit({ message: "Invite the parser to brunch" }),
		fakeCommit({ message: "mend the build badge" }),
	]

	describe("and the rule is enabled", () => {
		const actualConcerns = noExcessiveCommitsPerBranch(commits, enabled10)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = noExcessiveCommitsPerBranch(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})

describe("when verifying a set of 6 commits when up to 3 commits are allowed and some commits are merge commits", () => {
	const commits: Vector<Commit, 6> = [
		fakeCommit({ message: "Map the odd socks drawer" }),
		fakeCommit({
			parents: [fakeCommitSha(), fakeCommitSha()],
			message: "Merge branch 'main' into feature/odd-socks",
		}),
		fakeCommit({ message: "Add the cardigan forecast" }),
		fakeCommit({
			parents: [fakeCommitSha(), fakeCommitSha(), fakeCommitSha()],
			message: "Keep the branch vaguely current",
		}),
		fakeCommit({ message: "tune the lint whistle" }),
		fakeCommit({ message: "Polish the biscuit dashboard" }),
	]

	describe("and the rule is enabled", () => {
		const actualConcerns = noExcessiveCommitsPerBranch(commits, enabled3)

		it("ignores merge commits when determining excessive commits", () => {
			expect(actualConcerns).toEqual<Concerns>([commitConcern(rule, commits[5].sha)])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = noExcessiveCommitsPerBranch(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})

describe("when verifying a set of 8 commits when up to 3 commits are allowed and some commits have squash markers", () => {
	const commits: Vector<Commit, 8> = [
		fakeCommit({ message: "Teach the calendar to blink" }),
		fakeCommit({ message: "fixup! Teach the calendar to blink" }),
		fakeCommit({ message: "Replace the mysterious toggle" }),
		fakeCommit({ message: "this commit is a lie" }),
		fakeCommit({ message: "Document the noodle switch" }),
		fakeCommit({ message: " squash!  fixup! make the tests less theatrical" }),
		fakeCommit({ message: "Calm down the invoice parser" }),
		fakeCommit({ message: "I must have been drunk" }),
	]

	describe("and the rule is enabled", () => {
		const actualConcerns = noExcessiveCommitsPerBranch(commits, enabled3)

		it("ignores commits with squash markers when determining excessive commits", () => {
			expect(actualConcerns).toEqual<Concerns>([
				commitConcern(rule, commits[4].sha),
				commitConcern(rule, commits[6].sha),
				commitConcern(rule, commits[7].sha),
			])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = noExcessiveCommitsPerBranch(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})
