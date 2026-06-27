import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { inlineCode } from "#commits/tokens/InlineCodeToken.ts"
import { issueLink } from "#commits/tokens/IssueLinkToken.ts"
import { punctuation } from "#commits/tokens/PunctuationToken.ts"
import { revertMarker } from "#commits/tokens/RevertMarkerToken.ts"
import { squashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import { type TokenisedLine, tokenisePlainText } from "#commits/tokens/Token.ts"
import { whitespace } from "#commits/tokens/WhitespaceToken.ts"
import { word } from "#commits/tokens/WordToken.ts"
import { fakeTokenConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeTokenConfiguration()

describe.each`
	subjectLine                                                                        | expectedTokens
	${"amend!"}                                                                        | ${[squashMarker("amend!")]}
	${" amend!Apply strawberry jam to make the code sweeter"}                          | ${[squashMarker(" amend!"), word("Apply", 7), whitespace(" ", 12), word("strawberry", 13), whitespace(" ", 23), word("jam", 24), whitespace(" ", 27), word("to", 28), whitespace(" ", 30), word("make", 31), whitespace(" ", 35), word("the", 36), whitespace(" ", 39), word("code", 40), whitespace(" ", 44), word("sweeter", 45)]}
	${" fixup!  "}                                                                     | ${[squashMarker(" fixup!  ")]}
	${"fixup! Resolve a bug that thought it was a feature"}                            | ${[squashMarker("fixup! "), word("Resolve", 7), whitespace(" ", 14), word("a", 15), whitespace(" ", 16), word("bug", 17), whitespace(" ", 20), word("that", 21), whitespace(" ", 25), word("thought", 26), whitespace(" ", 33), word("it", 34), whitespace(" ", 36), word("was", 37), whitespace(" ", 40), word("a", 41), whitespace(" ", 42), word("feature", 43)]}
	${"squash!   "}                                                                    | ${[squashMarker("squash!   ")]}
	${" squash!  Make the formatter happy again :)"}                                   | ${[squashMarker(" squash!  "), word("Make", 10), whitespace(" ", 14), word("the", 15), whitespace(" ", 18), word("formatter", 19), whitespace(" ", 28), word("happy", 29), whitespace(" ", 34), word("again", 35), whitespace(" ", 40), punctuation(":)", 41)]}
	${"!amend"}                                                                        | ${[squashMarker("!amend")]}
	${"!amend some refactoring"}                                                       | ${[squashMarker("!amend "), word("some", 7), whitespace(" ", 11), word("refactoring", 12)]}
	${"  !fixup "}                                                                     | ${[squashMarker("  !fixup ")]}
	${" !fixup   Compare the list of items to the objects downloaded from the server"} | ${[squashMarker(" !fixup   "), word("Compare", 10), whitespace(" ", 17), word("the", 18), whitespace(" ", 21), word("list", 22), whitespace(" ", 26), word("of", 27), whitespace(" ", 29), word("items", 30), whitespace(" ", 35), word("to", 36), whitespace(" ", 38), word("the", 39), whitespace(" ", 42), word("objects", 43), whitespace(" ", 50), word("downloaded", 51), whitespace(" ", 61), word("from", 62), whitespace(" ", 66), word("the", 67), whitespace(" ", 70), word("server", 71)]}
	${"!squash "}                                                                      | ${[squashMarker("!squash ")]}
	${"  !squash revisited the haircut of the main module"}                            | ${[squashMarker("  !squash "), word("revisited", 10), whitespace(" ", 19), word("the", 20), whitespace(" ", 23), word("haircut", 24), whitespace(" ", 31), word("of", 32), whitespace(" ", 34), word("the", 35), whitespace(" ", 38), word("main", 39), whitespace(" ", 43), word("module", 44)]}
	${" amend!solve the problem!"}                                                     | ${[squashMarker(" amend!"), word("solve", 7), whitespace(" ", 12), word("the", 13), whitespace(" ", 16), word("problem", 17), punctuation("!", 24)]}
	${"fixup! - encourages the program to act like a clown"}                           | ${[squashMarker("fixup! "), punctuation("-", 7), whitespace(" ", 8), word("encourages", 9), whitespace(" ", 19), word("the", 20), whitespace(" ", 23), word("program", 24), whitespace(" ", 31), word("to", 32), whitespace(" ", 34), word("act", 35), whitespace(" ", 38), word("like", 39), whitespace(" ", 43), word("a", 44), whitespace(" ", 45), word("clown", 46)]}
	${"fixup! Fixup!! Fix this confusing plate of spaghetti"}                          | ${[squashMarker("fixup! Fixup!! "), word("Fix", 15), whitespace(" ", 18), word("this", 19), whitespace(" ", 23), word("confusing", 24), whitespace(" ", 33), word("plate", 34), whitespace(" ", 39), word("of", 40), whitespace(" ", 42), word("spaghetti", 43)]}
	${" amend!squash!!   fixup!!amend Mess up the squash! markers"}                    | ${[squashMarker(" amend!squash!!   fixup!!"), word("amend", 25), whitespace(" ", 30), word("Mess", 31), whitespace(" ", 35), word("up", 36), whitespace(" ", 38), word("the", 39), whitespace(" ", 42), word("squash", 43), punctuation("!", 49), whitespace(" ", 50), word("markers", 51)]}
	${"!amend!fixup!SQUASH fixup! Every bus optimised"}                                | ${[squashMarker("!amend!fixup!SQUASH fixup! "), word("Every", 27), whitespace(" ", 32), word("bus", 33), whitespace(" ", 36), word("optimised", 37)]}
	${"!squash#6 !fixup! carry on then #11"}                                           | ${[squashMarker("!squash"), issueLink("#6 ", 7), punctuation("!", 10), word("fixup", 11), punctuation("!", 16), whitespace(" ", 17), word("carry", 18), whitespace(" ", 23), word("on", 24), whitespace(" ", 26), word("then", 27), issueLink(" #11", 31)]}
	${'fixup! Revert "Add an amazing feature"'}                                        | ${[squashMarker("fixup! "), revertMarker('Revert "', 1, 7), word("Add", 15), whitespace(" ", 18), word("an", 19), whitespace(" ", 21), word("amazing", 22), whitespace(" ", 29), word("feature", 30), revertMarker('"', 0, 37)]}
	${'squash!Revert "Revert "Refactor the authentication module""'}                   | ${[squashMarker("squash!"), revertMarker('Revert "Revert "', 2, 7), word("Refactor", 23), whitespace(" ", 31), word("the", 32), whitespace(" ", 35), word("authentication", 36), whitespace(" ", 50), word("module", 51), revertMarker('""', 0, 57)]}
	${'amend! Revert "fixup!"'}                                                        | ${[squashMarker("amend! "), revertMarker('Revert "', 1, 7), word("fixup", 15), punctuation("!", 20), revertMarker('"', 0, 21)]}
`(
	"when the subject line of $subjectLine contains squash markers",
	(props: { subjectLine: string; expectedTokens: TokenisedLine }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("extracts squash marker tokens", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(props.expectedTokens)
		})
	},
)

describe.each`
	subjectLine                                                    | expectedTokens
	${"#1 fixup! Apply some magic"}                                | ${[issueLink("#1 "), word("fixup", 3), punctuation("!", 8), whitespace(" ", 9), word("Apply", 10), whitespace(" ", 15), word("some", 16), whitespace(" ", 20), word("magic", 21)]}
	${"GH-45 GL-193 squash! amend! redo the artistic performance"} | ${[issueLink("GH-45 "), issueLink("GL-193 ", 6), word("squash", 13), punctuation("!", 19), whitespace(" ", 20), word("amend", 21), punctuation("!", 26), whitespace(" ", 27), word("redo", 28), whitespace(" ", 32), word("the", 33), whitespace(" ", 36), word("artistic", 37), whitespace(" ", 45), word("performance", 46)]}
	${"`Token`squash! need more tokens"}                           | ${[inlineCode("`Token`"), word("squash", 7), punctuation("!", 13), whitespace(" ", 14), word("need", 15), whitespace(" ", 19), word("more", 20), whitespace(" ", 24), word("tokens", 25)]}
	${"[fixup!] #37: fixed it"}                                    | ${[punctuation("["), word("fixup", 1), punctuation("!]", 6), issueLink(" #37: ", 8), word("fixed", 14), whitespace(" ", 19), word("it", 20)]}
	${'revert "fixup! add a semicolon for good luck"'}             | ${[revertMarker('revert "', 1), word("fixup", 8), punctuation("!", 13), whitespace(" ", 14), word("add", 15), whitespace(" ", 18), word("a", 19), whitespace(" ", 20), word("semicolon", 21), whitespace(" ", 30), word("for", 31), whitespace(" ", 34), word("good", 35), whitespace(" ", 39), word("luck", 40), revertMarker('"', 0, 44)]}
`(
	"when the subject line of $subjectLine has other tokens before potential squash markers",
	(props: { subjectLine: string; expectedTokens: TokenisedLine }) => {
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
	"when the subject line of $subjectLine does not contain any squash markers",
	(props: { subjectLine: string }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(tokenisePlainText(props.subjectLine))
		})
	},
)
