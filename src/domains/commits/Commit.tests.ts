import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { punctuation } from "#commits/tokens/PunctuationToken.ts"
import type { TokenisedLine, TokenisedLines } from "#commits/tokens/Token.ts"
import { whitespace } from "#commits/tokens/WhitespaceToken.ts"
import { word } from "#commits/tokens/WordToken.ts"
import { fakeTokenConfiguration } from "#configurations/Configuration.fixtures.ts"
import { fakeCommitSha } from "#types/CommitSha.fixtures.ts"
import type { CommitSha } from "#types/CommitSha.ts"

const configuration = fakeTokenConfiguration()

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
	const crudeCommit = fakeCrudeCommit({ parents: [fakeCommitSha(), fakeCommitSha()] })

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
`("when the author's name is $authorName", (props: { authorName: string }) => {
	const crudeCommit = fakeCrudeCommit({ authorName: props.authorName })

	it("preserves the author's name", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.authorName).toBe(props.authorName)
	})
})

describe.each`
	authorEmail
	${"tmnt@fastforward.com"}
	${"29139614+renovate[bot]@users.noreply.github.com"}
	${"146315497+rainstormybot-nimbus@users.noreply.github.com"}
`("when the author's email address is $authorEmail", (props: { authorEmail: string }) => {
	const crudeCommit = fakeCrudeCommit({ authorEmail: props.authorEmail })

	it("preserves the author's email address", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.authorEmail).toBe(props.authorEmail)
	})
})

describe.each`
	committerName
	${"baxter.stockman"}
	${"GitHub"}
	${"Michelangelo di Lodovico Buonarroti Simoni"}
`("when the committer's name is $committerName", (props: { committerName: string }) => {
	const crudeCommit = fakeCrudeCommit({ committerName: props.committerName })

	it("preserves the committer's name", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.committerName).toBe(props.committerName)
	})
})

describe.each`
	committerEmail
	${"baxter.stockman@fastforward.com"}
	${"noreply@github.com"}
	${"28317649+cowabunga@users.noreply.github.com"}
