import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import {
	type Tokens,
	code,
	codeblock,
	issuelink,
	punctuation,
	revert,
	semver,
	space,
	squash,
	trailerkey,
	whitespace,
	word,
} from "#commits/Token.ts"
import { fakeTokenConfiguration } from "#configurations/Configuration.fixtures.ts"
import { issueLinkConfiguration } from "#configurations/IssueLinkTokenConfiguration.ts"

const configuration = fakeTokenConfiguration()

describe("when the commit message is empty", () => {
	const crudeCommit = fakeCrudeCommit({ message: "" })

	it("has an empty subject line", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.subjectLine).toEqual<Tokens>([])
	})

	it("has no body lines", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.bodyLines).toEqual<Array<Tokens>>([])
	})
})

describe.each`
	message                                                                                                                                                                                                                                              | expectedSubjectLine                                                                                                                                                                                                              | expectedBodyLines
	${" \n "}                                                                                                                                                                                                                                            | ${[space()]}                                                                                                                                                                                                                     | ${[[space()]]}
	${"refactor the taxi module"}                                                                                                                                                                                                                        | ${[word("refactor"), space(8), word("the", 9), space(12), word("taxi", 13), space(17), word("module", 18)]}                                                                                                                      | ${[]}
	${"Fix this confusing plate of spaghetti\n"}                                                                                                                                                                                                         | ${[word("Fix"), space(3), word("this", 4), space(8), word("confusing", 9), space(18), word("plate", 19), space(24), word("of", 25), space(27), word("spaghetti", 28)]}                                                           | ${[[]]}
	${"Apply strawberry jam to make the code sweeter\nSweetness went to a 8 out of 10, as we held back a bit to avoid turning the code diabetic."}                                                                                                       | ${[word("Apply"), space(5), word("strawberry", 6), space(16), word("jam", 17), space(20), word("to", 21), space(23), word("make", 24), space(28), word("the", 29), space(32), word("code", 33), space(37), word("sweeter", 38)]} | ${[[word("Sweetness"), space(9), word("went", 10), space(14), word("to", 15), space(17), word("a", 18), space(19), word("8", 20), space(21), word("out", 22), space(25), word("of", 26), space(28), word("10", 29), punctuation(",", 31), space(32), word("as", 33), space(35), word("we", 36), space(38), word("held", 39), space(43), word("back", 44), space(48), word("a", 49), space(50), word("bit", 51), space(54), word("to", 55), space(57), word("avoid", 58), space(63), word("turning", 64), space(71), word("the", 72), space(75), word("code", 76), space(80), word("diabetic", 81), punctuation(".", 89)]]}
	${"  added some extra love to the code\n\nThe architecture is much more flexible now."}                                                                                                                                                              | ${[whitespace("  "), word("added", 2), space(7), word("some", 8), space(12), word("extra", 13), space(18), word("love", 19), space(23), word("to", 24), space(26), word("the", 27), space(30), word("code", 31)]}                | ${[[], [word("The"), space(3), word("architecture", 4), space(16), word("is", 17), space(19), word("much", 20), space(24), word("more", 25), space(29), word("flexible", 30), space(38), word("now", 39), punctuation(".", 42)]]}
	${"Clean up to improve maintainability\n\nThis commit removes unnecessary nesting.\nIt also simplifies variable names.\nFinally, it adds more tests."}                                                                                               | ${[word("Clean"), space(5), word("up", 6), space(8), word("to", 9), space(11), word("improve", 12), space(19), word("maintainability", 20)]}                                                                                     | ${[[], [word("This"), space(4), word("commit", 5), space(11), word("removes", 12), space(19), word("unnecessary", 20), space(31), word("nesting", 32), punctuation(".", 39)], [word("It"), space(2), word("also", 3), space(7), word("simplifies", 8), space(18), word("variable", 19), space(27), word("names", 28), punctuation(".", 33)], [word("Finally"), punctuation(",", 7), space(8), word("it", 9), space(11), word("adds", 12), space(16), word("more", 17), space(21), word("tests", 22), punctuation(".", 27)]]}
	${"Release the robot butler\nIt will serve coffee.\nIt will make jokes.\nIt will clean the codebase.\n\nPlease be kind to the robot.\nDo not spill coffee on it."}                                                                                   | ${[word("Release"), space(7), word("the", 8), space(11), word("robot", 12), space(17), word("butler", 18)]}                                                                                                                      | ${[[word("It"), space(2), word("will", 3), space(7), word("serve", 8), space(13), word("coffee", 14), punctuation(".", 20)], [word("It"), space(2), word("will", 3), space(7), word("make", 8), space(12), word("jokes", 13), punctuation(".", 18)], [word("It"), space(2), word("will", 3), space(7), word("clean", 8), space(13), word("the", 14), space(17), word("codebase", 18), punctuation(".", 26)], [], [word("Please"), space(6), word("be", 7), space(9), word("kind", 10), space(14), word("to", 15), space(17), word("the", 18), space(21), word("robot", 22), punctuation(".", 27)], [word("Do"), space(2), word("not", 3), space(6), word("spill", 7), space(12), word("coffee", 13), space(19), word("on", 20), space(22), word("it", 23), punctuation(".", 25)]]}
	${"Make the commit scream fixup! again\n\n\nThis commit renames a variable."}                                                                                                                                                                        | ${[word("Make"), space(4), word("the", 5), space(8), word("commit", 9), space(15), word("scream", 16), space(22), word("fixup", 23), punctuation("!", 28), space(29), word("again", 30)]}                                        | ${[[], [], [word("This"), space(4), word("commit", 5), space(11), word("renames", 12), space(19), word("a", 20), space(21), word("variable", 22), punctuation(".", 30)]]}
	${"Do some pair programming\nThis commit is a collab.\n\nCo-authored-by: Gon Freecss <rock.paper.scissors@hunters.com>\nCo-authored-by: Killua Zoldyck <killua@godspeed.net>\nReported-by: Hisoka <no4@phantom.com>\nAll participants had fun.\n"}   | ${[word("Do"), space(2), word("some", 3), space(7), word("pair", 8), space(12), word("programming", 13)]}                                                                                                                        | ${[[word("This"), space(4), word("commit", 5), space(11), word("is", 12), space(14), word("a", 15), space(16), word("collab", 17), punctuation(".", 23)], [], [word("Co-authored-by"), punctuation(":", 14), space(15), word("Gon", 16), space(19), word("Freecss", 20), space(27), punctuation("<", 28), word("rock", 29), punctuation(".", 33), word("paper", 34), punctuation(".", 39), word("scissors", 40), punctuation("@", 48), word("hunters", 49), punctuation(".", 56), word("com", 57), punctuation(">", 60)], [word("Co-authored-by"), punctuation(":", 14), space(15), word("Killua", 16), space(22), word("Zoldyck", 23), space(30), punctuation("<", 31), word("killua", 32), punctuation("@", 38), word("godspeed", 39), punctuation(".", 47), word("net", 48), punctuation(">", 51)], [word("Reported-by"), punctuation(":", 11), space(12), word("Hisoka", 13), space(19), punctuation("<", 20), word("no4", 21), punctuation("@", 24), word("phantom", 25), punctuation(".", 32), word("com", 33), punctuation(">", 36)], [word("All"), space(3), word("participants", 4), space(16), word("had", 17), space(20), word("fun", 21), punctuation(".", 24)], []]}
	${"Make the code go brrr with fancy updates\n\nThis commit makes the hamsters run faster.\nUpgraded their tiny running wheels.\n\nAdded rocket fuel to hamster food.\nInstalled nitro boosters on wheels.\nNow they're breaking the speed limit.\n"} | ${[word("Make"), space(4), word("the", 5), space(8), word("code", 9), space(13), word("go", 14), space(16), word("brrr", 17), space(21), word("with", 22), space(26), word("fancy", 27), space(32), word("updates", 33)]}        | ${[[], [word("This"), space(4), word("commit", 5), space(11), word("makes", 12), space(17), word("the", 18), space(21), word("hamsters", 22), space(30), word("run", 31), space(34), word("faster", 35), punctuation(".", 41)], [word("Upgraded"), space(8), word("their", 9), space(14), word("tiny", 15), space(19), word("running", 20), space(27), word("wheels", 28), punctuation(".", 34)], [], [word("Added"), space(5), word("rocket", 6), space(12), word("fuel", 13), space(17), word("to", 18), space(20), word("hamster", 21), space(28), word("food", 29), punctuation(".", 33)], [word("Installed"), space(9), word("nitro", 10), space(15), word("boosters", 16), space(24), word("on", 25), space(27), word("wheels", 28), punctuation(".", 34)], [word("Now"), space(3), word("they're", 4), space(11), word("breaking", 12), space(20), word("the", 21), space(24), word("speed", 25), space(30), word("limit", 31), punctuation(".", 36)], []]}
`(
	"when the commit message of $message consists of plain text with words, punctuation, and whitespace",
	(props: { message: string; expectedSubjectLine: Tokens; expectedBodyLines: Array<Tokens> }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.message })

		it("extracts word, whitespace, and punctuation tokens in the subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(props.expectedSubjectLine)
		})

		it("extracts word, whitespace, and punctuation tokens in the body lines", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual(props.expectedBodyLines)
		})
	},
)

