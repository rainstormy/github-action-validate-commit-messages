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
	whitespace,
	word,
} from "#commits/tokens/Token.ts"
import { issueLinkPattern, tokeniseSubjectLine } from "#commits/tokens/Tokenise.ts"
import { fakeTokenConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeTokenConfiguration()

describe.each`
	subjectLine                                                                        | expectedTokens
	${"amend!"}                                                                        | ${[squash("amend!")]}
	${" amend!Apply strawberry jam to make the code sweeter"}                          | ${[space(), squash("amend!", 1), word("Apply", 7), space(12), word("strawberry", 13), space(23), word("jam", 24), space(27), word("to", 28), space(30), word("make", 31), space(35), word("the", 36), space(39), word("code", 40), space(44), word("sweeter", 45)]}
	${" fixup!  "}                                                                     | ${[space(), squash("fixup!", 1), whitespace("  ", 7)]}
	${"fixup! Resolve a bug that thought it was a feature"}                            | ${[squash("fixup!"), space(6), word("Resolve", 7), space(14), word("a", 15), space(16), word("bug", 17), space(20), word("that", 21), space(25), word("thought", 26), space(33), word("it", 34), space(36), word("was", 37), space(40), word("a", 41), space(42), word("feature", 43)]}
	${"squash!   "}                                                                    | ${[squash("squash!"), whitespace("   ", 7)]}
	${" squash!  Make the formatter happy again :)"}                                   | ${[space(), squash("squash!", 1), whitespace("  ", 8), word("Make", 10), space(14), word("the", 15), space(18), word("formatter", 19), space(28), word("happy", 29), space(34), word("again", 35), space(40), punctuation(":", 41), punctuation(")", 42)]}
	${"!amend"}                                                                        | ${[squash("!amend")]}
	${"!amend some refactoring"}                                                       | ${[squash("!amend"), space(6), word("some", 7), space(11), word("refactoring", 12)]}
	${"  !fixup "}                                                                     | ${[whitespace("  "), squash("!fixup", 2), space(8)]}
	${" !fixup   Compare the list of items to the objects downloaded from the server"} | ${[space(), squash("!fixup", 1), whitespace("   ", 7), word("Compare", 10), space(17), word("the", 18), space(21), word("list", 22), space(26), word("of", 27), space(29), word("items", 30), space(35), word("to", 36), space(38), word("the", 39), space(42), word("objects", 43), space(50), word("downloaded", 51), space(61), word("from", 62), space(66), word("the", 67), space(70), word("server", 71)]}
	${"!squash "}                                                                      | ${[squash("!squash"), space(7)]}
	${"  !squash revisited the haircut of the main module"}                            | ${[whitespace("  "), squash("!squash", 2), space(9), word("revisited", 10), space(19), word("the", 20), space(23), word("haircut", 24), space(31), word("of", 32), space(34), word("the", 35), space(38), word("main", 39), space(43), word("module", 44)]}
	${" amend!solve the problem!"}                                                     | ${[space(), squash("amend!", 1), word("solve", 7), space(12), word("the", 13), space(16), word("problem", 17), punctuation("!", 24)]}
	${"fixup! - encourages the program to act like a clown"}                           | ${[squash("fixup!"), space(6), punctuation("-", 7), space(8), word("encourages", 9), space(19), word("the", 20), space(23), word("program", 24), space(31), word("to", 32), space(34), word("act", 35), space(38), word("like", 39), space(43), word("a", 44), space(45), word("clown", 46)]}
	${"fixup! Fixup!! Fix this confusing plate of spaghetti"}                          | ${[squash("fixup!"), space(6), word("Fixup", 7), punctuation("!", 12), punctuation("!", 13), space(14), word("Fix", 15), space(18), word("this", 19), space(23), word("confusing", 24), space(33), word("plate", 34), space(39), word("of", 40), space(42), word("spaghetti", 43)]}
	${" amend!squash!!   fixup!!amend Mess up the squash! markers"}                    | ${[space(), squash("amend!", 1), word("squash", 7), punctuation("!", 13), punctuation("!", 14), whitespace("   ", 15), word("fixup", 18), punctuation("!", 23), punctuation("!", 24), word("amend", 25), space(30), word("Mess", 31), space(35), word("up", 36), space(38), word("the", 39), space(42), word("squash", 43), punctuation("!", 49), space(50), word("markers", 51)]}
	${"!amend!fixup!SQUASH fixup! Every bus optimised"}                                | ${[squash("!amend"), punctuation("!", 6), word("fixup", 7), punctuation("!", 12), word("SQUASH", 13), space(19), word("fixup", 20), punctuation("!", 25), space(26), word("Every", 27), space(32), word("bus", 33), space(36), word("optimised", 37)]}
	${"!squash#6 !fixup! carry on then #11"}                                           | ${[squash("!squash"), issuelink("#6", 7), space(9), punctuation("!", 10), word("fixup", 11), punctuation("!", 16), space(17), word("carry", 18), space(23), word("on", 24), space(26), word("then", 27), space(31), issuelink("#11", 32)]}
	${'fixup! Revert "Add an amazing feature"'}                                        | ${[squash("fixup!"), space(6), revert("Revert", 7), space(13), punctuation('"', 14), word("Add", 15), space(18), word("an", 19), space(21), word("amazing", 22), space(29), word("feature", 30), punctuation('"', 37)]}
	${'squash!Revert "Revert "Refactor the authentication module""'}                   | ${[squash("squash!"), revert("Revert", 7), space(13), punctuation('"', 14), revert("Revert", 15), space(21), punctuation('"', 22), word("Refactor", 23), space(31), word("the", 32), space(35), word("authentication", 36), space(50), word("module", 51), punctuation('"', 57), punctuation('"', 58)]}
	${'amend! Revert "fixup!"'}                                                        | ${[squash("amend!"), space(6), revert("Revert", 7), space(13), punctuation('"', 14), word("fixup", 15), punctuation("!", 20), punctuation('"', 21)]}
`(
	"when the subject line of $subjectLine contains a squash marker",
	(props: { subjectLine: string; expectedTokens: Tokens }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("extracts squash marker tokens", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(props.expectedTokens)
		})
	},
)