`("when the committer's email address is $committerEmail", (props: { committerEmail: string }) => {
	const crudeCommit = fakeCrudeCommit({ committerEmail: props.committerEmail })

	it("preserves the committer's email address", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.committerEmail).toBe(props.committerEmail)
	})
})

describe("when the commit signature is non-empty", () => {
	const crudeCommit = fakeCrudeCommit({
		signature:
			"-----BEGIN SSH SIGNATURE-----\n" +
			"MzEwM2JkMTMtNmJiMy00N2YxLWEyNTUtOWMxZmFmYTAyMGZlNDI3MWYyMmEtMjU4MS00YTky\n" +
			"LWFhNTEtMjI5YjRiZWIxYzMxNTZiMzAwYmMtYmU5ZC00NjUxLWFmODAtY2U3N2I2NmZmNDIy\n" +
			"-----END SSH SIGNATURE-----",
	})

	it("has a signature", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.hasSignature).toBe(true)
	})
})

describe("when the commit signature is empty", () => {
	const crudeCommit = fakeCrudeCommit({ signature: "" })

	it("does not have a signature", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.hasSignature).toBe(false)
	})
})

describe("when the commit message is empty", () => {
	const crudeCommit = fakeCrudeCommit({ message: "" })

	it("has an empty subject line", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.subjectLine).toEqual<TokenisedLine>([])
	})

	it("has no body lines", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.bodyLines).toEqual<TokenisedLines>([])
	})
})

describe("when the commit message has a single line", () => {
	const crudeCommit = fakeCrudeCommit({ message: "refactor the taxi module" })

	it("has a tokenised subject line", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.subjectLine).toEqual<TokenisedLine>([
			word("refactor"),
			whitespace(" ", 8),
			word("the", 9),
			whitespace(" ", 12),
			word("taxi", 13),
			whitespace(" ", 17),
			word("module", 18),
		])
	})

	it("has no body lines", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.bodyLines).toEqual<TokenisedLines>([])
	})
})

describe("when the commit message has 2 blank lines", () => {
	const crudeCommit = fakeCrudeCommit({ message: " \n " })

	it("has a blank tokenised subject line", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.subjectLine).toEqual<TokenisedLine>([whitespace(" ")])
	})

	it("has 1 blank tokenised body line", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.bodyLines).toEqual<TokenisedLines>([[whitespace(" ")]])
	})
})

describe("when the commit message has a subject line and 1 empty line", () => {
	const crudeCommit = fakeCrudeCommit({ message: "Fix this confusing plate of spaghetti\n" })

	it("has a tokenised subject line", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.subjectLine).toEqual<TokenisedLine>([
			word("Fix"),
			whitespace(" ", 3),
			word("this", 4),
			whitespace(" ", 8),
			word("confusing", 9),
			whitespace(" ", 18),
			word("plate", 19),
			whitespace(" ", 24),
			word("of", 25),
			whitespace(" ", 27),
			word("spaghetti", 28),
		])
	})

	it("has 1 empty body line", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.bodyLines).toEqual<TokenisedLines>([[]])
	})
})

describe("when the commit message has a subject line and 1 body line", () => {
	const crudeCommit = fakeCrudeCommit({
		message:
			"Apply strawberry jam to make the code sweeter\nSweetness went to a 8 out of 10, as we held back a bit to avoid turning the code diabetic.",
	})

	it("has a tokenised subject line", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.subjectLine).toEqual<TokenisedLine>([
			word("Apply"),
			whitespace(" ", 5),
			word("strawberry", 6),
			whitespace(" ", 16),
			word("jam", 17),
			whitespace(" ", 20),
			word("to", 21),
			whitespace(" ", 23),
			word("make", 24),
			whitespace(" ", 28),
			word("the", 29),
			whitespace(" ", 32),
			word("code", 33),
			whitespace(" ", 37),
			word("sweeter", 38),
		])
	})

	it("has 1 tokenised body line", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.bodyLines).toEqual<TokenisedLines>([
			[
				word("Sweetness"),
				whitespace(" ", 9),
				word("went", 10),
				whitespace(" ", 14),
				word("to", 15),
				whitespace(" ", 17),
				word("a", 18),
				whitespace(" ", 19),
				word("8", 20),
				whitespace(" ", 21),
				word("out", 22),
				whitespace(" ", 25),
				word("of", 26),
				whitespace(" ", 28),
				word("10", 29),
				punctuation(",", 31),
				whitespace(" ", 32),
				word("as", 33),
				whitespace(" ", 35),
				word("we", 36),
				whitespace(" ", 38),
				word("held", 39),
				whitespace(" ", 43),
				word("back", 44),
				whitespace(" ", 48),
				word("a", 49),
				whitespace(" ", 50),
				word("bit", 51),
				whitespace(" ", 54),
				word("to", 55),
				whitespace(" ", 57),
				word("avoid", 58),
				whitespace(" ", 63),
				word("turning", 64),
				whitespace(" ", 71),
				word("the", 72),
				whitespace(" ", 75),
				word("code", 76),
				whitespace(" ", 80),
				word("diabetic", 81),
				punctuation(".", 89),
			],
		])
	})
})

describe("when the commit message has a subject line, 1 empty line, and 1 body line", () => {
	const crudeCommit = fakeCrudeCommit({
		message: "  added some extra love to the code\n\nThe architecture is much more flexible now.",
	})

	it("has a tokenised subject line", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.subjectLine).toEqual<TokenisedLine>([
			whitespace("  "),
			word("added", 2),
			whitespace(" ", 7),
			word("some", 8),
			whitespace(" ", 12),
			word("extra", 13),
			whitespace(" ", 18),
			word("love", 19),
			whitespace(" ", 23),
			word("to", 24),
			whitespace(" ", 26),
			word("the", 27),
			whitespace(" ", 30),
			word("code", 31),
		])
	})

	it("has 1 empty body line and 1 tokenised body line", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.bodyLines).toEqual<TokenisedLines>([
			[],
			[
				word("The"),
				whitespace(" ", 3),
				word("architecture", 4),
				whitespace(" ", 16),
				word("is", 17),
				whitespace(" ", 19),
				word("much", 20),
				whitespace(" ", 24),
				word("more", 25),
				whitespace(" ", 29),
				word("flexible", 30),
				whitespace(" ", 38),
				word("now", 39),
				punctuation(".", 42),
			],
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
		expect(commit.subjectLine).toEqual<TokenisedLine>([
			word("Upgrade"),
			whitespace(" ", 7),
			word("dependencies", 8),
		])
	})

	it("has 2 tokenised body lines", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.bodyLines).toEqual<TokenisedLines>([
			[
				word("This"),
				whitespace(" ", 4),
				word("commit", 5),
				whitespace(" ", 11),
				word("upgrades", 12),
				whitespace(" ", 20),
				word("the", 21),
				whitespace(" ", 24),
				word("following", 25),
				whitespace(" ", 34),
				word("dependency", 35),
				punctuation(":", 45),
			],
			[
				punctuation("-"),
				whitespace(" ", 1),
				punctuation("`@", 2),
				word("types", 4),
				punctuation("/", 9),
				word("node", 10),
				punctuation("`", 14),
				whitespace(" ", 15),
				word("from", 16),
				whitespace(" ", 20),
				word("20", 21),
				punctuation(".", 23),
				word("19", 24),
				punctuation(".", 26),
				word("20", 27),
				whitespace(" ", 29),
				word("to", 30),
				whitespace(" ", 32),
				word("20", 33),
				punctuation(".", 35),
				word("19", 36),
				punctuation(".", 38),
				word("23", 39),
			],
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
		expect(commit.subjectLine).toEqual<TokenisedLine>([
			word("Clean"),
			whitespace(" ", 5),
			word("up", 6),
			whitespace(" ", 8),
			word("to", 9),
			whitespace(" ", 11),
			word("improve", 12),
			whitespace(" ", 19),
			word("maintainability", 20),
		])
	})

	it("has 1 empty body line and 3 tokenised body lines", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.bodyLines).toEqual<TokenisedLines>([
			[],
			[
				word("This"),
				whitespace(" ", 4),
				word("commit", 5),
				whitespace(" ", 11),
				word("removes", 12),
				whitespace(" ", 19),
				word("unnecessary", 20),
				whitespace(" ", 31),
				word("nesting", 32),
				punctuation(".", 39),
			],
			[
				word("It"),
				whitespace(" ", 2),
				word("also", 3),
				whitespace(" ", 7),
				word("simplifies", 8),
				whitespace(" ", 18),
				word("variable", 19),
				whitespace(" ", 27),
				word("names", 28),
				punctuation(".", 33),
			],
			[
				word("Finally"),
				punctuation(",", 7),
				whitespace(" ", 8),
				word("it", 9),
				whitespace(" ", 11),
				word("adds", 12),
				whitespace(" ", 16),
				word("more", 17),
				whitespace(" ", 21),
				word("tests", 22),
				punctuation(".", 27),
			],
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
		expect(commit.subjectLine).toEqual<TokenisedLine>([
			word("Release"),
			whitespace(" ", 7),
			word("the", 8),
			whitespace(" ", 11),
			word("robot", 12),
			whitespace(" ", 17),
			word("butler", 18),
		])
	})

	it("has 3 tokenised body lines, 1 empty body line, and 2 more tokenised body lines", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.bodyLines).toEqual<TokenisedLines>([
			[
				word("It"),
				whitespace(" ", 2),
				word("will", 3),
				whitespace(" ", 7),
				word("serve", 8),
				whitespace(" ", 13),
				word("coffee", 14),
				punctuation(".", 20),
			],
			[
				word("It"),
				whitespace(" ", 2),
				word("will", 3),
				whitespace(" ", 7),
				word("make", 8),
				whitespace(" ", 12),
				word("jokes", 13),
				punctuation(".", 18),
			],
			[
				word("It"),
				whitespace(" ", 2),
				word("will", 3),
				whitespace(" ", 7),
				word("clean", 8),
				whitespace(" ", 13),
				word("the", 14),
				whitespace(" ", 17),
				word("codebase", 18),
				punctuation(".", 26),
			],
			[],
			[
				word("Please"),
				whitespace(" ", 6),
				word("be", 7),
				whitespace(" ", 9),
				word("kind", 10),
				whitespace(" ", 14),
				word("to", 15),
				whitespace(" ", 17),
				word("the", 18),
				whitespace(" ", 21),
				word("robot", 22),
				punctuation(".", 27),
			],
			[
				word("Do"),
				whitespace(" ", 2),
				word("not", 3),
				whitespace(" ", 6),
				word("spill", 7),
				whitespace(" ", 12),
				word("coffee", 13),
				whitespace(" ", 19),
				word("on", 20),
				whitespace(" ", 22),
				word("it", 23),
				punctuation(".", 25),
			],
		])
	})
})