describe.each`
	subjectLine                                                      | expectedTokens
	${"introduce v1.2.3"}                                            | ${[word("introduce"), space(9), semver("v1.2.3", 10)]}
	${"Install pnpm 10.32.0"}                                        | ${[word("Install"), space(7), word("pnpm", 8), space(12), semver("10.32.0", 13)]}
	${"Pre-release v10.0.0-beta.1"}                                  | ${[word("Pre-release"), space(11), semver("v10.0.0-beta.1", 12)]}
	${"Bump vite from 4.1.1-beta.0 to 4.3.2"}                        | ${[word("Bump"), space(4), word("vite", 5), space(9), word("from", 10), space(14), semver("4.1.1-beta.0", 15), space(27), word("to", 28), space(30), semver("4.3.2", 31)]}
	${"Upgrade tsgo to 7.0.0-dev.20260131.1"}                        | ${[word("Upgrade"), space(7), word("tsgo", 8), space(12), word("to", 13), space(15), semver("7.0.0-dev.20260131.1", 16)]}
	${"Update dependency to v2.0.0-rc.1+4905fa03"}                   | ${[word("Update"), space(6), word("dependency", 7), space(17), word("to", 18), space(20), semver("v2.0.0-rc.1+4905fa03", 21)]}
	${"Downgrade the grumpy cat module from 3.1.4 to 3.0.0"}         | ${[word("Downgrade"), space(9), word("the", 10), space(13), word("grumpy", 14), space(20), word("cat", 21), space(24), word("module", 25), space(31), word("from", 32), space(36), semver("3.1.4", 37), space(42), word("to", 43), space(45), semver("3.0.0", 46)]}
	${"Release v0.1.0-next"}                                         | ${[word("Release"), space(7), semver("v0.1.0-next", 8)]}
	${"Pin the Node.js image to 4af617c"}                            | ${[word("Pin"), space(3), word("the", 4), space(7), word("Node", 8), punctuation(".", 12), word("js", 13), space(15), word("image", 16), space(21), word("to", 22), space(24), semver("4af617c", 25)]}
	${"Upgrade nginx image digest to 9d739ff1ada6"}                  | ${[word("Upgrade"), space(7), word("nginx", 8), space(13), word("image", 14), space(19), word("digest", 20), space(26), word("to", 27), space(29), semver("9d739ff1ada6", 30)]}
	${'Revert "Upgrade nginx image digest to 9d739ff1ada6"'}         | ${[revert("Revert"), space(6), punctuation('"', 7), word("Upgrade", 8), space(15), word("nginx", 16), space(21), word("image", 22), space(27), word("digest", 28), space(34), word("to", 35), space(37), semver("9d739ff1ada6", 38), punctuation('"', 50)]}
	${"#2: Refresh master to commit dfbc095"}                        | ${[issuelink("#2:"), space(3), word("Refresh", 4), space(11), word("master", 12), space(18), word("to", 19), space(21), word("commit", 22), space(28), semver("dfbc095", 29)]}
	${"fixup! Bump @typescript-eslint/parser from 5.52.0 to 5.59.1"} | ${[squash("fixup!"), space(6), word("Bump", 7), space(11), punctuation("@", 12), word("typescript-eslint", 13), punctuation("/", 30), word("parser", 31), space(37), word("from", 38), space(42), semver("5.52.0", 43), space(49), word("to", 50), space(52), semver("5.59.1", 53)]}
	${"amend! Upgrade React to 19.2.0 (#52)"}                        | ${[squash("amend!"), space(6), word("Upgrade", 7), space(14), word("React", 15), space(20), word("to", 21), space(23), semver("19.2.0", 24), space(30), issuelink("(#52)", 31)]}
`(
	"when the subject line of $subjectLine contains semantic dependency versions",
	(props: { subjectLine: string; expectedTokens: Tokens }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("extracts semver tokens", () => {
			expect(props.expectedTokens).toContainToken("semver")

			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(props.expectedTokens)
		})
	},
)

describe.each`
	subjectLine
	${"there's no dependency to be found here"}
	${"1 more time"}
	${"Enforce TLS 1.3 for all connections"}
	${"Change IP address to 11.37.118.232"}
	${"Route all traffic through the gateway at 10.0.0.1"}
	${"Redirect requests to /api/v2.5.1/endpoint"}
	${"Relocate the files (sector 2.3.4)"}
	${"0.2.0"}
	${"badf00d not found"}
	${" Codename 0ff1ce"}
`(
	"when the subject line of $subjectLine does not contain any semantic dependency versions",
	(props: { subjectLine: string }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("does not extract any semver tokens", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).not.toContainToken("semver")
		})
	},
)

describe.each`
	subjectLine                                         | expectedTokens
	${"``"}                                             | ${[code("``")]}
	${"`code`"}                                         | ${[code("`code`")]}
	${"Use `pnpm install` to get started"}              | ${[word("Use"), space(3), code("`pnpm install`", 4), space(18), word("to", 19), space(21), word("get", 22), space(25), word("started", 26)]}
	${"`git commit` is the command"}                    | ${[code("`git commit`"), space(12), word("is", 13), space(15), word("the", 16), space(19), word("command", 20)]}
	${"Run the command `git status`"}                   | ${[word("Run"), space(3), word("the", 4), space(7), word("command", 8), space(15), code("`git status`", 16)]}
	${"Run `this` and `that`"}                          | ${[word("Run"), space(3), code("`this`", 4), space(10), word("and", 11), space(14), code("`that`", 15)]}
	${"Replace `a`, `b`, and `c`"}                      | ${[word("Replace"), space(7), code("`a`", 8), punctuation(",", 11), space(12), code("`b`", 13), punctuation(",", 16), space(17), word("and", 18), space(21), code("`c`", 22)]}
	${"`1``23``456`"}                                   | ${[code("`1`"), code("`23`", 3), code("`456`", 7)]}
	${"fixup! Use `pnpm install` to get started"}       | ${[squash("fixup!"), space(6), word("Use", 7), space(10), code("`pnpm install`", 11), space(25), word("to", 26), space(28), word("get", 29), space(32), word("started", 33)]}
	${'Revert "Use `pnpm install` to get started"'}     | ${[revert("Revert"), space(6), punctuation('"', 7), word("Use", 8), space(11), code("`pnpm install`", 12), space(26), word("to", 27), space(29), word("get", 30), space(33), word("started", 34), punctuation('"', 41)]}
	${"Upgrade `react` from 18.3.1 to 19.2.0"}          | ${[word("Upgrade"), space(7), code("`react`", 8), space(15), word("from", 16), space(20), semver("18.3.1", 21), space(27), word("to", 28), space(30), semver("19.2.0", 31)]}
	${"#42: Replace `<a>` with new `<Link>` component"} | ${[issuelink("#42:"), space(4), word("Replace", 5), space(12), code("`<a>`", 13), space(18), word("with", 19), space(23), word("new", 24), space(27), code("`<Link>`", 28), space(36), word("component", 37)]}
`(
	"when the subject line of $subjectLine contains inline code phrases",
	(props: { subjectLine: string; expectedTokens: Tokens }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("extracts code tokens", () => {
			expect(props.expectedTokens).toContainToken("code")

			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(props.expectedTokens)
		})
	},
)

describe.each`
	subjectLine                                                | expectedTokens
	${"`#42`"}                                                 | ${[code("`#42`")]}
	${"Closes `GL-2`"}                                         | ${[word("Closes"), space(6), code("`GL-2`", 7)]}
	${"New target: `1.0.0`"}                                   | ${[word("New"), space(3), word("target", 4), punctuation(":", 10), space(11), code("`1.0.0`", 12)]}
	${"`fixup!` is the correct syntax"}                        | ${[code("`fixup!`"), space(8), word("is", 9), space(11), word("the", 12), space(15), word("correct", 16), space(23), word("syntax", 24)]}
	${"squash! `fixup!` is the correct syntax"}                | ${[squash("squash!"), space(7), code("`fixup!`", 8), space(16), word("is", 17), space(19), word("the", 20), space(23), word("correct", 24), space(31), word("syntax", 32)]}
	${"#440: Codename `GH-32`"}                                | ${[issuelink("#440:"), space(5), word("Codename", 6), space(14), code("`GH-32`", 15)]}
	${"this looks related to `#92`"}                           | ${[word("this"), space(4), word("looks", 5), space(10), word("related", 11), space(18), word("to", 19), space(21), code("`#92`", 22)]}
	${'Revert "`Revert` "the malfunctioning coffee machine""'} | ${[revert("Revert"), space(6), punctuation('"', 7), code("`Revert`", 8), space(16), punctuation('"', 17), word("the", 18), space(21), word("malfunctioning", 22), space(36), word("coffee", 37), space(43), word("machine", 44), punctuation('""', 51)]}
`(
	"when the subject line of $subjectLine contains inline code phrases that resemble other kinds of tokens",
	(props: { subjectLine: string; expectedTokens: Tokens }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("extracts code tokens", () => {
			expect(props.expectedTokens).toContainToken("code")

			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(props.expectedTokens)
		})
	},
)

describe.each`
	subjectLine
	${"Good boy"}
	${"It's not a backtick issue"}
	${"Use ` alone"}
	${"Revert the `unclosed phrase"}
	${"A backtick at the end `"}
