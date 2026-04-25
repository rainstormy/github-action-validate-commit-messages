import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { dependencyVersion } from "#commits/tokens/DependencyVersionToken.ts"
import { issueLink } from "#commits/tokens/IssueLinkToken.ts"
import { revertMarker } from "#commits/tokens/RevertMarkerToken.ts"
import { squashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import { text } from "#commits/tokens/TextToken.ts"
import type { TokenisedLine } from "#commits/tokens/Token.ts"
import { fakeConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeConfiguration()

describe.each`
	subjectLine                                                                        | expectedTokens
	${'Revert ""'}                                                                     | ${[revertMarker('Revert "', 1, [0, 8]), revertMarker('"', 0, [8, 9])]}
	${'Revert " "'}                                                                    | ${[revertMarker('Revert "', 1, [0, 8]), text(" ", [8, 9]), revertMarker('"', 0, [9, 10])]}
	${'Revert "Revert """'}                                                            | ${[revertMarker('Revert "Revert "', 2, [0, 16]), revertMarker('""', 0, [16, 18])]}
	${'Revert "Repair the soft ice machine"'}                                          | ${[revertMarker('Revert "', 1, [0, 8]), text("Repair the soft ice machine", [8, 35]), revertMarker('"', 0, [35, 36])]}
	${'Revert "Revert "Repair the soft ice machine""'}                                 | ${[revertMarker('Revert "Revert "', 2, [0, 16]), text("Repair the soft ice machine", [16, 43]), revertMarker('""', 0, [43, 45])]}
	${'Revert "Revert "Revert "Repair the soft ice machine"""'}                        | ${[revertMarker('Revert "Revert "Revert "', 3, [0, 24]), text("Repair the soft ice machine", [24, 51]), revertMarker('"""', 0, [51, 54])]}
	${'revert "Fix a nasty bug"'}                                                      | ${[revertMarker('revert "', 1, [0, 8]), text("Fix a nasty bug", [8, 23]), revertMarker('"', 0, [23, 24])]}
	${'REVERT "Refactor the authentication module"'}                                   | ${[revertMarker('REVERT "', 1, [0, 8]), text("Refactor the authentication module", [8, 42]), revertMarker('"', 0, [42, 43])]}
	${' Revert " Apply strawberry jam to make the code sweeter" '}                     | ${[revertMarker(' Revert "', 1, [0, 9]), text(" Apply strawberry jam to make the code sweeter", [9, 55]), revertMarker('" ', 0, [55, 57])]}
	${'  revert " revert "Find a new "court jester" to blame " " '}                    | ${[revertMarker('  revert " revert "', 2, [0, 19]), text('Find a new "court jester" to blame ', [19, 54]), revertMarker('" " ', 0, [54, 58])]}
	${'Revert  "Make the program act like a clown"'}                                   | ${[revertMarker('Revert  "', 1, [0, 9]), text("Make the program act like a clown", [9, 42]), revertMarker('"', 0, [42, 43])]}
	${'Revert "Upgrade "React" to 19.2.0 (#42)"'}                                      | ${[revertMarker('Revert "', 1, [0, 8]), text('Upgrade "React" to ', [8, 27]), dependencyVersion("19.2.0", [27, 33]), issueLink(" (#42)", [33, 39]), revertMarker('"', 0, [39, 40])]}
	${'revert "squash! i blame the previous developer"'}                               | ${[revertMarker('revert "', 1, [0, 8]), text("squash! i blame the previous developer", [8, 46]), revertMarker('"', 0, [46, 47])]}
	${'Revert  "Revert "  squash!  fixup! Made the code so clean that it sparkles ""'} | ${[revertMarker('Revert  "Revert "', 2, [0, 17]), text("  squash!  fixup! Made the code so clean that it sparkles ", [17, 75]), revertMarker('""', 0, [75, 77])]}
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
	${'Revert "'}                                                 | ${[revertMarker('Revert "', 1, [0, 8])]}
	${'Revert "  '}                                               | ${[revertMarker('Revert "', 1, [0, 8]), text("  ", [8, 10])]}
	${'Revert "Repair the soft ice machine'}                      | ${[revertMarker('Revert "', 1, [0, 8]), text("Repair the soft ice machine", [8, 35])]}
	${'Revert "Revert "Repair the soft ice machine"'}             | ${[revertMarker('Revert "Revert "', 2, [0, 16]), text("Repair the soft ice machine", [16, 43]), revertMarker('"', 0, [43, 44])]}
	${'Revert "Revert "Revert "Repair the soft ice machine'}      | ${[revertMarker('Revert "Revert "Revert "', 3, [0, 24]), text("Repair the soft ice machine", [24, 51])]}
	${'  revert " revert "Find a new "court jester" to blame " '} | ${[revertMarker('  revert " revert "', 2, [0, 19]), text('Find a new "court jester" to blame ', [19, 54]), revertMarker('" ', 0, [54, 56])]}
	${'Revert ""weirdly quoted message'}                          | ${[revertMarker('Revert "', 1, [0, 8]), text('"weirdly quoted message', [8, 31])]}
	${'fixup! Revert "Add an amazing feature'}                    | ${[squashMarker("fixup! ", [0, 7]), revertMarker('Revert "', 1, [7, 15]), text("Add an amazing feature", [15, 37])]}
	${'revert "a mere bugfix attempt"""'}                         | ${[revertMarker('revert "', 1, [0, 8]), text('a mere bugfix attempt""', [8, 31]), revertMarker('"', 0, [31, 32])]}
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
	${'#1 Revert "Add an amazing feature"'} | ${[issueLink("#1 ", [0, 3]), text('Revert "Add an amazing feature"', [3, 34])]}
	${'GH-45 GL-193 revert "bugfix"'}       | ${[issueLink("GH-45 ", [0, 6]), issueLink("GL-193 ", [6, 13]), text('revert "bugfix"', [13, 28])]}
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
			expect(commit.subjectLine).toEqual([text(props.subjectLine, [0, props.subjectLine.length])])
		})
	},
)
