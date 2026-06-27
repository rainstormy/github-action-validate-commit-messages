import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { dependencyVersion } from "#commits/tokens/DependencyVersionToken.ts"
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
	${'Revert ""'}                                                                     | ${[revertMarker('Revert "', 1), revertMarker('"', 0, 8)]}
	${'Revert " "'}                                                                    | ${[revertMarker('Revert "', 1), whitespace(" ", 8), revertMarker('"', 0, 9)]}
	${'Revert "Revert """'}                                                            | ${[revertMarker('Revert "Revert "', 2), revertMarker('""', 0, 16)]}
	${'Revert "Repair the soft ice machine"'}                                          | ${[revertMarker('Revert "', 1), word("Repair", 8), whitespace(" ", 14), word("the", 15), whitespace(" ", 18), word("soft", 19), whitespace(" ", 23), word("ice", 24), whitespace(" ", 27), word("machine", 28), revertMarker('"', 0, 35)]}
	${'Revert "Revert "Repair the soft ice machine""'}                                 | ${[revertMarker('Revert "Revert "', 2), word("Repair", 16), whitespace(" ", 22), word("the", 23), whitespace(" ", 26), word("soft", 27), whitespace(" ", 31), word("ice", 32), whitespace(" ", 35), word("machine", 36), revertMarker('""', 0, 43)]}
	${'Revert "Revert "Revert "Repair the soft ice machine"""'}                        | ${[revertMarker('Revert "Revert "Revert "', 3), word("Repair", 24), whitespace(" ", 30), word("the", 31), whitespace(" ", 34), word("soft", 35), whitespace(" ", 39), word("ice", 40), whitespace(" ", 43), word("machine", 44), revertMarker('"""', 0, 51)]}
	${'revert "Fix a nasty bug"'}                                                      | ${[revertMarker('revert "', 1), word("Fix", 8), whitespace(" ", 11), word("a", 12), whitespace(" ", 13), word("nasty", 14), whitespace(" ", 19), word("bug", 20), revertMarker('"', 0, 23)]}
	${'REVERT "Refactor the authentication module"'}                                   | ${[revertMarker('REVERT "', 1), word("Refactor", 8), whitespace(" ", 16), word("the", 17), whitespace(" ", 20), word("authentication", 21), whitespace(" ", 35), word("module", 36), revertMarker('"', 0, 42)]}
	${' Revert " Apply strawberry jam to make the code sweeter" '}                     | ${[revertMarker(' Revert "', 1), whitespace(" ", 9), word("Apply", 10), whitespace(" ", 15), word("strawberry", 16), whitespace(" ", 26), word("jam", 27), whitespace(" ", 30), word("to", 31), whitespace(" ", 33), word("make", 34), whitespace(" ", 38), word("the", 39), whitespace(" ", 42), word("code", 43), whitespace(" ", 47), word("sweeter", 48), revertMarker('" ', 0, 55)]}
	${'  revert " revert "Find a new "court jester" to blame " " '}                    | ${[revertMarker('  revert " revert "', 2), word("Find", 19), whitespace(" ", 23), word("a", 24), whitespace(" ", 25), word("new", 26), whitespace(" ", 29), punctuation('"', 30), word("court", 31), whitespace(" ", 36), word("jester", 37), punctuation('"', 43), whitespace(" ", 44), word("to", 45), whitespace(" ", 47), word("blame", 48), whitespace(" ", 53), revertMarker('" " ', 0, 54)]}
	${'Revert  "Make the program act like a clown"'}                                   | ${[revertMarker('Revert  "', 1), word("Make", 9), whitespace(" ", 13), word("the", 14), whitespace(" ", 17), word("program", 18), whitespace(" ", 25), word("act", 26), whitespace(" ", 29), word("like", 30), whitespace(" ", 34), word("a", 35), whitespace(" ", 36), word("clown", 37), revertMarker('"', 0, 42)]}
	${'Revert "Upgrade "React" to 19.2.0 (#42)"'}                                      | ${[revertMarker('Revert "', 1), word("Upgrade", 8), whitespace(" ", 15), punctuation('"', 16), word("React", 17), punctuation('"', 22), whitespace(" ", 23), word("to", 24), whitespace(" ", 26), dependencyVersion("19.2.0", 27), issueLink(" (#42)", 33), revertMarker('"', 0, 39)]}
	${'revert "squash! i blame the previous developer"'}                               | ${[revertMarker('revert "', 1), word("squash", 8), punctuation("!", 14), whitespace(" ", 15), word("i", 16), whitespace(" ", 17), word("blame", 18), whitespace(" ", 23), word("the", 24), whitespace(" ", 27), word("previous", 28), whitespace(" ", 36), word("developer", 37), revertMarker('"', 0, 46)]}
	${'Revert  "Revert "  squash!  fixup! Made the code so clean that it sparkles ""'} | ${[revertMarker('Revert  "Revert "', 2), whitespace("  ", 17), word("squash", 19), punctuation("!", 25), whitespace("  ", 26), word("fixup", 28), punctuation("!", 33), whitespace(" ", 34), word("Made", 35), whitespace(" ", 39), word("the", 40), whitespace(" ", 43), word("code", 44), whitespace(" ", 48), word("so", 49), whitespace(" ", 51), word("clean", 52), whitespace(" ", 57), word("that", 58), whitespace(" ", 62), word("it", 63), whitespace(" ", 65), word("sparkles", 66), whitespace(" ", 74), revertMarker('""', 0, 75)]}
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
	${'Revert "  '}                                               | ${[revertMarker('Revert "', 1), whitespace("  ", 8)]}
	${'Revert "Repair the soft ice machine'}                      | ${[revertMarker('Revert "', 1), word("Repair", 8), whitespace(" ", 14), word("the", 15), whitespace(" ", 18), word("soft", 19), whitespace(" ", 23), word("ice", 24), whitespace(" ", 27), word("machine", 28)]}
	${'Revert "Revert "Repair the soft ice machine"'}             | ${[revertMarker('Revert "Revert "', 2), word("Repair", 16), whitespace(" ", 22), word("the", 23), whitespace(" ", 26), word("soft", 27), whitespace(" ", 31), word("ice", 32), whitespace(" ", 35), word("machine", 36), revertMarker('"', 0, 43)]}
	${'Revert "Revert "Revert "Repair the soft ice machine'}      | ${[revertMarker('Revert "Revert "Revert "', 3), word("Repair", 24), whitespace(" ", 30), word("the", 31), whitespace(" ", 34), word("soft", 35), whitespace(" ", 39), word("ice", 40), whitespace(" ", 43), word("machine", 44)]}
	${'  revert " revert "Find a new "court jester" to blame " '} | ${[revertMarker('  revert " revert "', 2), word("Find", 19), whitespace(" ", 23), word("a", 24), whitespace(" ", 25), word("new", 26), whitespace(" ", 29), punctuation('"', 30), word("court", 31), whitespace(" ", 36), word("jester", 37), punctuation('"', 43), whitespace(" ", 44), word("to", 45), whitespace(" ", 47), word("blame", 48), whitespace(" ", 53), revertMarker('" ', 0, 54)]}
	${'Revert ""weirdly quoted message'}                          | ${[revertMarker('Revert "', 1), punctuation('"', 8), word("weirdly", 9), whitespace(" ", 16), word("quoted", 17), whitespace(" ", 23), word("message", 24)]}
	${'fixup! Revert "Add an amazing feature'}                    | ${[squashMarker("fixup! "), revertMarker('Revert "', 1, 7), word("Add", 15), whitespace(" ", 18), word("an", 19), whitespace(" ", 21), word("amazing", 22), whitespace(" ", 29), word("feature", 30)]}
	${'revert "a mere bugfix attempt"""'}                         | ${[revertMarker('revert "', 1), word("a", 8), whitespace(" ", 9), word("mere", 10), whitespace(" ", 14), word("bugfix", 15), whitespace(" ", 21), word("attempt", 22), punctuation('""', 29), revertMarker('"', 0, 31)]}
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
	${'#1 Revert "Add an amazing feature"'} | ${[issueLink("#1 "), word("Revert", 3), whitespace(" ", 9), punctuation('"', 10), word("Add", 11), whitespace(" ", 14), word("an", 15), whitespace(" ", 17), word("amazing", 18), whitespace(" ", 25), word("feature", 26), punctuation('"', 33)]}
	${'GH-45 GL-193 revert "bugfix"'}       | ${[issueLink("GH-45 "), issueLink("GL-193 ", 6), word("revert", 13), whitespace(" ", 19), punctuation('"', 20), word("bugfix", 21), punctuation('"', 27)]}
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
			expect(commit.subjectLine).toEqual(tokenisePlainText(props.subjectLine))
		})
	},
)