`(
	"when the subject line of $subjectLine does not contain any inline code phrases",
	(props: { subjectLine: string }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("does not extract any code tokens", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).not.toContainToken("code")
		})
	},
)

describe.each`
	subjectLine                                                                        | expectedTokens
	${'Revert ""'}                                                                     | ${[revert("Revert"), space(6), punctuation('""', 7)]}
	${'Revert " "'}                                                                    | ${[revert("Revert"), space(6), punctuation('"', 7), space(8), punctuation('"', 9)]}
	${'Revert "Revert """'}                                                            | ${[revert("Revert"), space(6), punctuation('"', 7), revert("Revert", 8), space(14), punctuation('"""', 15)]}
	${'Revert "Repair the soft ice machine"'}                                          | ${[revert("Revert"), space(6), punctuation('"', 7), word("Repair", 8), space(14), word("the", 15), space(18), word("soft", 19), space(23), word("ice", 24), space(27), word("machine", 28), punctuation('"', 35)]}
	${'Revert "Revert "Repair the soft ice machine""'}                                 | ${[revert("Revert"), space(6), punctuation('"', 7), revert("Revert", 8), space(14), punctuation('"', 15), word("Repair", 16), space(22), word("the", 23), space(26), word("soft", 27), space(31), word("ice", 32), space(35), word("machine", 36), punctuation('""', 43)]}
	${'Revert "Revert "Revert "Repair the soft ice machine"""'}                        | ${[revert("Revert"), space(6), punctuation('"', 7), revert("Revert", 8), space(14), punctuation('"', 15), revert("Revert", 16), space(22), punctuation('"', 23), word("Repair", 24), space(30), word("the", 31), space(34), word("soft", 35), space(39), word("ice", 40), space(43), word("machine", 44), punctuation('"""', 51)]}
	${'revert "Fix a nasty bug"'}                                                      | ${[revert("revert"), space(6), punctuation('"', 7), word("Fix", 8), space(11), word("a", 12), space(13), word("nasty", 14), space(19), word("bug", 20), punctuation('"', 23)]}
	${'Revert"without-space"'}                                                         | ${[revert("Revert"), punctuation('"', 6), word("without-space", 7), punctuation('"', 20)]}
	${'REVERT "Refactor the authentication module"'}                                   | ${[revert("REVERT"), space(6), punctuation('"', 7), word("Refactor", 8), space(16), word("the", 17), space(20), word("authentication", 21), space(35), word("module", 36), punctuation('"', 42)]}
	${' Revert " Apply strawberry jam to make the code sweeter" '}                     | ${[space(), revert("Revert", 1), space(7), punctuation('"', 8), space(9), word("Apply", 10), space(15), word("strawberry", 16), space(26), word("jam", 27), space(30), word("to", 31), space(33), word("make", 34), space(38), word("the", 39), space(42), word("code", 43), space(47), word("sweeter", 48), punctuation('"', 55), space(56)]}
	${'  revert " revert "Find a new "court jester" to blame " " '}                    | ${[whitespace("  "), revert("revert", 2), space(8), punctuation('"', 9), space(10), revert("revert", 11), space(17), punctuation('"', 18), word("Find", 19), space(23), word("a", 24), space(25), word("new", 26), space(29), punctuation('"', 30), word("court", 31), space(36), word("jester", 37), punctuation('"', 43), space(44), word("to", 45), space(47), word("blame", 48), space(53), punctuation('"', 54), space(55), punctuation('"', 56), space(57)]}
	${'Revert  "Make the program act like a clown"'}                                   | ${[revert("Revert"), whitespace("  ", 6), punctuation('"', 8), word("Make", 9), space(13), word("the", 14), space(17), word("program", 18), space(25), word("act", 26), space(29), word("like", 30), space(34), word("a", 35), space(36), word("clown", 37), punctuation('"', 42)]}
	${'Revert "Upgrade "React" to 19.2.0 (#42)"'}                                      | ${[revert("Revert"), space(6), punctuation('"', 7), word("Upgrade", 8), space(15), punctuation('"', 16), word("React", 17), punctuation('"', 22), space(23), word("to", 24), space(26), semver("19.2.0", 27), space(33), issuelink("(#42)", 34), punctuation('"', 39)]}
	${'revert "squash! i blame the previous developer"'}                               | ${[revert("revert"), space(6), punctuation('"', 7), word("squash", 8), punctuation("!", 14), space(15), word("i", 16), space(17), word("blame", 18), space(23), word("the", 24), space(27), word("previous", 28), space(36), word("developer", 37), punctuation('"', 46)]}
	${'Revert  "Revert "  squash!  fixup! Made the code so clean that it sparkles ""'} | ${[revert("Revert"), whitespace("  ", 6), punctuation('"', 8), revert("Revert", 9), space(15), punctuation('"', 16), whitespace("  ", 17), word("squash", 19), punctuation("!", 25), whitespace("  ", 26), word("fixup", 28), punctuation("!", 33), space(34), word("Made", 35), space(39), word("the", 40), space(43), word("code", 44), space(48), word("so", 49), space(51), word("clean", 52), space(57), word("that", 58), space(62), word("it", 63), space(65), word("sparkles", 66), space(74), punctuation('""', 75)]}
`(
	"when the subject line of $subjectLine contains revert markers",
	(props: { subjectLine: string; expectedTokens: Tokens }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("extracts revert tokens", () => {
			expect(props.expectedTokens).toContainToken("revert")

			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(props.expectedTokens)
		})
	},
)

describe.each`
	subjectLine                                                   | expectedTokens
	${'Revert "'}                                                 | ${[revert("Revert"), space(6), punctuation('"', 7)]}
	${'Revert "  '}                                               | ${[revert("Revert"), space(6), punctuation('"', 7), whitespace("  ", 8)]}
	${'Revert "Repair the soft ice machine'}                      | ${[revert("Revert"), space(6), punctuation('"', 7), word("Repair", 8), space(14), word("the", 15), space(18), word("soft", 19), space(23), word("ice", 24), space(27), word("machine", 28)]}
	${'Revert "Revert "Repair the soft ice machine"'}             | ${[revert("Revert"), space(6), punctuation('"', 7), revert("Revert", 8), space(14), punctuation('"', 15), word("Repair", 16), space(22), word("the", 23), space(26), word("soft", 27), space(31), word("ice", 32), space(35), word("machine", 36), punctuation('"', 43)]}
	${'Revert "Revert "Revert "Repair the soft ice machine'}      | ${[revert("Revert"), space(6), punctuation('"', 7), revert("Revert", 8), space(14), punctuation('"', 15), revert("Revert", 16), space(22), punctuation('"', 23), word("Repair", 24), space(30), word("the", 31), space(34), word("soft", 35), space(39), word("ice", 40), space(43), word("machine", 44)]}
	${'  revert " revert "Find a new "court jester" to blame " '} | ${[whitespace("  "), revert("revert", 2), space(8), punctuation('"', 9), space(10), revert("revert", 11), space(17), punctuation('"', 18), word("Find", 19), space(23), word("a", 24), space(25), word("new", 26), space(29), punctuation('"', 30), word("court", 31), space(36), word("jester", 37), punctuation('"', 43), space(44), word("to", 45), space(47), word("blame", 48), space(53), punctuation('"', 54), space(55)]}
	${'Revert ""weirdly quoted message'}                          | ${[revert("Revert"), space(6), punctuation('""', 7), word("weirdly", 9), space(16), word("quoted", 17), space(23), word("message", 24)]}
	${'fixup! Revert "Add an amazing feature'}                    | ${[squash("fixup!"), space(6), revert("Revert", 7), space(13), punctuation('"', 14), word("Add", 15), space(18), word("an", 19), space(21), word("amazing", 22), space(29), word("feature", 30)]}
	${'revert "a mere bugfix attempt"""'}                         | ${[revert("revert"), space(6), punctuation('"', 7), word("a", 8), space(9), word("mere", 10), space(14), word("bugfix", 15), space(21), word("attempt", 22), punctuation('"""', 29)]}
`(
	"when the subject line of $subjectLine contains revert markers with inconsistent pairs of quotes",
	(props: { subjectLine: string; expectedTokens: Tokens }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("extracts revert tokens", () => {
			expect(props.expectedTokens).toContainToken("revert")

			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(props.expectedTokens)
		})
	},
)

describe.each`
	subjectLine
	${'#1 Revert "Add an amazing feature"'}
	${'GH-45 GL-193 revert "bugfix"'}
`(
	"when the subject line of $subjectLine has issue links before potential revert markers",
	(props: { subjectLine: string }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("does not extract any revert tokens", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).not.toContainToken("revert")
		})
	},
)

describe.each`
	subjectLine
	${"Add a boring feature"}
	${'Not a Revert "thing"'}
	${"revert"}
	${"Revert 'the next big thing'"}
	${'revert more stuff"'}
	${"Reverted some secret stuff"}
	${'"Revert "Make the formatter happy again""'}
	${'fix: Revert "something"'}
	${"Time to revert it"}
	${'I\'ll never revert "this"'}
	${'Revert Revert "something""'}
`(
	"when the subject line of $subjectLine does not contain any revert markers",
	(props: { subjectLine: string }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("does not extract any revert tokens", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).not.toContainToken("revert")
		})
	},
)

describe.each`
	subjectLine                                                                        | expectedTokens
	${"amend!"}                                                                        | ${[squash("amend!")]}
	${" amend!Apply strawberry jam to make the code sweeter"}                          | ${[space(), squash("amend!", 1), word("Apply", 7), space(12), word("strawberry", 13), space(23), word("jam", 24), space(27), word("to", 28), space(30), word("make", 31), space(35), word("the", 36), space(39), word("code", 40), space(44), word("sweeter", 45)]}
	${" fixup!  "}                                                                     | ${[space(), squash("fixup!", 1), whitespace("  ", 7)]}
	${"fixup! Resolve a bug that thought it was a feature"}                            | ${[squash("fixup!"), space(6), word("Resolve", 7), space(14), word("a", 15), space(16), word("bug", 17), space(20), word("that", 21), space(25), word("thought", 26), space(33), word("it", 34), space(36), word("was", 37), space(40), word("a", 41), space(42), word("feature", 43)]}
	${"squash!   "}                                                                    | ${[squash("squash!"), whitespace("   ", 7)]}
	${" squash!  Make the formatter happy again :)"}                                   | ${[space(), squash("squash!", 1), whitespace("  ", 8), word("Make", 10), space(14), word("the", 15), space(18), word("formatter", 19), space(28), word("happy", 29), space(34), word("again", 35), space(40), punctuation(":)", 41)]}
	${"!amend"}                                                                        | ${[squash("!amend")]}
	${"!amend some refactoring"}                                                       | ${[squash("!amend"), space(6), word("some", 7), space(11), word("refactoring", 12)]}
	${"  !fixup "}                                                                     | ${[whitespace("  "), squash("!fixup", 2), space(8)]}
	${" !fixup   Compare the list of items to the objects downloaded from the server"} | ${[space(), squash("!fixup", 1), whitespace("   ", 7), word("Compare", 10), space(17), word("the", 18), space(21), word("list", 22), space(26), word("of", 27), space(29), word("items", 30), space(35), word("to", 36), space(38), word("the", 39), space(42), word("objects", 43), space(50), word("downloaded", 51), space(61), word("from", 62), space(66), word("the", 67), space(70), word("server", 71)]}
	${"!squash "}                                                                      | ${[squash("!squash"), space(7)]}
	${"  !squash revisited the haircut of the main module"}                            | ${[whitespace("  "), squash("!squash", 2), space(9), word("revisited", 10), space(19), word("the", 20), space(23), word("haircut", 24), space(31), word("of", 32), space(34), word("the", 35), space(38), word("main", 39), space(43), word("module", 44)]}
	${" amend!solve the problem!"}                                                     | ${[space(), squash("amend!", 1), word("solve", 7), space(12), word("the", 13), space(16), word("problem", 17), punctuation("!", 24)]}
	${"fixup! - encourages the program to act like a clown"}                           | ${[squash("fixup!"), space(6), punctuation("-", 7), space(8), word("encourages", 9), space(19), word("the", 20), space(23), word("program", 24), space(31), word("to", 32), space(34), word("act", 35), space(38), word("like", 39), space(43), word("a", 44), space(45), word("clown", 46)]}
	${"fixup! Fixup!! Fix this confusing plate of spaghetti"}                          | ${[squash("fixup!"), space(6), squash("Fixup!!", 7), space(14), word("Fix", 15), space(18), word("this", 19), space(23), word("confusing", 24), space(33), word("plate", 34), space(39), word("of", 40), space(42), word("spaghetti", 43)]}
	${" amend!squash!!   fixup!!amend Mess up the squash! markers"}                    | ${[space(), squash("amend!", 1), squash("squash!!", 7), whitespace("   ", 15), squash("fixup!!", 18), word("amend", 25), space(30), word("Mess", 31), space(35), word("up", 36), space(38), word("the", 39), space(42), word("squash", 43), punctuation("!", 49), space(50), word("markers", 51)]}
	${"!amend!fixup!SQUASH fixup! Every bus optimised"}                                | ${[squash("!amend"), squash("!fixup", 6), squash("!SQUASH", 12), space(19), squash("fixup!", 20), space(26), word("Every", 27), space(32), word("bus", 33), space(36), word("optimised", 37)]}
	${"!squash#6 !fixup! carry on then #11"}                                           | ${[squash("!squash"), issuelink("#6", 7), space(9), punctuation("!", 10), word("fixup", 11), punctuation("!", 16), space(17), word("carry", 18), space(23), word("on", 24), space(26), word("then", 27), space(31), issuelink("#11", 32)]}
	${'fixup! Revert "Add an amazing feature"'}                                        | ${[squash("fixup!"), space(6), revert("Revert", 7), space(13), punctuation('"', 14), word("Add", 15), space(18), word("an", 19), space(21), word("amazing", 22), space(29), word("feature", 30), punctuation('"', 37)]}
	${'squash!Revert "Revert "Refactor the authentication module""'}                   | ${[squash("squash!"), revert("Revert", 7), space(13), punctuation('"', 14), revert("Revert", 15), space(21), punctuation('"', 22), word("Refactor", 23), space(31), word("the", 32), space(35), word("authentication", 36), space(50), word("module", 51), punctuation('""', 57)]}
	${'amend! Revert "fixup!"'}                                                        | ${[squash("amend!"), space(6), revert("Revert", 7), space(13), punctuation('"', 14), word("fixup", 15), punctuation('!"', 20)]}
	${"!!!amend!!!this"}                                                               | ${[squash("!!!amend"), punctuation("!!!", 8), word("this", 11)]}
