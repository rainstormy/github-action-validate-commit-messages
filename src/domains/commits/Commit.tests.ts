import { describe, expect, it } from "vitest"
import type { BodyLines } from "#commits/BodyLine.ts"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import type { SubjectLine } from "#commits/SubjectLine.ts"
import { getDefaultConfiguration } from "#configurations/GetDefaultConfiguration.ts"
import { fakeCommitSha } from "#types/CommitSha.fixtures.ts"
import type { CommitSha } from "#types/CommitSha.ts"

describe("in the default configuration", () => {
	const configuration = getDefaultConfiguration()

	describe.each`
		sha
		${fakeCommitSha()}
		${fakeCommitSha()}
	`("when the commit SHA is $sha", (props: { sha: CommitSha }) => {
		const crudeCommit = fakeCrudeCommit({ sha: props.sha })

		it("preserves the commit SHA", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.sha).toBe(props.sha)
		})
	})

	describe("when the commit has no parents", () => {
		const crudeCommit = fakeCrudeCommit({ parents: [] })

		it("is not a merge commit", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.isMergeCommit).toBe(false)
		})
	})

	describe("when the commit has one parent", () => {
		const crudeCommit = fakeCrudeCommit({ parents: [fakeCommitSha()] })

		it("is not a merge commit", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.isMergeCommit).toBe(false)
		})
	})

	describe("when the commit has two parents", () => {
		const crudeCommit = fakeCrudeCommit({
			parents: [fakeCommitSha(), fakeCommitSha()],
		})

		it("is a merge commit", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.isMergeCommit).toBe(true)
		})
	})

	describe("when the commit has three parents", () => {
		const crudeCommit = fakeCrudeCommit({
			parents: [fakeCommitSha(), fakeCommitSha(), fakeCommitSha()],
		})

		it("is a merge commit", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.isMergeCommit).toBe(true)
		})
	})

	describe.each`
		authorName
		${"tmnt"}
		${"renovate[bot]"}
		${"Nimbus (Bot)"}
	`(
		"when the author's name is $authorName",
		(props: { authorName: string }) => {
			const crudeCommit = fakeCrudeCommit({
				authorName: props.authorName,
			})

			it("preserves the author's name", () => {
				const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
				expect(commit.authorName).toBe(props.authorName)
			})
		},
	)

	describe.each`
		authorEmail
		${"tmnt@fastforward.com"}
		${"29139614+renovate[bot]@users.noreply.github.com"}
		${"146315497+rainstormybot-nimbus@users.noreply.github.com"}
	`(
		"when the author's email address is $authorEmail",
		(props: { authorEmail: string }) => {
			const crudeCommit = fakeCrudeCommit({
				authorEmail: props.authorEmail,
			})

			it("preserves the author's email address", () => {
				const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
				expect(commit.authorEmail).toBe(props.authorEmail)
			})
		},
	)

	describe.each`
		committerName
		${"baxter.stockman"}
		${"GitHub"}
		${"Michelangelo di Lodovico Buonarroti Simoni"}
	`(
		"when the committer's name is $committerName",
		(props: { committerName: string }) => {
			const crudeCommit = fakeCrudeCommit({
				committerName: props.committerName,
			})

			it("preserves the committer's name", () => {
				const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
				expect(commit.committerName).toBe(props.committerName)
			})
		},
	)

	describe.each`
		committerEmail
		${"baxter.stockman@fastforward.com"}
		${"noreply@github.com"}
		${"28317649+cowabunga@users.noreply.github.com"}
	`(
		"when the committer's email address is $committerEmail",
		(props: { committerEmail: string }) => {
			const crudeCommit = fakeCrudeCommit({
				committerEmail: props.committerEmail,
			})

			it("preserves the committer's email address", () => {
				const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
				expect(commit.committerEmail).toBe(props.committerEmail)
			})
		},
	)

	describe("when the commit message is empty", () => {
		const crudeCommit = fakeCrudeCommit({ message: "" })

		it("has an empty subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual<SubjectLine>([])
		})

		it("has no body lines", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual<BodyLines>([])
		})
	})

	describe("when the commit message has a single line", () => {
		const crudeCommit = fakeCrudeCommit({ message: "refactor the taxi module" })

		it("has a tokenised subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual<SubjectLine>([
				"refactor the taxi module",
			])
		})

		it("has no body lines", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual<BodyLines>([])
		})
	})

	describe("when the commit message has 2 blank lines", () => {
		const crudeCommit = fakeCrudeCommit({ message: " \n " })

		it("has a blank tokenised subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual<SubjectLine>([" "])
		})

		it("has 1 blank tokenised body line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual<BodyLines>([[" "]])
		})
	})

	describe("when the commit message has a subject line and 1 empty line", () => {
		const crudeCommit = fakeCrudeCommit({
			message: "Fix this confusing plate of spaghetti\n",
		})

		it("has a tokenised subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual<SubjectLine>([
				"Fix this confusing plate of spaghetti",
			])
		})

		it("has 1 empty body line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual<BodyLines>([[]])
		})
	})

	describe("when the commit message has a subject line and 1 body line", () => {
		const crudeCommit = fakeCrudeCommit({
			message:
				"Apply strawberry jam to make the code sweeter\nSweetness went to a 8 out of 10, as we held back a bit to avoid turning the code diabetic.",
		})

		it("has a tokenised subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual<SubjectLine>([
				"Apply strawberry jam to make the code sweeter",
			])
		})

		it("has 1 tokenised body line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual<BodyLines>([
				[
					"Sweetness went to a 8 out of 10, as we held back a bit to avoid turning the code diabetic.",
				],
			])
		})
	})

	describe("when the commit message has a subject line, 1 empty line, and 1 body line", () => {
		const crudeCommit = fakeCrudeCommit({
			message:
				"  added some extra love to the code\n\nThe architecture is much more flexible now.",
		})

		it("has a tokenised subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual<SubjectLine>([
				"  added some extra love to the code",
			])
		})

		it("has 1 empty body line and 1 tokenised body line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual<BodyLines>([
				[],
				["The architecture is much more flexible now."],
			])
		})
	})

	describe("when the commit message has a subject line and 2 body lines", () => {
		const crudeCommit = fakeCrudeCommit({
			message:
				"Upgrade dependencies\nThis commit upgrades the following dependency:\n- `@types/node` from 20.19.20 to 20.19.23",
		})

		it("has a tokenised subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual<SubjectLine>(["Upgrade dependencies"])
		})

		it("has 2 tokenised body lines", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual<BodyLines>([
				["This commit upgrades the following dependency:"],
				["- `@types/node` from 20.19.20 to 20.19.23"],
			])
		})
	})

	describe("when the commit message has a subject line, 1 empty line, and 3 body lines", () => {
		const crudeCommit = fakeCrudeCommit({
			message:
				"Clean up to improve maintainability\n\nThis commit removes unnecessary nesting.\nIt also simplifies variable names.\nFinally, it adds more tests.",
		})

		it("has a tokenised subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual<SubjectLine>([
				"Clean up to improve maintainability",
			])
		})

		it("has 1 empty body line and 3 tokenised body lines", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual<BodyLines>([
				[],
				["This commit removes unnecessary nesting."],
				["It also simplifies variable names."],
				["Finally, it adds more tests."],
			])
		})
	})

	describe("when the commit message has a subject line, 3 body lines, 1 empty line, and 2 more body lines", () => {
		const crudeCommit = fakeCrudeCommit({
			message:
				"Release the robot butler\nIt will serve coffee.\nIt will make jokes.\nIt will clean the codebase.\n\nPlease be kind to the robot.\nDo not spill coffee on it.",
		})

		it("has a tokenised subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual<SubjectLine>([
				"Release the robot butler",
			])
		})

		it("has 3 tokenised body lines, 1 empty body line, and 2 more tokenised body lines", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual<BodyLines>([
				["It will serve coffee."],
				["It will make jokes."],
				["It will clean the codebase."],
				[],
				["Please be kind to the robot."],
				["Do not spill coffee on it."],
			])
		})
	})

	describe("when the commit message has a subject line, 2 empty lines, and 1 body line", () => {
		const crudeCommit = fakeCrudeCommit({
			message:
				"Make the commit scream fixup! again\n\n\nThis commit renames a variable.",
		})

		it("has a tokenised subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual<SubjectLine>([
				"Make the commit scream fixup! again",
			])
		})

		it("has 2 empty body lines and 1 tokenised body line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual<BodyLines>([
				[],
				[],
				["This commit renames a variable."],
			])
		})
	})

	describe("when the commit message has a subject line, 1 body line, 1 empty line, 4 more body lines, and 1 more empty line", () => {
		const crudeCommit = fakeCrudeCommit({
			message:
				"Do some pair programming\nThis commit is a collab.\n\nCo-authored-by: Gon Freecss <rock.paper.scissors@hunters.com>\nCo-authored-by: Killua Zoldyck <killua@godspeed.net>\nReported-by: Hisoka <no4@phantom.com>\nAll participants had fun.\n",
		})

		it("has a tokenised subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual<SubjectLine>([
				"Do some pair programming",
			])
		})

		it("has 1 tokenised body line, 1 empty body line, 4 tokenised body lines, and 1 trailing empty body line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual<BodyLines>([
				["This commit is a collab."],
				[],
				["Co-authored-by: Gon Freecss <rock.paper.scissors@hunters.com>"],
				["Co-authored-by: Killua Zoldyck <killua@godspeed.net>"],
				["Reported-by: Hisoka <no4@phantom.com>"],
				["All participants had fun."],
				[],
			])
		})
	})

	describe("when the commit message has a subject line, 1 empty line, 2 body lines, 1 more empty line, 3 more body lines, and 1 more empty line", () => {
		const crudeCommit = fakeCrudeCommit({
			message:
				"Make the code go brrr with fancy updates\n\nThis commit makes the hamsters run faster.\nUpgraded their tiny running wheels.\n\nAdded rocket fuel to hamster food.\nInstalled nitro boosters on wheels.\nNow they're breaking the speed limit.\n",
		})

		it("has a tokenised subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual<SubjectLine>([
				"Make the code go brrr with fancy updates",
			])
		})

		it("has the expected mix of empty and tokenised body lines", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual<BodyLines>([
				[],
				["This commit makes the hamsters run faster."],
				["Upgraded their tiny running wheels."],
				[],
				["Added rocket fuel to hamster food."],
				["Installed nitro boosters on wheels."],
				["Now they're breaking the speed limit."],
				[],
			])
		})
	})
})