describe.each`
	subjectLine                                                    | expectedTokens
	${"#1 fixup! Apply some magic"}                                | ${[issuelink("#1"), space(2), word("fixup", 3), punctuation("!", 8), space(9), word("Apply", 10), space(15), word("some", 16), space(20), word("magic", 21)]}
	${"GH-45 GL-193 squash! amend! redo the artistic performance"} | ${[issuelink("GH-45"), space(5), issuelink("GL-193", 6), space(12), word("squash", 13), punctuation("!", 19), space(20), word("amend", 21), punctuation("!", 26), space(27), word("redo", 28), space(32), word("the", 33), space(36), word("artistic", 37), space(45), word("performance", 46)]}
	${"`Token`squash! need more tokens"}                           | ${[code("`Token`"), word("squash", 7), punctuation("!", 13), space(14), word("need", 15), space(19), word("more", 20), space(24), word("tokens", 25)]}
	${"[fixup!] #37: fixed it"}                                    | ${[punctuation("["), word("fixup", 1), punctuation("!", 6), punctuation("]", 7), space(8), issuelink("#37:", 9), space(13), word("fixed", 14), space(19), word("it", 20)]}
	${'revert "fixup! add a semicolon for good luck"'}             | ${[revert("revert"), space(6), punctuation('"', 7), word("fixup", 8), punctuation("!", 13), space(14), word("add", 15), space(18), word("a", 19), space(20), word("semicolon", 21), space(30), word("for", 31), space(34), word("good", 35), space(39), word("luck", 40), punctuation('"', 44)]}
`(
	"when the subject line of $subjectLine has other tokens before a potential squash marker",
	(props: { subjectLine: string; expectedTokens: Tokens }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("does not extract any squash marker tokens", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(props.expectedTokens)
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
	${"!!!amend!!!this"}
	${"Done!"}
	${"let's go!!"}
`(
	"when the subject line of $subjectLine does not contain a squash marker",
	(props: { subjectLine: string }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(
				tokeniseSubjectLine(props.subjectLine, {
					issueLink: issueLinkPattern(configuration),
				}),
			)
		})
	},
)