`(
	"when the subject line of $subjectLine contains a squash marker",
	(props: { subjectLine: string; expectedTokens: Tokens }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("extracts a squash token", () => {
			expect(props.expectedTokens).toContainToken("squash")

			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(props.expectedTokens)
		})
	},
)

describe.each`
	subjectLine
	${"#1 fixup! Apply some magic"}
	${"GH-45 GL-193 squash! amend! redo the artistic performance"}
	${"`Token`squash! need more tokens"}
	${"[fixup!] #37: fixed it"}
	${'revert "fixup! add a semicolon for good luck"'}
`(
	"when the subject line of $subjectLine has other tokens before a potential squash marker",
	(props: { subjectLine: string; expectedTokens: Tokens }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("does not extract any squash tokens", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).not.toContainToken("squash")
		})
	},
)

describe.each`
	subjectLine
	${"Make the commit scream fixup! again"}
	${"there's no squash! to see here"}
	${"wip! Make amend!s"}
	${"!amendrelease"}
	${"!fixuptest"}
	${"!squashAdd more numbers to the spreadsheet"}
	${"amend the message"}
	${"fixup"}
	${"squash the bugs"}
	${"Squash tennis and pumpkins"}
	${"Done!"}
	${"let's go!!"}
`(
	"when the subject line of $subjectLine does not contain a squash marker",
	(props: { subjectLine: string }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("does not extract any squash tokens", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).not.toContainToken("squash")
		})
	},
)

describe("when issue link tokenisation accepts GitHub-/GitLab-style prefixes and custom wildcards", () => {
	const githubIssueLinks = fakeTokenConfiguration({
		issueLinks: issueLinkConfiguration(["#", "GH-", "GL-"], ["(no-issue)", "[incident]"]),
	})

	describe.each`
		subjectLine                                                        | expectedTokens
		${"#1"}                                                            | ${[issuelink("#1")]}
		${"GH-0"}                                                          | ${[issuelink("GH-0")]}
		${"GL-4 over the hedge"}                                           | ${[issuelink("GL-4"), space(4), word("over", 5), space(9), word("the", 10), space(13), word("hedge", 14)]}
		${"-#1079"}                                                        | ${[punctuation("-"), issuelink("#1079", 1)]}
		${"Closes #24."}                                                   | ${[word("Closes"), space(6), issuelink("#24", 7), punctuation(".", 10)]}
		${"#1.5"}                                                          | ${[issuelink("#1"), punctuation(".", 2), word("5", 3)]}
		${"##78"}                                                          | ${[punctuation("#"), issuelink("#78", 1)]}
		${"#2 Release the robot butler"}                                   | ${[issuelink("#2"), space(2), word("Release", 3), space(10), word("the", 11), space(14), word("robot", 15), space(20), word("butler", 21)]}
		${"(#12) Fix this confusing plate of spaghetti"}                   | ${[issuelink("(#12)"), space(5), word("Fix", 6), space(9), word("this", 10), space(14), word("confusing", 15), space(24), word("plate", 25), space(30), word("of", 31), space(33), word("spaghetti", 34)]}
		${"amend!#59: Sneak in a funny easter egg"}                        | ${[squash("amend!"), issuelink("#59:", 6), space(10), word("Sneak", 11), space(16), word("in", 17), space(19), word("a", 20), space(21), word("funny", 22), space(27), word("easter", 28), space(34), word("egg", 35)]}
		${" #8 #9 Solve the problem"}                                      | ${[space(), issuelink("#8", 1), space(3), issuelink("#9", 4), space(6), word("Solve", 7), space(12), word("the", 13), space(16), word("problem", 17)]}
		${"(GH-15) #30 [#45]:  make the program act like a clown GL-60"}   | ${[issuelink("(GH-15)"), space(7), issuelink("#30", 8), space(11), issuelink("[#45]:", 12), whitespace("  ", 18), word("make", 20), space(24), word("the", 25), space(28), word("program", 29), space(36), word("act", 37), space(40), word("like", 41), space(45), word("a", 46), space(47), word("clown", 48), space(53), issuelink("GL-60", 54)]}
		${"Add some extra love to the code #7"}                            | ${[word("Add"), space(3), word("some", 4), space(8), word("extra", 9), space(14), word("love", 15), space(19), word("to", 20), space(22), word("the", 23), space(26), word("code", 27), space(31), issuelink("#7", 32)]}
		${"squash! Apply strawberry jam to make the code sweeter (#7044)"} | ${[squash("squash!"), space(7), word("Apply", 8), space(13), word("strawberry", 14), space(24), word("jam", 25), space(28), word("to", 29), space(31), word("make", 32), space(36), word("the", 37), space(40), word("code", 41), space(45), word("sweeter", 46), space(53), issuelink("(#7044)", 54)]}
		${"amend!(#42)Soften the API boundaries"}                          | ${[squash("amend!"), issuelink("(#42)", 6), word("Soften", 11), space(17), word("the", 18), space(21), word("API", 22), space(25), word("boundaries", 26)]}
		${"Make the user interface less chaotic [GL-11] #17 "}             | ${[word("Make"), space(4), word("the", 5), space(8), word("user", 9), space(13), word("interface", 14), space(23), word("less", 24), space(28), word("chaotic", 29), space(36), issuelink("[GL-11]", 37), space(44), issuelink("#17", 45), space(48)]}
		${"squash! #12 Throw a tantrum (#34) #56 {GH-78} #90"}             | ${[squash("squash!"), space(7), issuelink("#12", 8), space(11), word("Throw", 12), space(17), word("a", 18), space(19), word("tantrum", 20), space(27), issuelink("(#34)", 28), space(33), issuelink("#56", 34), space(37), issuelink("{GH-78}", 38), space(45), issuelink("#90", 46)]}
		${"fixup! Close #1337 by fixing the bug"}                          | ${[squash("fixup!"), space(6), word("Close", 7), space(12), issuelink("#1337", 13), space(18), word("by", 19), space(21), word("fixing", 22), space(28), word("the", 29), space(32), word("bug", 33)]}
		${"<#71238> loosen the bolts"}                                     | ${[issuelink("<#71238>"), space(8), word("loosen", 9), space(15), word("the", 16), space(19), word("bolts", 20)]}
		${'Revert "[GH-39] This should fix it. Famous last words"'}        | ${[revert("Revert"), space(6), punctuation('"', 7), issuelink("[GH-39]", 8), space(15), word("This", 16), space(20), word("should", 21), space(27), word("fix", 28), space(31), word("it", 32), punctuation(".", 34), space(35), word("Famous", 36), space(42), word("last", 43), space(47), word("words", 48), punctuation('"', 53)]}
		${"(no-issue) Polish the moon laser"}                              | ${[issuelink("(no-issue)"), space(10), word("Polish", 11), space(17), word("the", 18), space(21), word("moon", 22), space(26), word("laser", 27)]}
		${"Add safety rails (no-issue)"}                                   | ${[word("Add"), space(3), word("safety", 4), space(10), word("rails", 11), space(16), issuelink("(no-issue)", 17)]}
		${"squash! [incident] Teach the logs to use their inside voice"}   | ${[squash("squash!"), space(7), issuelink("[incident]", 8), space(18), word("Teach", 19), space(24), word("the", 25), space(28), word("logs", 29), space(33), word("to", 34), space(36), word("use", 37), space(40), word("their", 41), space(46), word("inside", 47), space(53), word("voice", 54)]}
		${"(no-issue) #1107 Stop the toaster from joining standup"}        | ${[issuelink("(no-issue)"), space(10), issuelink("#1107", 11), space(16), word("Stop", 17), space(21), word("the", 22), space(25), word("toaster", 26), space(33), word("from", 34), space(38), word("joining", 39), space(46), word("standup", 47)]}
		${"[incident] Skip #42 and UNICORN-8"}                             | ${[issuelink("[incident]"), space(10), word("Skip", 11), space(15), issuelink("#42", 16), space(19), word("and", 20), space(23), word("UNICORN-8", 24)]}
		${"fixup![incident](no-issue){#621}secure the rail signals"}       | ${[squash("fixup!"), issuelink("[incident]", 6), issuelink("(no-issue)", 16), issuelink("{#621}", 26), word("secure", 32), space(38), word("the", 39), space(42), word("rail", 43), space(47), word("signals", 48)]}
	`(
		"and the subject line of $subjectLine contains GitHub-/GitLab-style issue links or wildcards",
		(props: { subjectLine: string; expectedTokens: Tokens }) => {
			const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

			it("extracts issuelink tokens", () => {
				expect(props.expectedTokens).toContainToken("issuelink")

				const commit = mapCrudeCommitToCommit(crudeCommit, githubIssueLinks)
				expect(commit.subjectLine).toEqual(props.expectedTokens)
			})
		},
	)

	describe.each`
		subjectLine
		${"#"}
		${"#MAIN"}
		${"gh-40 Gl-41 have wrong casing"}
		${"Add #fluent and #api as relevant tags"}
		${"the syntax is #(42)"}
		${"add the GH-cli"}
		${"GL--"}
		${"undo gh-view"}
		${"(NO-ISSUE) Polish the moon laser"}
		${"Sprinkles gl-amour on the buggy code"}
		${"GL-gh"}
		${"-468"}
		${"use line comments with 0#"}
		${"Add safety rails no-issue"}
		${"[Incident] Teach the logs to use their inside voice"}
		${"just like the outer space incident"}
	`(
		"and the subject line of $subjectLine does not contain any GitHub-/GitLab-style issue links or wildcards",
		(props: { subjectLine: string }) => {
			const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

			it("does not extract any issuelink tokens", () => {
				const commit = mapCrudeCommitToCommit(crudeCommit, githubIssueLinks)
				expect(commit.subjectLine).not.toContainToken("issuelink")
			})
		},
	)
})

describe("when issue link tokenisation accepts Jira-style prefixes and custom wildcards", () => {
	const jiraIssueLinks = fakeTokenConfiguration({
		issueLinks: issueLinkConfiguration(["UNICORN-"], ["#SECURITY"]),
	})

	describe.each`
		subjectLine                                                                              | expectedTokens
		${"UNICORN-1"}                                                                           | ${[issuelink("UNICORN-1")]}
		${"UNICORN-2 Release the robot butler"}                                                  | ${[issuelink("UNICORN-2"), space(9), word("Release", 10), space(17), word("the", 18), space(21), word("robot", 22), space(27), word("butler", 28)]}
		${"(UNICORN-12) Fix this confusing plate of spaghetti"}                                  | ${[issuelink("(UNICORN-12)"), space(12), word("Fix", 13), space(16), word("this", 17), space(21), word("confusing", 22), space(31), word("plate", 32), space(37), word("of", 38), space(40), word("spaghetti", 41)]}
		${"amend!UNICORN-59: Sneak in a funny easter egg"}                                       | ${[squash("amend!"), issuelink("UNICORN-59:", 6), space(17), word("Sneak", 18), space(23), word("in", 24), space(26), word("a", 27), space(28), word("funny", 29), space(34), word("easter", 35), space(41), word("egg", 42)]}
		${" UNICORN-8 UNICORN-9 Solve the problem"}                                              | ${[space(), issuelink("UNICORN-8", 1), space(10), issuelink("UNICORN-9", 11), space(20), word("Solve", 21), space(26), word("the", 27), space(30), word("problem", 31)]}
		${"(UNICORN-15) UNICORN-30 [UNICORN-45]:  make the program act like a clown UNICORN-60"} | ${[issuelink("(UNICORN-15)"), space(12), issuelink("UNICORN-30", 13), space(23), issuelink("[UNICORN-45]:", 24), whitespace("  ", 37), word("make", 39), space(43), word("the", 44), space(47), word("program", 48), space(55), word("act", 56), space(59), word("like", 60), space(64), word("a", 65), space(66), word("clown", 67), space(72), issuelink("UNICORN-60", 73)]}
		${"Add some extra love to the code UNICORN-7"}                                           | ${[word("Add"), space(3), word("some", 4), space(8), word("extra", 9), space(14), word("love", 15), space(19), word("to", 20), space(22), word("the", 23), space(26), word("code", 27), space(31), issuelink("UNICORN-7", 32)]}
		${"squash! Apply strawberry jam to make the code sweeter (UNICORN-7044)"}                | ${[squash("squash!"), space(7), word("Apply", 8), space(13), word("strawberry", 14), space(24), word("jam", 25), space(28), word("to", 29), space(31), word("make", 32), space(36), word("the", 37), space(40), word("code", 41), space(45), word("sweeter", 46), space(53), issuelink("(UNICORN-7044)", 54)]}
		${"Make the user interface less chaotic [UNICORN-11] UNICORN-17 "}                       | ${[word("Make"), space(4), word("the", 5), space(8), word("user", 9), space(13), word("interface", 14), space(23), word("less", 24), space(28), word("chaotic", 29), space(36), issuelink("[UNICORN-11]", 37), space(49), issuelink("UNICORN-17", 50), space(60)]}
		${"squash! UNICORN-12 Throw a tantrum (UNICORN-34) UNICORN-56 {UNICORN-78} UNICORN-90"}  | ${[squash("squash!"), space(7), issuelink("UNICORN-12", 8), space(18), word("Throw", 19), space(24), word("a", 25), space(26), word("tantrum", 27), space(34), issuelink("(UNICORN-34)", 35), space(47), issuelink("UNICORN-56", 48), space(58), issuelink("{UNICORN-78}", 59), space(71), issuelink("UNICORN-90", 72)]}
		${"fixup! Close UNICORN-1337 by fixing the bug"}                                         | ${[squash("fixup!"), space(6), word("Close", 7), space(12), issuelink("UNICORN-1337", 13), space(25), word("by", 26), space(28), word("fixing", 29), space(35), word("the", 36), space(39), word("bug", 40)]}
		${"<UNICORN-71238> loosen the bolts"}                                                    | ${[issuelink("<UNICORN-71238>"), space(15), word("loosen", 16), space(22), word("the", 23), space(26), word("bolts", 27)]}
		${'Revert "[UNICORN-39] This should fix it. Famous last words"'}                         | ${[revert("Revert"), space(6), punctuation('"', 7), issuelink("[UNICORN-39]", 8), space(20), word("This", 21), space(25), word("should", 26), space(32), word("fix", 33), space(36), word("it", 37), punctuation(".", 39), space(40), word("Famous", 41), space(47), word("last", 48), space(52), word("words", 53), punctuation('"', 58)]}
		${"#SECURITY bricked the wifi circuits"}                                                 | ${[issuelink("#SECURITY"), space(9), word("bricked", 10), space(17), word("the", 18), space(21), word("wifi", 22), space(26), word("circuits", 27)]}
		${"UNICORN-880 stop mixing the toxic chemicals #SECURITY"}                               | ${[issuelink("UNICORN-880"), space(11), word("stop", 12), space(16), word("mixing", 17), space(23), word("the", 24), space(27), word("toxic", 28), space(33), word("chemicals", 34), space(43), issuelink("#SECURITY", 44)]}
	`(
		"and the subject line of $subjectLine contains Jira-style issue links or wildcards",
		(props: { subjectLine: string; expectedTokens: Tokens }) => {
			const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

			it("extracts issuelink tokens", () => {
				expect(props.expectedTokens).toContainToken("issuelink")

				const commit = mapCrudeCommitToCommit(crudeCommit, jiraIssueLinks)
				expect(commit.subjectLine).toEqual(props.expectedTokens)
			})
		},
	)

	describe.each`
		subjectLine
		${"UNICORN-"}
		${"unicorn-40 UnIcOrN-41 have wrong casing"}
		${"UNICORN-MAIN"}
		${"Add unicorn-specialities to the masses"}
		${"the syntax is UNICORN-(42)"}
		${"#1"}
		${"UNICORNS ASSEMBLE"}
		${"GH-15 GL-392 extra spicy code detected"}
		${"needs a bit more #security"}
		${"[SECURITY] Upgrade the Unicorn-1337 tech stack to the latest and greatest"}
	`(
		"and the subject line of $subjectLine does not contain any Jira-style issue links or wildcards",
		(props: { subjectLine: string }) => {
			const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

			it("does not extract any issuelink tokens", () => {
				const commit = mapCrudeCommitToCommit(crudeCommit, jiraIssueLinks)
				expect(commit.subjectLine).not.toContainToken("issuelink")
			})
		},
	)
})

describe("when issue link tokenisation accepts Jira-style prefixes and no wildcards", () => {
	const noWildcardIssueLinks = fakeTokenConfiguration({
		issueLinks: issueLinkConfiguration(["COMET-"]),
	})

	describe.each`
		subjectLine                                 | expectedTokens
		${"COMET-42 closes [incident]"}             | ${[issuelink("COMET-42"), space(8), word("closes", 9), space(15), punctuation("[", 16), word("incident", 17), punctuation("]", 25)]}
		${"[COMET-7]: Make the deploy robot smile"} | ${[issuelink("[COMET-7]:"), space(10), word("Make", 11), space(15), word("the", 16), space(19), word("deploy", 20), space(26), word("robot", 27), space(32), word("smile", 33)]}
	`(
		"and the subject line of $subjectLine contains potential issue links",
		(props: { subjectLine: string; expectedTokens: Tokens }) => {
			const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

			it("extracts only the configured issuelink tokens", () => {
				expect(props.expectedTokens).toContainToken("issuelink")

				const commit = mapCrudeCommitToCommit(crudeCommit, noWildcardIssueLinks)
				expect(commit.subjectLine).toEqual(props.expectedTokens)
			})
		},
	)
})

describe("when issue link tokenisation accepts wildcards only", () => {
	const wildcardOnlyIssueLinks = fakeTokenConfiguration({
		issueLinks: issueLinkConfiguration([], ["[incident]"]),
	})

	describe.each`
		subjectLine                                   | expectedTokens
		${"[incident] COMET-42 is queued"}            | ${[issuelink("[incident]"), space(10), word("COMET-42", 11), space(19), word("is", 20), space(22), word("queued", 23)]}
		${"Warm [incident] gloves before deployment"} | ${[word("Warm"), space(4), issuelink("[incident]", 5), space(15), word("gloves", 16), space(22), word("before", 23), space(29), word("deployment", 30)]}
	`(
		"and the subject line of $subjectLine contains potential issue links",
		(props: { subjectLine: string; expectedTokens: Tokens }) => {
			const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

			it("extracts only the configured issuelink tokens", () => {
				expect(props.expectedTokens).toContainToken("issuelink")

				const commit = mapCrudeCommitToCommit(crudeCommit, wildcardOnlyIssueLinks)
				expect(commit.subjectLine).toEqual(props.expectedTokens)
			})
		},
	)
})

describe("when issue link tokenisation is disabled", () => {
	const noIssueLinks = fakeTokenConfiguration({ issueLinks: null })

	describe.each`
		subjectLine
		${"#1"}
		${"GH-15 GL-392 extra spicy code detected"}
		${"GH-27 loses its badge"}
		${"Add some extra love to the code #7"}
		${"(no-issue) #1107 Stop the toaster from joining standup"}
		${"Make the user interface less chaotic [GL-11] #17 "}
		${"(UNICORN-12) Fix this confusing plate of spaghetti"}
		${"(UNICORN-15) UNICORN-30 [UNICORN-45]:  make the program act like a clown UNICORN-60"}
		${"#SECURITY bricked the wifi circuits"}
	`(
		"and the subject line of $subjectLine contains potential issue links",
		(props: { subjectLine: string }) => {
			const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

			it("does not extract any issuelink tokens", () => {
				const commit = mapCrudeCommitToCommit(crudeCommit, noIssueLinks)
				expect(commit.subjectLine).not.toContainToken("issuelink")
			})
		},
	)
})

describe.each`
	subjectLine                  | body                                                                                           | expectedBodyLines
	${"Upgrade dependencies"}    | ${"This commit upgrades the following dependency:\n- `@types/node` from 20.19.20 to 20.19.23"} | ${[[word("This"), space(4), word("commit", 5), space(11), word("upgrades", 12), space(20), word("the", 21), space(24), word("following", 25), space(34), word("dependency", 35), punctuation(":", 45)], [punctuation("-"), space(1), code("`@types/node`", 2), space(15), word("from", 16), space(20), word("20", 21), punctuation(".", 23), word("19", 24), punctuation(".", 26), word("20", 27), space(29), word("to", 30), space(32), word("20", 33), punctuation(".", 35), word("19", 36), punctuation(".", 38), word("23", 39)]]}
	${"Archive tagged snippets"} | ${"Stash `#42 v1.2.3` safely."}                                                                | ${[[word("Stash"), space(5), code("`#42 v1.2.3`", 6), space(18), word("safely", 19), punctuation(".", 25)]]}
	${"tuned robot inspector"}   | ${"Queue `mise run check` at 03:14."}                                                          | ${[[word("Queue"), space(5), code("`mise run check`", 6), space(22), word("at", 23), space(25), word("03", 26), punctuation(":", 28), word("14", 29), punctuation(".", 31)]]}
	${"Swap miniature widgets"}  | ${"Trade `alpha`, `beta`, & `gamma`."}                                                         | ${[[word("Trade"), space(5), code("`alpha`", 6), punctuation(",", 13), space(14), code("`beta`", 15), punctuation(",", 21), space(22), punctuation("&", 23), space(24), code("`gamma`", 25), punctuation(".", 32)]]}