describe("when the commit message has a subject line, 2 empty lines, and 1 body line", () => {
	const crudeCommit = fakeCrudeCommit({
		message: "Make the commit scream fixup! again\n\n\nThis commit renames a variable.",
	})

	it("has a tokenised subject line", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.subjectLine).toEqual<TokenisedLine>([
			word("Make"),
			whitespace(" ", 4),
			word("the", 5),
			whitespace(" ", 8),
			word("commit", 9),
			whitespace(" ", 15),
			word("scream", 16),
			whitespace(" ", 22),
			word("fixup", 23),
			punctuation("!", 28),
			whitespace(" ", 29),
			word("again", 30),
		])
	})

	it("has 2 empty body lines and 1 tokenised body line", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.bodyLines).toEqual<TokenisedLines>([
			[],
			[],
			[
				word("This"),
				whitespace(" ", 4),
				word("commit", 5),
				whitespace(" ", 11),
				word("renames", 12),
				whitespace(" ", 19),
				word("a", 20),
				whitespace(" ", 21),
				word("variable", 22),
				punctuation(".", 30),
			],
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
		expect(commit.subjectLine).toEqual<TokenisedLine>([
			word("Do"),
			whitespace(" ", 2),
			word("some", 3),
			whitespace(" ", 7),
			word("pair", 8),
			whitespace(" ", 12),
			word("programming", 13),
		])
	})

	it("has 1 tokenised body line, 1 empty body line, 4 tokenised body lines, and 1 trailing empty body line", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.bodyLines).toEqual<TokenisedLines>([
			[
				word("This"),
				whitespace(" ", 4),
				word("commit", 5),
				whitespace(" ", 11),
				word("is", 12),
				whitespace(" ", 14),
				word("a", 15),
				whitespace(" ", 16),
				word("collab", 17),
				punctuation(".", 23),
			],
			[],
			[
				word("Co-authored-by"),
				punctuation(":", 14),
				whitespace(" ", 15),
				word("Gon", 16),
				whitespace(" ", 19),
				word("Freecss", 20),
				whitespace(" ", 27),
				punctuation("<", 28),
				word("rock", 29),
				punctuation(".", 33),
				word("paper", 34),
				punctuation(".", 39),
				word("scissors", 40),
				punctuation("@", 48),
				word("hunters", 49),
				punctuation(".", 56),
				word("com", 57),
				punctuation(">", 60),
			],
			[
				word("Co-authored-by"),
				punctuation(":", 14),
				whitespace(" ", 15),
				word("Killua", 16),
				whitespace(" ", 22),
				word("Zoldyck", 23),
				whitespace(" ", 30),
				punctuation("<", 31),
				word("killua", 32),
				punctuation("@", 38),
				word("godspeed", 39),
				punctuation(".", 47),
				word("net", 48),
				punctuation(">", 51),
			],
			[
				word("Reported-by"),
				punctuation(":", 11),
				whitespace(" ", 12),
				word("Hisoka", 13),
				whitespace(" ", 19),
				punctuation("<", 20),
				word("no4", 21),
				punctuation("@", 24),
				word("phantom", 25),
				punctuation(".", 32),
				word("com", 33),
				punctuation(">", 36),
			],
			[
				word("All"),
				whitespace(" ", 3),
				word("participants", 4),
				whitespace(" ", 16),
				word("had", 17),
				whitespace(" ", 20),
				word("fun", 21),
				punctuation(".", 24),
			],
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
		expect(commit.subjectLine).toEqual<TokenisedLine>([
			word("Make"),
			whitespace(" ", 4),
			word("the", 5),
			whitespace(" ", 8),
			word("code", 9),
			whitespace(" ", 13),
			word("go", 14),
			whitespace(" ", 16),
			word("brrr", 17),
			whitespace(" ", 21),
			word("with", 22),
			whitespace(" ", 26),
			word("fancy", 27),
			whitespace(" ", 32),
			word("updates", 33),
		])
	})

	it("has the expected mix of empty and tokenised body lines", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.bodyLines).toEqual<TokenisedLines>([
			[],
			[
				word("This"),
				whitespace(" ", 4),
				word("commit", 5),
				whitespace(" ", 11),
				word("makes", 12),
				whitespace(" ", 17),
				word("the", 18),
				whitespace(" ", 21),
				word("hamsters", 22),
				whitespace(" ", 30),
				word("run", 31),
				whitespace(" ", 34),
				word("faster", 35),
				punctuation(".", 41),
			],
			[
				word("Upgraded"),
				whitespace(" ", 8),
				word("their", 9),
				whitespace(" ", 14),
				word("tiny", 15),
				whitespace(" ", 19),
				word("running", 20),
				whitespace(" ", 27),
				word("wheels", 28),
				punctuation(".", 34),
			],
			[],
			[
				word("Added"),
				whitespace(" ", 5),
				word("rocket", 6),
				whitespace(" ", 12),
				word("fuel", 13),
				whitespace(" ", 17),
				word("to", 18),
				whitespace(" ", 20),
				word("hamster", 21),
				whitespace(" ", 28),
				word("food", 29),
				punctuation(".", 33),
			],
			[
				word("Installed"),
				whitespace(" ", 9),
				word("nitro", 10),
				whitespace(" ", 15),
				word("boosters", 16),
				whitespace(" ", 24),
				word("on", 25),
				whitespace(" ", 27),
				word("wheels", 28),
				punctuation(".", 34),
			],
			[
				word("Now"),
				whitespace(" ", 3),
				word("they're", 4),
				whitespace(" ", 11),
				word("breaking", 12),
				whitespace(" ", 20),
				word("the", 21),
				whitespace(" ", 24),
				word("speed", 25),
				whitespace(" ", 30),
				word("limit", 31),
				punctuation(".", 36),
			],
			[],
		])
	})
})
