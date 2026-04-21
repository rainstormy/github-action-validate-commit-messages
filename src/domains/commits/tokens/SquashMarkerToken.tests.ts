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
	${"amend!"}                                                                        | ${[squashMarker("amend!")]}
	${" amend!Apply strawberry jam to make the code sweeter"}                          | ${[squashMarker(" amend!"), text("Apply strawberry jam to make the code sweeter")]}
	${" fixup!  "}                                                                     | ${[squashMarker(" fixup!  ")]}
	${"fixup! Resolve a bug that thought it was a feature"}                            | ${[squashMarker("fixup! "), text("Resolve a bug that thought it was a feature")]}
	${"squash!   "}                                                                    | ${[squashMarker("squash!   ")]}
	${" squash!  Make the formatter happy again :)"}                                   | ${[squashMarker(" squash!  "), text("Make the formatter happy again :)")]}
	${"!amend"}                                                                        | ${[squashMarker("!amend")]}
	${"!amend some refactoring"}                                                       | ${[squashMarker("!amend "), text("some refactoring")]}
	${"  !fixup "}                                                                     | ${[squashMarker("  !fixup ")]}
	${" !fixup   Compare the list of items to the objects downloaded from the server"} | ${[squashMarker(" !fixup   "), text("Compare the list of items to the objects downloaded from the server")]}
	${"!squash "}                                                                      | ${[squashMarker("!squash ")]}
	${"  !squash revisited the haircut of the main module"}                            | ${[squashMarker("  !squash "), text("revisited the haircut of the main module")]}
	${" amend!solve the problem!"}                                                     | ${[squashMarker(" amend!"), text("solve the problem!")]}
	${"fixup! - encourages the program to act like a clown"}                           | ${[squashMarker("fixup! "), text("- encourages the program to act like a clown")]}
	${"fixup! Fixup!! Fix this confusing plate of spaghetti"}                          | ${[squashMarker("fixup! Fixup!! "), text("Fix this confusing plate of spaghetti")]}
	${" amend!squash!!   fixup!!amend Mess up the squash! markers"}                    | ${[squashMarker(" amend!squash!!   fixup!!"), text("amend Mess up the squash! markers")]}
	${"!amend!fixup!SQUASH fixup! Every bus optimised"}                                | ${[squashMarker("!amend!fixup!SQUASH fixup! "), text("Every bus optimised")]}
	${"!squash#6 !fixup! carry on then #11"}                                           | ${[squashMarker("!squash"), issueLink("#6 "), text("!fixup! carry on then"), issueLink(" #11")]}
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
	${"#1 fixup! Apply some magic"}                                | ${[issueLink("#1 "), text("fixup! Apply some magic")]}
	${"GH-45 GL-193 squash! amend! redo the artistic performance"} | ${[issueLink("GH-45 "), issueLink("GL-193 "), text("squash! amend! redo the artistic performance")]}
	${'Revert "fixup! Apply some magic"'}                          | ${[revertMarker('Revert "'), text('fixup! Apply some magic"')]}
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
			expect(commit.subjectLine).toEqual([text(props.subjectLine)])
		})
	},
)
