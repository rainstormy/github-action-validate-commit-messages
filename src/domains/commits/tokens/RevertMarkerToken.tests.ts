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
	subjectLine                                                      | expectedTokens
	${'Revert "Repair the soft ice machine"'}                        | ${[revertMarker('Revert "'), text('Repair the soft ice machine"')]}
	${'Revert "Revert "Repair the soft ice machine""'}               | ${[revertMarker('Revert "Revert "'), text('Repair the soft ice machine""')]}
	${'Revert "Revert "Revert "Repair the soft ice machine"""'}      | ${[revertMarker('Revert "Revert "Revert "'), text('Repair the soft ice machine"""')]}
	${'revert "Fix a nasty bug"'}                                    | ${[revertMarker('revert "'), text('Fix a nasty bug"')]}
	${'REVERT "Refactor the authentication module"'}                 | ${[revertMarker('REVERT "'), text('Refactor the authentication module"')]}
	${' Revert " Apply strawberry jam to make the code sweeter" '}   | ${[revertMarker(' Revert "'), text(' Apply strawberry jam to make the code sweeter" ')]}
	${'  revert " revert "Find a new court jester to blame " " '}    | ${[revertMarker('  revert " revert "'), text('Find a new court jester to blame " " ')]}
	${'Revert  "Make the program act like a clown"'}                 | ${[revertMarker('Revert  "'), text('Make the program act like a clown"')]}
	${'Revert "Upgrade React to 19.2.0 (#42)"'}                      | ${[revertMarker('Revert "'), text("Upgrade React to "), dependencyVersion("19.2.0"), issueLink(" (#42)"), text('"')]}
	${'fixup! Revert "Add an amazing feature"'}                      | ${[squashMarker("fixup! "), revertMarker('Revert "'), text('Add an amazing feature"')]}
	${'squash!Revert "Revert "Refactor the authentication module""'} | ${[squashMarker("squash!"), revertMarker('Revert "Revert "'), text('Refactor the authentication module""')]}
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
	subjectLine                                                 | expectedTokens
	${'Revert "Repair the soft ice machine'}                    | ${[revertMarker('Revert "'), text("Repair the soft ice machine")]}
	${'Revert "Revert "Repair the soft ice machine"'}           | ${[revertMarker('Revert "Revert "'), text('Repair the soft ice machine"')]}
	${'Revert "Revert "Revert "Repair the soft ice machine'}    | ${[revertMarker('Revert "Revert "Revert "'), text("Repair the soft ice machine")]}
	${'  revert " revert "Find a new court jester to blame " '} | ${[revertMarker('  revert " revert "'), text('Find a new court jester to blame " ')]}
	${'fixup! Revert "Add an amazing feature'}                  | ${[squashMarker("fixup! "), revertMarker('Revert "'), text("Add an amazing feature")]}
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
	${'#1 Revert "Add an amazing feature"'} | ${[issueLink("#1 "), text('Revert "Add an amazing feature"')]}
	${'GH-45 GL-193 revert "bugfix"'}       | ${[issueLink("GH-45 "), issueLink("GL-193 "), text('revert "bugfix"')]}
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
	${'Revert "'}
	${'Revert ""'}
	${"Revert 'the next big thing'"}
	${'revert more stuff"'}
	${"Reverted some secret stuff"}
	${'Revert ""weirdly quoted message'}
	${'"Revert "Make the formatter happy again""'}
	${'Revert"without-space"'}
	${'fix: Revert "something"'}
	${"Time to revert it"}
`(
	"when the subject line of $subjectLine does not contain any revert markers",
	(props: { subjectLine: string }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual([text(props.subjectLine)])
		})
	},
)
