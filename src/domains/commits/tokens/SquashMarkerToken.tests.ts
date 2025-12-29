import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit, type TokenisedLine } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { issueLink } from "#commits/tokens/IssueLinkToken.ts"
import { squashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import { getDefaultConfiguration } from "#configurations/GetDefaultConfiguration.ts"

describe("in the default configuration", () => {
	const configuration = getDefaultConfiguration()

	describe.each`
		subjectLine                                                                        | expectedTokens
		${"Make the commit scream fixup! again"}                                           | ${["Make the commit scream fixup! again"]}
		${"there's no squash! to see here"}                                                | ${["there's no squash! to see here"]}
		${"wip! Make amend!s"}                                                             | ${["wip! Make amend!s"]}
		${"!amendrelease"}                                                                 | ${["!amendrelease"]}
		${"!fixuptest"}                                                                    | ${["!fixuptest"]}
		${"!squashAdd more numbers to the spreadsheet"}                                    | ${["!squashAdd more numbers to the spreadsheet"]}
		${"amend the message"}                                                             | ${["amend the message"]}
		${"fixup"}                                                                         | ${["fixup"]}
		${"squash the bugs"}                                                               | ${["squash the bugs"]}
		${"Squash tennis and pumpkins"}                                                    | ${["Squash tennis and pumpkins"]}
		${"!!!amend!!!this"}                                                               | ${["!!!amend!!!this"]}
		${"amend!"}                                                                        | ${[squashMarker("amend!")]}
		${" amend!Apply strawberry jam to make the code sweeter"}                          | ${[squashMarker(" amend!"), "Apply strawberry jam to make the code sweeter"]}
		${" fixup!  "}                                                                     | ${[squashMarker(" fixup!  ")]}
		${"fixup! Resolve a bug that thought it was a feature"}                            | ${[squashMarker("fixup! "), "Resolve a bug that thought it was a feature"]}
		${"squash!   "}                                                                    | ${[squashMarker("squash!   ")]}
		${" squash!  Make the formatter happy again :)"}                                   | ${[squashMarker(" squash!  "), "Make the formatter happy again :)"]}
		${"!amend"}                                                                        | ${[squashMarker("!amend")]}
		${"!amend some refactoring"}                                                       | ${[squashMarker("!amend "), "some refactoring"]}
		${"  !fixup "}                                                                     | ${[squashMarker("  !fixup ")]}
		${" !fixup   Compare the list of items to the objects downloaded from the server"} | ${[squashMarker(" !fixup   "), "Compare the list of items to the objects downloaded from the server"]}
		${"!squash "}                                                                      | ${[squashMarker("!squash ")]}
		${"  !squash revisited the haircut of the main module"}                            | ${[squashMarker("  !squash "), "revisited the haircut of the main module"]}
		${" amend!solve the problem!"}                                                     | ${[squashMarker(" amend!"), "solve the problem!"]}
		${"fixup! - encourages the program to act like a clown"}                           | ${[squashMarker("fixup! "), "- encourages the program to act like a clown"]}
		${"fixup! Fixup!! Fix this confusing plate of spaghetti"}                          | ${[squashMarker("fixup! Fixup!! "), "Fix this confusing plate of spaghetti"]}
		${" amend!squash!!   fixup!!amend Mess up the squash! markers"}                    | ${[squashMarker(" amend!squash!!   fixup!!"), "amend Mess up the squash! markers"]}
		${"!amend!fixup!SQUASH fixup! Every bus optimised"}                                | ${[squashMarker("!amend!fixup!SQUASH fixup! "), "Every bus optimised"]}
		${"#1 fixup! Apply some magic"}                                                    | ${[issueLink("#1 "), "fixup! Apply some magic"]}
		${"!squash#6 !fixup! carry on then #11"}                                           | ${[squashMarker("!squash"), issueLink("#6 "), "!fixup! carry on then", issueLink(" #11")]}
	`(
		"when the commit message has a subject line of $subjectLine",
		(props: { subjectLine: string; expectedTokens: TokenisedLine }) => {
			const crudeCommit = fakeCrudeCommit({
				message: `${props.subjectLine}\nbody text`,
			})

			it("has a tokenised subject line", () => {
				const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
				expect(commit.subjectLine).toEqual(props.expectedTokens)
			})
		},
	)
})