`(
	"when the message body of $body contains inline code phrases",
	(props: { subjectLine: string; body: string; expectedBodyLines: Array<Tokens> }) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("extracts code tokens in the message body", () => {
			expect(props.expectedBodyLines).toContainToken("code")

			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual(props.expectedBodyLines)
		})
	},
)

describe.each`
	subjectLine                    | body                                   | expectedBodyLines
	${"Reconcile patch history"}   | ${'fixup! Revert "2.7.9"'}             | ${[[word("fixup"), punctuation("!", 5), space(6), word("Revert", 7), space(13), punctuation('"', 14), word("2", 15), punctuation(".", 16), word("7", 17), punctuation(".", 18), word("9", 19), punctuation('"', 20)]]}
	${"lowercase deployment memo"} | ${'amend! revert "0.4.2"'}             | ${[[word("amend"), punctuation("!", 5), space(6), word("revert", 7), space(13), punctuation('"', 14), word("0", 15), punctuation(".", 16), word("4", 17), punctuation(".", 18), word("2", 19), punctuation('"', 20)]]}
	${"Catalogue odd branches"}    | ${"!squash Update c0ffee42 carefully"} | ${[[punctuation("!"), word("squash", 1), space(7), word("Update", 8), space(14), word("c0ffee42", 15), space(23), word("carefully", 24)]]}
