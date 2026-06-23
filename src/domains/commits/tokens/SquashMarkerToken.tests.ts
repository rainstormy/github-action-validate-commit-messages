import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { inlineCode } from "#commits/tokens/InlineCodeToken.ts"
import { issueLink } from "#commits/tokens/IssueLinkToken.ts"
import { revertMarker } from "#commits/tokens/RevertMarkerToken.ts"
import { squashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import { rawText, text } from "#commits/tokens/TextToken.ts"
import type { TokenisedLine } from "#commits/tokens/Token.ts"
import { fakeTokenConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeTokenConfiguration()

describe.each`
	subjectLine                                                                        | expectedTokens
	${"amend!"}                                                                        | ${[squashMarker("amend!")]}
	${" amend!Apply strawberry jam to make the code sweeter"}                          | ${[squashMarker(" amend!"), text("Apply strawberry jam to make the code sweeter", 7)]}
	${" fixup!  "}                                                                     | ${[squashMarker(" fixup!  ")]}
	${"fixup! Resolve a bug that thought it was a feature"}                            | ${[squashMarker("fixup! "), text("Resolve a bug that thought it was a feature", 7)]}
	${"squash!   "}                                                                    | ${[squashMarker("squash!   ")]}
	${" squash!  Make the formatter happy again :)"}                                   | ${[squashMarker(" squash!  "), text("Make the formatter happy again :)", 10)]}
	${"!amend"}                                                                        | ${[squashMarker("!amend")]}
	${"!amend some refactoring"}                                                       | ${[squashMarker("!amend "), text("some refactoring", 7)]}
	${"  !fixup "}                                                                     | ${[squashMarker("  !fixup ")]}
	${" !fixup   Compare the list of items to the objects downloaded from the server"} | ${[squashMarker(" !fixup   "), text("Compare the list of items to the objects downloaded from the server", 10)]}
	${"!squash "}                                                                      | ${[squashMarker("!squash ")]}
	${"  !squash revisited the haircut of the main module"}                            | ${[squashMarker("  !squash "), text("revisited the haircut of the main module", 10)]}
	${" amend!solve the problem!"}                                                     | ${[squashMarker(" amend!"), text("solve the problem!", 7)]}
	${"fixup! - encourages the program to act like a clown"}                           | ${[squashMarker("fixup! "), text("- encourages the program to act like a clown", 7)]}
	${"fixup! Fixup!! Fix this confusing plate of spaghetti"}                          | ${[squashMarker("fixup! Fixup!! "), text("Fix this confusing plate of spaghetti", 15)]}
	${" amend!squash!!   fixup!!amend Mess up the squash! markers"}                    | ${[squashMarker(" amend!squash!!   fixup!!"), text("amend Mess up the squash! markers", 25)]}
	${"!amend!fixup!SQUASH fixup! Every bus optimised"}                                | ${[squashMarker("!amend!fixup!SQUASH fixup! "), text("Every bus optimised", 27)]}
	${"!squash#6 !fixup! carry on then #11"}                                           | ${[squashMarker("!squash"), issueLink("#6 ", 7), text("!fixup! carry on then", 10), issueLink(" #11", 31)]}
	${'fixup! Revert "Add an amazing feature"'}                                        | ${[squashMarker("fixup! "), revertMarker('Revert "', 1, 7), text("Add an amazing feature", 15), revertMarker('"', 0, 37)]}
	${'squash!Revert "Revert "Refactor the authentication module""'}                   | ${[squashMarker("squash!"), revertMarker('Revert "Revert "', 2, 7), text("Refactor the authentication module", 23), revertMarker('""', 0, 57)]}
	${'amend! Revert "fixup!"'}                                                        | ${[squashMarker("amend! "), revertMarker('Revert "', 1, 7), text("fixup!", 15), revertMarker('"', 0, 21)]}
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
	${"#1 fixup! Apply some magic"}                                | ${[issueLink("#1 "), text("fixup! Apply some magic", 3)]}
	${"GH-45 GL-193 squash! amend! redo the artistic performance"} | ${[issueLink("GH-45 "), issueLink("GL-193 ", 6), text("squash! amend! redo the artistic performance", 13)]}
	${"`Token`squash! need more tokens"}                           | ${[inlineCode("`Token`"), text("squash! need more tokens", 7)]}
	${"[fixup!] #37: fixed it"}                                    | ${[text("[fixup!]"), issueLink(" #37: ", 8), text("fixed it", 14)]}
	${'revert "fixup! add a semicolon for good luck"'}             | ${[revertMarker('revert "', 1), text("fixup! add a semicolon for good luck", 8), revertMarker('"', 0, 44)]}
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
			expect(commit.subjectLine).toEqual([rawText(props.subjectLine)])
		})
	},
)
