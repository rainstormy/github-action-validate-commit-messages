import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { issueLink } from "#commits/tokens/IssueLinkToken.ts"
import { revertMarker } from "#commits/tokens/RevertMarkerToken.ts"
import { squashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import { text } from "#commits/tokens/TextToken.ts"
import type { TokenisedLine } from "#commits/tokens/Token.ts"
import { fakeConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeConfiguration()

describe.each`
	subjectLine                                                                        | expectedTokens
	${"amend!"}                                                                        | ${[squashMarker("amend!", [0, 6])]}
	${" amend!Apply strawberry jam to make the code sweeter"}                          | ${[squashMarker(" amend!", [0, 7]), text("Apply strawberry jam to make the code sweeter", [7, 52])]}
	${" fixup!  "}                                                                     | ${[squashMarker(" fixup!  ", [0, 9])]}
	${"fixup! Resolve a bug that thought it was a feature"}                            | ${[squashMarker("fixup! ", [0, 7]), text("Resolve a bug that thought it was a feature", [7, 50])]}
	${"squash!   "}                                                                    | ${[squashMarker("squash!   ", [0, 10])]}
	${" squash!  Make the formatter happy again :)"}                                   | ${[squashMarker(" squash!  ", [0, 10]), text("Make the formatter happy again :)", [10, 43])]}
	${"!amend"}                                                                        | ${[squashMarker("!amend", [0, 6])]}
	${"!amend some refactoring"}                                                       | ${[squashMarker("!amend ", [0, 7]), text("some refactoring", [7, 23])]}
	${"  !fixup "}                                                                     | ${[squashMarker("  !fixup ", [0, 9])]}
	${" !fixup   Compare the list of items to the objects downloaded from the server"} | ${[squashMarker(" !fixup   ", [0, 10]), text("Compare the list of items to the objects downloaded from the server", [10, 77])]}
	${"!squash "}                                                                      | ${[squashMarker("!squash ", [0, 8])]}
	${"  !squash revisited the haircut of the main module"}                            | ${[squashMarker("  !squash ", [0, 10]), text("revisited the haircut of the main module", [10, 50])]}
	${" amend!solve the problem!"}                                                     | ${[squashMarker(" amend!", [0, 7]), text("solve the problem!", [7, 25])]}
	${"fixup! - encourages the program to act like a clown"}                           | ${[squashMarker("fixup! ", [0, 7]), text("- encourages the program to act like a clown", [7, 51])]}
	${"fixup! Fixup!! Fix this confusing plate of spaghetti"}                          | ${[squashMarker("fixup! Fixup!! ", [0, 15]), text("Fix this confusing plate of spaghetti", [15, 52])]}
	${" amend!squash!!   fixup!!amend Mess up the squash! markers"}                    | ${[squashMarker(" amend!squash!!   fixup!!", [0, 25]), text("amend Mess up the squash! markers", [25, 58])]}
	${"!amend!fixup!SQUASH fixup! Every bus optimised"}                                | ${[squashMarker("!amend!fixup!SQUASH fixup! ", [0, 27]), text("Every bus optimised", [27, 46])]}
	${"!squash#6 !fixup! carry on then #11"}                                           | ${[squashMarker("!squash", [0, 7]), issueLink("#6 ", [7, 10]), text("!fixup! carry on then", [10, 31]), issueLink(" #11", [31, 35])]}
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
	${"#1 fixup! Apply some magic"}                                | ${[issueLink("#1 ", [0, 3]), text("fixup! Apply some magic", [3, 26])]}
	${"GH-45 GL-193 squash! amend! redo the artistic performance"} | ${[issueLink("GH-45 ", [0, 6]), issueLink("GL-193 ", [6, 13]), text("squash! amend! redo the artistic performance", [13, 57])]}
	${'Revert "fixup! Apply some magic"'}                          | ${[revertMarker('Revert "', [0, 8]), text('fixup! Apply some magic"', [8, 32])]}
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
			expect(commit.subjectLine).toEqual([text(props.subjectLine, [0, props.subjectLine.length])])
		})
	},
)