`(
	"when the message body of $body contains subject-line-only token patterns",
	(props: { subjectLine: string; body: string; expectedBodyLines: Array<Tokens> }) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("keeps them as ordinary body-line tokens", () => {
			expect(props.expectedBodyLines).not.toContainToken("revert", "semver", "squash")

			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual(props.expectedBodyLines)
		})
	},
)

describe.each`
	subjectLine                                  | body                                                                                                                                                     | expectedBodyLines
	${"Teach the parser to carry tiny snippets"} | ${'The recipe starts here.\n```js\nconst snack = "waffle"\nconsole.log(snack)\n```\nAnd then the prose comes back.'}                                     | ${[[word("The"), space(3), word("recipe", 4), space(10), word("starts", 11), space(17), word("here", 18), punctuation(".", 22)], [codeblock("```js")], [codeblock('const snack = "waffle"')], [codeblock("console.log(snack)")], [codeblock("```")], [word("And"), space(3), word("then", 4), space(8), word("the", 9), space(12), word("prose", 13), space(18), word("comes", 19), space(24), word("back", 25), punctuation(".", 29)]]}
	${"let the empty block breathe"}             | ${"Before\n```\n```\nAfter"}                                                                                                                             | ${[[word("Before")], [codeblock("```")], [codeblock("```")], [word("After")]]}
	${"Keep code that smells like trailerkeys"}  | ${"```\nRefs: #404\nBREAKING CHANGE: the toaster learned sarcasm\n```\nSigned-off-by: Master Splinter <sensei@ninja-academy.com>"}                       | ${[[codeblock("```")], [codeblock("Refs: #404")], [codeblock("BREAKING CHANGE: the toaster learned sarcasm")], [codeblock("```")], [trailerkey("Signed-off-by"), punctuation(":", 13), space(14), word("Master", 15), space(21), word("Splinter", 22), space(30), punctuation("<", 31), word("sensei", 32), punctuation("@", 38), word("ninja-academy", 39), punctuation(".", 52), word("com", 53), punctuation(">", 56)]]}
	${"Tokenise two separate code postcards"}    | ${"```ts\nconst first = true\n```\nMiddle words.\n```sh\necho second\n```"}                                                                              | ${[[codeblock("```ts")], [codeblock("const first = true")], [codeblock("```")], [word("Middle"), space(6), word("words", 7), punctuation(".", 12)], [codeblock("```sh")], [codeblock("echo second")], [codeblock("```")]]}
	${"unclosed note fenced"}                    | ${'Intro\n```json\n{ "verified": false }\nRefs: #9001'}                                                                                                  | ${[[word("Intro")], [codeblock("```json")], [codeblock('{ "verified": false }')], [codeblock("Refs: #9001")]]}
	${"install the ceremonial shell helpers"}    | ${'```shell\npnpm add @rainstormy/comet-sprinkles --save-dev\npnpm exec comet --mode="committee-approved"\n```'}                                         | ${[[codeblock("```shell")], [codeblock("pnpm add @rainstormy/comet-sprinkles --save-dev")], [codeblock('pnpm exec comet --mode="committee-approved"')], [codeblock("```")]]}
	${"One long release breadcrumb"}             | ${'```shell\ncurl -L https://example.com/releases/2026/quietly-dramatic/checksums/commit-message-linter.tar.gz\nprintf "deploy window: 03:14 UTC"\n```'} | ${[[codeblock("```shell")], [codeblock("curl -L https://example.com/releases/2026/quietly-dramatic/checksums/commit-message-linter.tar.gz")], [codeblock('printf "deploy window: 03:14 UTC"')], [codeblock("```")]]}
	${"no tokenised links inside text fences"}   | ${"```text\nhttps://status.example.com/incidents/2026/06/14/linting-pipeline-refused-to-wear-a-tie?component=commit-body&severity=medium\n```"}          | ${[[codeblock("```text")], [codeblock("https://status.example.com/incidents/2026/06/14/linting-pipeline-refused-to-wear-a-tie?component=commit-body&severity=medium")], [codeblock("```")]]}
	${"Close a tiny fence with a bigger one"}    | ${'```\nconst cake = "tiny"\n````\nstill-open: not a trailerkey because fence was not closed properly\nand more prose follows'}                          | ${[[codeblock("```")], [codeblock('const cake = "tiny"')], [codeblock("````")], [codeblock("still-open: not a trailerkey because fence was not closed properly")], [codeblock("and more prose follows")]]}
`(
	"when the message body of $body contains triple-backtick fenced code blocks",
	(props: { subjectLine: string; body: string; expectedBodyLines: Array<Tokens> }) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("does not extract any codeblock tokens in the subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).not.toContainToken("codeblock")
		})

		it("extracts codeblock tokens in the message body", () => {
			expect(props.expectedBodyLines).toContainToken("codeblock")

			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual(props.expectedBodyLines)
		})
	},
)

describe.each`
	subjectLine                                     | body                                                                                                                                                                                                                                    | expectedBodyLines
	${"nested fences inside bigger fences"}         | ${"````markdown\n```ts\nconst nested = true\n```\n````\nBack to ordinary markdown."}                                                                                                                                                    | ${[[codeblock("````markdown")], [codeblock("```ts")], [codeblock("const nested = true")], [codeblock("```")], [codeblock("````")], [word("Back"), space(4), word("to", 5), space(7), word("ordinary", 8), space(16), word("markdown", 17), punctuation(".", 25)]]}
	${"Keep triple ticks boring inside four ticks"} | ${"````\n```\nRefs: #111\n```\n````\nReviewed-by: Clipboard Captain <clip@example.com>"}                                                                                                                                                | ${[[codeblock("````")], [codeblock("```")], [codeblock("Refs: #111")], [codeblock("```")], [codeblock("````")], [trailerkey("Reviewed-by"), punctuation(":", 11), space(12), word("Clipboard", 13), space(22), word("Captain", 23), space(30), punctuation("<", 31), word("clip", 32), punctuation("@", 36), word("example", 37), punctuation(".", 44), word("com", 45), punctuation(">", 48)]]}
	${"calm heredocs around nested fences"}         | ${"````shell\ncat <<EOF > README.md\n```shell\npnpm add imaginary-updraft --filter ./packages/comet\nEOF\n````"}                                                                                                                        | ${[[codeblock("````shell")], [codeblock("cat <<EOF > README.md")], [codeblock("```shell")], [codeblock("pnpm add imaginary-updraft --filter ./packages/comet")], [codeblock("EOF")], [codeblock("````")]]}
	${"Archived the documentation breadcrumb"}      | ${'````markdown\n[release ledger](https://docs.example.com/products/comet/releases/2026/06/fenced-code-block-tokeniser?view=full&section=body-lines)\n```json\n{ "nested": true, "reason": "documentation copied itself" }\n```\n````'} | ${[[codeblock("````markdown")], [codeblock("[release ledger](https://docs.example.com/products/comet/releases/2026/06/fenced-code-block-tokeniser?view=full&section=body-lines)")], [codeblock("```json")], [codeblock('{ "nested": true, "reason": "documentation copied itself" }')], [codeblock("```")], [codeblock("````")]]}
