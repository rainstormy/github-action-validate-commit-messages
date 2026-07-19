import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import {
	type Tokens,
	code,
	issuelink,
	punctuation,
	revert,
	space,
	squash,
	trailerkey,
	whitespace,
	word,
} from "#commits/tokens/Token.ts"
import { fakeTokenConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeTokenConfiguration()

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
	"when the commit message of $body contains trailers",
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
	"when the commit message of $body contains trailer-like lines followed by regular lines of text",
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
	"when the commit message of $body does not contain any trailers",
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
