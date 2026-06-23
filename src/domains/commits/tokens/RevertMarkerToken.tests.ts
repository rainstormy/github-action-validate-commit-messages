import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { dependencyVersion } from "#commits/tokens/DependencyVersionToken.ts"
import { issueLink } from "#commits/tokens/IssueLinkToken.ts"
import { revertMarker } from "#commits/tokens/RevertMarkerToken.ts"
import { squashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import { rawText, text } from "#commits/tokens/TextToken.ts"
import type { TokenisedLine } from "#commits/tokens/Token.ts"
import { fakeTokenConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeTokenConfiguration()

describe.each`
	subjectLine                                                                        | expectedTokens
	${'Revert ""'}                                                                     | ${[revertMarker('Revert "', 1), revertMarker('"', 0, 8)]}
	${'Revert " "'}                                                                    | ${[revertMarker('Revert "', 1), text(" ", 8), revertMarker('"', 0, 9)]}
	${'Revert "Revert """'}                                                            | ${[revertMarker('Revert "Revert "', 2), revertMarker('""', 0, 16)]}
	${'Revert "Repair the soft ice machine"'}                                          | ${[revertMarker('Revert "', 1), text("Repair the soft ice machine", 8), revertMarker('"', 0, 35)]}
	${'Revert "Revert "Repair the soft ice machine""'}                                 | ${[revertMarker('Revert "Revert "', 2), text("Repair the soft ice machine", 16), revertMarker('""', 0, 43)]}
	${'Revert "Revert "Revert "Repair the soft ice machine"""'}                        | ${[revertMarker('Revert "Revert "Revert "', 3), text("Repair the soft ice machine", 24), revertMarker('"""', 0, 51)]}
	${'revert "Fix a nasty bug"'}                                                      | ${[revertMarker('revert "', 1), text("Fix a nasty bug", 8), revertMarker('"', 0, 23)]}
	${'REVERT "Refactor the authentication module"'}                                   | ${[revertMarker('REVERT "', 1), text("Refactor the authentication module", 8), revertMarker('"', 0, 42)]}
	${' Revert " Apply strawberry jam to make the code sweeter" '}                     | ${[revertMarker(' Revert "', 1), text(" Apply strawberry jam to make the code sweeter", 9), revertMarker('" ', 0, 55)]}
	${'  revert " revert "Find a new "court jester" to blame " " '}                    | ${[revertMarker('  revert " revert "', 2), text('Find a new "court jester" to blame ', 19), revertMarker('" " ', 0, 54)]}
	${'Revert  "Make the program act like a clown"'}                                   | ${[revertMarker('Revert  "', 1), text("Make the program act like a clown", 9), revertMarker('"', 0, 42)]}
	${'Revert "Upgrade "React" to 19.2.0 (#42)"'}                                      | ${[revertMarker('Revert "', 1), text('Upgrade "React" to ', 8), dependencyVersion("19.2.0", 27), issueLink(" (#42)", 33), revertMarker('"', 0, 39)]}
	${'revert "squash! i blame the previous developer"'}                               | ${[revertMarker('revert "', 1), text("squash! i blame the previous developer", 8), revertMarker('"', 0, 46)]}
	${'Revert  "Revert "  squash!  fixup! Made the code so clean that it sparkles ""'} | ${[revertMarker('Revert  "Revert "', 2), text("  squash!  fixup! Made the code so clean that it sparkles ", 17), revertMarker('""', 0, 75)]}
`(
	"when the subject line of $subjectLine contains revert markers",
	(props: { subjectLine: string; expectedTokens: TokenisedLine }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("extracts revert marker tokens", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(props.expectedTokens)
		})
	},
)

describe.each`
	subjectLine                                                   | expectedTokens
	${'Revert "'}                                                 | ${[revertMarker('Revert "', 1)]}
	${'Revert "  '}                                               | ${[revertMarker('Revert "', 1), text("  ", 8)]}
	${'Revert "Repair the soft ice machine'}                      | ${[revertMarker('Revert "', 1), text("Repair the soft ice machine", 8)]}
	${'Revert "Revert "Repair the soft ice machine"'}             | ${[revertMarker('Revert "Revert "', 2), text("Repair the soft ice machine", 16), revertMarker('"', 0, 43)]}
	${'Revert "Revert "Revert "Repair the soft ice machine'}      | ${[revertMarker('Revert "Revert "Revert "', 3), text("Repair the soft ice machine", 24)]}
	${'  revert " revert "Find a new "court jester" to blame " '} | ${[revertMarker('  revert " revert "', 2), text('Find a new "court jester" to blame ', 19), revertMarker('" ', 0, 54)]}
	${'Revert ""weirdly quoted message'}                          | ${[revertMarker('Revert "', 1), text('"weirdly quoted message', 8)]}
	${'fixup! Revert "Add an amazing feature'}                    | ${[squashMarker("fixup! "), revertMarker('Revert "', 1, 7), text("Add an amazing feature", 15)]}
	${'revert "a mere bugfix attempt"""'}                         | ${[revertMarker('revert "', 1), text('a mere bugfix attempt""', 8), revertMarker('"', 0, 31)]}
`(
	"when the subject line of $subjectLine contains revert markers with inconsistent pairs of quotes",
	(props: { subjectLine: string; expectedTokens: TokenisedLine }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("extracts revert marker tokens", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(props.expectedTokens)
		})
	},
)

describe.each`
	subjectLine                             | expectedTokens
	${'#1 Revert "Add an amazing feature"'} | ${[issueLink("#1 "), text('Revert "Add an amazing feature"', 3)]}
	${'GH-45 GL-193 revert "bugfix"'}       | ${[issueLink("GH-45 "), issueLink("GL-193 ", 6), text('revert "bugfix"', 13)]}
`(
	"when the subject line of $subjectLine has issue links before potential revert markers",
	(props: { subjectLine: string; expectedTokens: TokenisedLine }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("does not extract any revert marker tokens", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(props.expectedTokens)
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
	${'Revert"without-space"'}
	${'fix: Revert "something"'}
	${"Time to revert it"}
	${'I\'ll never revert "this"'}
	${'Revert Revert "something""'}
`(
	"when the subject line of $subjectLine does not contain any revert markers",
	(props: { subjectLine: string }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual([rawText(props.subjectLine)])
		})
	},
)