`(
	"when the message body of $body contains quadruple-backtick fenced code blocks",
	(props: { subjectLine: string; body: string; expectedBodyLines: Array<Tokens> }) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("does not extract any codeblock tokens in the subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).not.toContainToken("codeblock")
		})

		it("extracts codeblock tokens in the message body", () => {
			expect(props.expectedBodyLines).toContainToken("codeblock")

			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual(props.expectedBodyLines)
		})
	},
)

describe.each`
	subjectLine                                   | body
	${"indented triple fences"}                   | ${"  ```ts\nconst outside = true\n ```"}
	${"indented quadruple fences"}                | ${" ````markdown\n ```shell\npnpm add pretend-package\n ````"}
	${"Inline backticks is plain prose"}          | ${"This mentions ``` without starting at the beginning.\nAnd this line stays normal as well."}
	${"same goes for inline quadruple backticks"} | ${"The note says ````markdown halfway through the sentence.\nEven https://example.com/````/notes stays plain."}
	${"Ignore fences after impatient prefixes"}   | ${"prefix ```shell\nprefix ````markdown\ntext before ``` and text before ````"}
`(
	"when the message body of $body contains backticks that do not begin a fenced code block",
	(props: { subjectLine: string; body: string; expectedBodyLines: Array<Tokens> }) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("does not extract any codeblock tokens in the subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).not.toContainToken("codeblock")
		})

		it("does not extract any codeblock tokens in the message body", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).not.toContainToken("codeblock")
		})
	},
)

describe.each`
	subjectLine                                         | body                                                                                                                                                                                                                                        | expectedSubjectLine                                                                                                                                                                                                                                                            | expectedBodyLines
	${"Update src/main.ts"}                             | ${"\nCo-Authored-By: Everloving Easter Bunny <everloving.easter.bunny@example.com>"}                                                                                                                                                        | ${[word("Update"), space(6), word("src", 7), punctuation("/", 10), word("main", 11), punctuation(".", 15), word("ts", 16)]}                                                                                                                                                    | ${[[], [trailerkey("Co-Authored-By"), punctuation(":", 14), space(15), word("Everloving", 16), space(26), word("Easter", 27), space(33), word("Bunny", 34), space(39), punctuation("<", 40), word("everloving", 41), punctuation(".", 51), word("easter", 52), punctuation(".", 58), word("bunny", 59), punctuation("@", 64), word("example", 65), punctuation(".", 72), word("com", 73), punctuation(">", 76)]]}
	${"Teach the changelog to whisper"}                 | ${"\nThe noisy bits moved to the release notes.\n\nFooter: charming"}                                                                                                                                                                       | ${[word("Teach"), space(5), word("the", 6), space(9), word("changelog", 10), space(19), word("to", 20), space(22), word("whisper", 23)]}                                                                                                                                       | ${[[], [word("The"), space(3), word("noisy", 4), space(9), word("bits", 10), space(14), word("moved", 15), space(20), word("to", 21), space(23), word("the", 24), space(27), word("release", 28), space(35), word("notes", 36), punctuation(".", 41)], [], [trailerkey("Footer"), punctuation(":", 6), space(7), word("charming", 8)]]}
	${"do some pair programming"}                       | ${"\nthis commit is a collab\nco-authored-by: santa claus <santa.claus@example.com>\nco-authored-by  : gingerbread man <gingerbread.man@example.com>\nreported-by: little mermaid <little.mermaid@example.com>"}                            | ${[word("do"), space(2), word("some", 3), space(7), word("pair", 8), space(12), word("programming", 13)]}                                                                                                                                                                      | ${[[], [word("this"), space(4), word("commit", 5), space(11), word("is", 12), space(14), word("a", 15), space(16), word("collab", 17)], [trailerkey("co-authored-by"), punctuation(":", 14), space(15), word("santa", 16), space(21), word("claus", 22), space(27), punctuation("<", 28), word("santa", 29), punctuation(".", 34), word("claus", 35), punctuation("@", 40), word("example", 41), punctuation(".", 48), word("com", 49), punctuation(">", 52)], [trailerkey("co-authored-by"), whitespace("  ", 14), punctuation(":", 16), space(17), word("gingerbread", 18), space(29), word("man", 30), space(33), punctuation("<", 34), word("gingerbread", 35), punctuation(".", 46), word("man", 47), punctuation("@", 50), word("example", 51), punctuation(".", 58), word("com", 59), punctuation(">", 62)], [trailerkey("reported-by"), punctuation(":", 11), space(12), word("little", 13), space(19), word("mermaid", 20), space(27), punctuation("<", 28), word("little", 29), punctuation(".", 35), word("mermaid", 36), punctuation("@", 43), word("example", 44), punctuation(".", 51), word("com", 52), punctuation(">", 55)]]}
	${"Calibrate `HotChocolateMachine`"}                | ${"The pressure now stays pleasantly dramatic.\n Signed-off-by:Michelangelo di Lodovico Buonarroti Simoni <28317649+cowabunga@users.noreply.github.com>"}                                                                                   | ${[word("Calibrate"), space(9), code("`HotChocolateMachine`", 10)]}                                                                                                                                                                                                            | ${[[word("The"), space(3), word("pressure", 4), space(12), word("now", 13), space(16), word("stays", 17), space(22), word("pleasantly", 23), space(33), word("dramatic", 34), punctuation(".", 42)], [space(), trailerkey("Signed-off-by", 1), punctuation(":", 14), word("Michelangelo", 15), space(27), word("di", 28), space(30), word("Lodovico", 31), space(39), word("Buonarroti", 40), space(50), word("Simoni", 51), space(57), punctuation("<", 58), word("28317649", 59), punctuation("+", 67), word("cowabunga", 68), punctuation("@", 77), word("users", 78), punctuation(".", 83), word("noreply", 84), punctuation(".", 91), word("github", 92), punctuation(".", 98), word("com", 99), punctuation(">", 102)]]}
	${"Upgrade the badge printer"}                      | ${"\nThe queue no longer panics.\nSchemamaxxed the validation and protected the valuable payload.\n\nRefs :: #123\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>\n\nBREAKING CHANGE: Old badge templates are gone."} | ${[word("Upgrade"), space(7), word("the", 8), space(11), word("badge", 12), space(17), word("printer", 18)]}                                                                                                                                                                   | ${[[], [word("The"), space(3), word("queue", 4), space(9), word("no", 10), space(12), word("longer", 13), space(19), word("panics", 20), punctuation(".", 26)], [word("Schemamaxxed"), space(12), word("the", 13), space(16), word("validation", 17), space(27), word("and", 28), space(31), word("protected", 32), space(41), word("the", 42), space(45), word("valuable", 46), space(54), word("payload", 55), punctuation(".", 62)], [], [trailerkey("Refs"), space(4), punctuation("::", 5), space(7), punctuation("#", 8), word("123", 9)], [trailerkey("Co-authored-by"), punctuation(":", 14), space(15), word("Copilot", 16), space(23), punctuation("<", 24), word("223556219", 25), punctuation("+", 34), word("Copilot", 35), punctuation("@", 42), word("users", 43), punctuation(".", 48), word("noreply", 49), punctuation(".", 56), word("github", 57), punctuation(".", 63), word("com", 64), punctuation(">", 67)], [], [trailerkey("BREAKING CHANGE"), punctuation(":", 15), space(16), word("Old", 17), space(20), word("badge", 21), space(26), word("templates", 27), space(36), word("are", 37), space(40), word("gone", 41), punctuation(".", 45)]]}
	${"Credit the careful reviewers"}                   | ${"\n\n  Reviewed-by:  April O'Neil <april.oneil@fastforward.com>\n\nSigned-off-by: baxter.stockman <baxter.stockman@fastforward.com>\n"}                                                                                                   | ${[word("Credit"), space(6), word("the", 7), space(10), word("careful", 11), space(18), word("reviewers", 19)]}                                                                                                                                                                | ${[[], [], [whitespace("  "), trailerkey("Reviewed-by", 2), punctuation(":", 13), whitespace("  ", 14), word("April", 16), space(21), word("O'Neil", 22), space(28), punctuation("<", 29), word("april", 30), punctuation(".", 35), word("oneil", 36), punctuation("@", 41), word("fastforward", 42), punctuation(".", 53), word("com", 54), punctuation(">", 57)], [], [trailerkey("Signed-off-by"), punctuation(":", 13), space(14), word("baxter", 15), punctuation(".", 21), word("stockman", 22), space(30), punctuation("<", 31), word("baxter", 32), punctuation(".", 38), word("stockman", 39), punctuation("@", 47), word("fastforward", 48), punctuation(".", 59), word("com", 60), punctuation(">", 63)], []]}
	${"feat: document the careful shortcut"}            | ${"The body explains the shortcut.\nSigned-off-by: Master Splinter <sensei@ninja-academy.com>"}                                                                                                                                             | ${[word("feat"), punctuation(":", 4), space(5), word("document", 6), space(14), word("the", 15), space(18), word("careful", 19), space(26), word("shortcut", 27)]}                                                                                                             | ${[[word("The"), space(3), word("body", 4), space(8), word("explains", 9), space(17), word("the", 18), space(21), word("shortcut", 22), punctuation(".", 30)], [trailerkey("Signed-off-by"), punctuation(":", 13), space(14), word("Master", 15), space(21), word("Splinter", 22), space(30), punctuation("<", 31), word("sensei", 32), punctuation("@", 38), word("ninja-academy", 39), punctuation(".", 52), word("com", 53), punctuation(">", 56)]]}
	${"add some goongala to the battle shell"}          | ${"Refs: #1337\nWith extra slices of pizza!!\n\nReviewed-by: April O'Neil <april.oneil@fastforward.com>\nSigned-off-by: Casey Jones <casey.jones@fastforward.com>"}                                                                         | ${[word("add"), space(3), word("some", 4), space(8), word("goongala", 9), space(17), word("to", 18), space(20), word("the", 21), space(24), word("battle", 25), space(31), word("shell", 32)]}                                                                                 | ${[[word("Refs"), punctuation(":", 4), space(5), issuelink("#1337", 6)], [word("With"), space(4), word("extra", 5), space(10), word("slices", 11), space(17), word("of", 18), space(20), word("pizza", 21), punctuation("!!", 26)], [], [trailerkey("Reviewed-by"), punctuation(":", 11), space(12), word("April", 13), space(18), word("O'Neil", 19), space(25), punctuation("<", 26), word("april", 27), punctuation(".", 32), word("oneil", 33), punctuation("@", 38), word("fastforward", 39), punctuation(".", 50), word("com", 51), punctuation(">", 54)], [trailerkey("Signed-off-by"), punctuation(":", 13), space(14), word("Casey", 15), space(20), word("Jones", 21), space(26), punctuation("<", 27), word("casey", 28), punctuation(".", 33), word("jones", 34), punctuation("@", 39), word("fastforward", 40), punctuation(".", 51), word("com", 52), punctuation(">", 55)]]}
	${"Record the quiet acknowledgements"}              | ${"\nReviewed-by: \nBREAKING CHANGE:"}                                                                                                                                                                                                      | ${[word("Record"), space(6), word("the", 7), space(10), word("quiet", 11), space(16), word("acknowledgements", 17)]}                                                                                                                                                           | ${[[], [trailerkey("Reviewed-by"), punctuation(":", 11), space(12)], [trailerkey("BREAKING CHANGE"), punctuation(":", 15)]]}
	${"fixup! calibrate tiny robot (#88)"}              | ${"\n  reviewed-by:   the night baker   "}                                                                                                                                                                                                  | ${[squash("fixup!"), space(6), word("calibrate", 7), space(16), word("tiny", 17), space(21), word("robot", 22), space(27), issuelink("(#88)", 28)]}                                                                                                                            | ${[[], [whitespace("  "), trailerkey("reviewed-by", 2), punctuation(":", 13), whitespace("   ", 14), word("the", 17), space(20), word("night", 21), space(26), word("baker", 27), whitespace("   ", 32)]]}
	${"squash! Teach CI to whisper GL-42"}              | ${"ACKED-BY:\tCAPTAIN STATIC\t"}                                                                                                                                                                                                            | ${[squash("squash!"), space(7), word("Teach", 8), space(13), word("CI", 14), space(16), word("to", 17), space(19), word("whisper", 20), space(27), issuelink("GL-42", 28)]}                                                                                                    | ${[[trailerkey("ACKED-BY"), punctuation(":", 8), whitespace("\t", 9), word("CAPTAIN", 10), space(17), word("STATIC", 18), whitespace("\t", 24)]]}
	${'Revert "Footer: make old parser nervous (#19)"'} | ${"\nbreaking change:   switch to quieter alarms   "}                                                                                                                                                                                       | ${[revert("Revert"), space(6), punctuation('"', 7), word("Footer", 8), punctuation(":", 14), space(15), word("make", 16), space(20), word("old", 21), space(24), word("parser", 25), space(31), word("nervous", 32), space(39), issuelink("(#19)", 40), punctuation('"', 45)]} | ${[[], [trailerkey("breaking change"), punctuation(":", 15), whitespace("   ", 16), word("switch", 19), space(25), word("to", 26), space(28), word("quieter", 29), space(36), word("alarms", 37), whitespace("   ", 43)]]}
	${"deps: lower the tiny boom"}                      | ${"WISHLIST :   cake first, tests second   "}                                                                                                                                                                                               | ${[word("deps"), punctuation(":", 4), space(5), word("lower", 6), space(11), word("the", 12), space(15), word("tiny", 16), space(20), word("boom", 21)]}                                                                                                                       | ${[[trailerkey("WISHLIST"), space(8), punctuation(":", 9), whitespace("   ", 10), word("cake", 13), space(17), word("first", 18), punctuation(",", 23), space(24), word("tests", 25), space(30), word("second", 31), whitespace("   ", 37)]]}
	${"Add GPS notes"}                                  | ${"Refs: the map says key: value: keep walking"}                                                                                                                                                                                            | ${[word("Add"), space(3), word("GPS", 4), space(7), word("notes", 8)]}                                                                                                                                                                                                         | ${[[trailerkey("Refs"), punctuation(":", 4), space(5), word("the", 6), space(9), word("map", 10), space(13), word("says", 14), space(18), word("key", 19), punctuation(":", 22), space(23), word("value", 24), punctuation(":", 29), space(30), word("keep", 31), space(35), word("walking", 36)]]}
	${"Plan the loud migration"}                        | ${"\n\n\nBREAKING CHANGE: config now accepts host:port:mode"}                                                                                                                                                                               | ${[word("Plan"), space(4), word("the", 5), space(8), word("loud", 9), space(13), word("migration", 14)]}                                                                                                                                                                       | ${[[], [], [], [trailerkey("BREAKING CHANGE"), punctuation(":", 15), space(16), word("config", 17), space(23), word("now", 24), space(27), word("accepts", 28), space(35), word("host", 36), punctuation(":", 40), word("port", 41), punctuation(":", 45), word("mode", 46)]]}
	${"document the field notes"}                       | ${"co-authored-by: Donatello <42069849+gogogadget@users.noreply.github.com>: with field notes"}                                                                                                                                             | ${[word("document"), space(8), word("the", 9), space(12), word("field", 13), space(18), word("notes", 19)]}                                                                                                                                                                    | ${[[trailerkey("co-authored-by"), punctuation(":", 14), space(15), word("Donatello", 16), space(25), punctuation("<", 26), word("42069849", 27), punctuation("+", 35), word("gogogadget", 36), punctuation("@", 46), word("users", 47), punctuation(".", 52), word("noreply", 53), punctuation(".", 60), word("github", 61), punctuation(".", 67), word("com", 68), punctuation(">:", 71), space(73), word("with", 74), space(78), word("field", 79), space(84), word("notes", 85)]]}
`(
	"when the message body of $body contains trailers",
	(props: {
		subjectLine: string
		body: string
		expectedSubjectLine: Tokens
		expectedBodyLines: Array<Tokens>
	}) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("does not extract any trailerkey tokens in the subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).not.toContainToken("trailerkey")
		})

		it("extracts trailerkey tokens in the message body", () => {
			expect(props.expectedBodyLines).toContainToken("trailerkey")

			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual(props.expectedBodyLines)
		})
	},
)

describe.each`
	subjectLine                               | body
	${"Explain the suspicious label"}         | ${"Refs: This looked official for a moment.\nThen the paragraph kept going."}
	${"Do some pair programming"}             | ${"\nThis commit is a collab.\n\nCo-authored-by: Gon Freecss <rock.paper.scissors@hunters.com>\nCo-authored-by: Killua Zoldyck <killua@godspeed.net>\n Reported-by: Hisoka <no4@phantom.com>\n\nAll participants had fun.\n"}
	${"fixup! keep the lowercase memo"}       | ${"Footer: looks real\nthen it keeps talking"}
	${"SQUASH! no token here maybe"}          | ${"ACKED-BY: The Captain\nordinary words after the captain"}
	${'Revert "reviewed-by: subject mirage"'} | ${"breaking change: seems important\nbut this paragraph is still alive"}
`(
	"when the message body of $body contains trailer-like lines followed by regular lines of text",
	(props: { subjectLine: string; body: string }) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("does not extract any trailerkey tokens in the subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).not.toContainToken("trailerkey")
		})

		it("does not extract any trailerkey tokens in the message body", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).not.toContainToken("trailerkey")
		})
	},
)

describe.each`
	subjectLine                                                         | body
	${"bugfix"}                                                         | ${"attempt 2"}
	${"Refactor the taxi module"}                                       | ${"The roof sign now flashes politely."}
	${"Resolve the conflicts"}                                          | ${"\nConflicts:\n\n src/grumpy-cat.ts\n src/summer-vacation-plans.ts"}
	${"fixup! Upgrade @typescript-eslint/parser from 5.52.0 to 5.59.1"} | ${"\n\n\n\nBumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 5.52.0 to 5.59.1.\n- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)\n- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)"}
	${"lowercase chores only"}                                          | ${"This body mentions refs: #44 inline."}
	${"squash! refs: subject mirage"}                                   | ${"\nBREAKING CHANGE - not a colon trailer\nCo-authored-by = missing colon"}
	${'Revert "Signed-off-by: subject mirage"'}                         | ${"Signed-off-by:\nNo final trailer follows this sentence."}
	${"Add GPS notes"}                                                  | ${"trailer-like: starts the body\nregular line closes the paragraph"}
`(
	"when the message body of $body does not contain any trailers",
	(props: { subjectLine: string; body: string }) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("does not extract any trailerkey tokens in the subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).not.toContainToken("trailerkey")
		})

		it("does not extract any trailerkey tokens in the message body", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).not.toContainToken("trailerkey")
		})
	},
)

describe.each`
	subjectLine
	${"Refs: This looked official for a moment."}
	${"Signed-off-by: April O'Neil <april.oneil@fastforward.com>"}
	${"BREAKING CHANGE: The old badge printer retired."}
	${"Refs: looks official in the subject (#12)"}
	${"signed-off-by: lowercase subject only"}
	${"ACKED-BY: SUBJECT ONLY"}
`("when the subject line looks like a trailer", (props: { subjectLine: string }) => {
	const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

	it("does not extract any trailerkey tokens in the subject line", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.subjectLine).not.toContainToken("trailerkey")
	})

	it("has no body lines", () => {
		const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
		expect(commit.bodyLines).toEqual([])
	})
})
