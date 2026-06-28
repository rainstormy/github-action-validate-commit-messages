import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { dependencyVersion } from "#commits/tokens/DependencyVersionToken.ts"
import { issueLink } from "#commits/tokens/IssueLinkToken.ts"
import { punctuation } from "#commits/tokens/PunctuationToken.ts"
import { revertMarker } from "#commits/tokens/RevertMarkerToken.ts"
import { squashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import { type TokenisedLine, tokenisePlainText } from "#commits/tokens/Token.ts"
import { space, whitespace } from "#commits/tokens/WhitespaceToken.ts"
import { word } from "#commits/tokens/WordToken.ts"
import { fakeTokenConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeTokenConfiguration()

describe.each`
	subjectLine                                                                        | expectedTokens
	${'Revert ""'}                                                                     | ${[revertMarker("Revert"), space(6), punctuation('"', 7), punctuation('"', 8)]}
	${'Revert " "'}                                                                    | ${[revertMarker("Revert"), space(6), punctuation('"', 7), space(8), punctuation('"', 9)]}
	${'Revert "Revert """'}                                                            | ${[revertMarker("Revert"), space(6), punctuation('"', 7), revertMarker("Revert", 8), space(14), punctuation('"""', 15)]}
	${'Revert "Repair the soft ice machine"'}                                          | ${[revertMarker("Revert"), space(6), punctuation('"', 7), word("Repair", 8), space(14), word("the", 15), space(18), word("soft", 19), space(23), word("ice", 24), space(27), word("machine", 28), punctuation('"', 35)]}
	${'Revert "Revert "Repair the soft ice machine""'}                                 | ${[revertMarker("Revert"), space(6), punctuation('"', 7), revertMarker("Revert", 8), space(14), punctuation('"', 15), word("Repair", 16), space(22), word("the", 23), space(26), word("soft", 27), space(31), word("ice", 32), space(35), word("machine", 36), punctuation('""', 43)]}
	${'Revert "Revert "Revert "Repair the soft ice machine"""'}                        | ${[revertMarker("Revert"), space(6), punctuation('"', 7), revertMarker("Revert", 8), space(14), punctuation('"', 15), revertMarker("Revert", 16), space(22), punctuation('"', 23), word("Repair", 24), space(30), word("the", 31), space(34), word("soft", 35), space(39), word("ice", 40), space(43), word("machine", 44), punctuation('"""', 51)]}
	${'revert "Fix a nasty bug"'}                                                      | ${[revertMarker("revert"), space(6), punctuation('"', 7), word("Fix", 8), space(11), word("a", 12), space(13), word("nasty", 14), space(19), word("bug", 20), punctuation('"', 23)]}
	${'REVERT "Refactor the authentication module"'}                                   | ${[revertMarker("REVERT"), space(6), punctuation('"', 7), word("Refactor", 8), space(16), word("the", 17), space(20), word("authentication", 21), space(35), word("module", 36), punctuation('"', 42)]}
	${' Revert " Apply strawberry jam to make the code sweeter" '}                     | ${[space(), revertMarker("Revert", 1), space(7), punctuation('"', 8), space(9), word("Apply", 10), space(15), word("strawberry", 16), space(26), word("jam", 27), space(30), word("to", 31), space(33), word("make", 34), space(38), word("the", 39), space(42), word("code", 43), space(47), word("sweeter", 48), punctuation('" ', 55)]}
	${'  revert " revert "Find a new "court jester" to blame " " '}                    | ${[whitespace("  "), revertMarker("revert", 2), space(8), punctuation('"', 9), space(10), revertMarker("revert", 11), space(17), punctuation('"', 18), word("Find", 19), space(23), word("a", 24), space(25), word("new", 26), space(29), punctuation('"', 30), word("court", 31), space(36), word("jester", 37), punctuation('"', 43), space(44), word("to", 45), space(47), word("blame", 48), space(53), punctuation('" " ', 54)]}
	${'Revert  "Make the program act like a clown"'}                                   | ${[revertMarker("Revert"), whitespace("  ", 6), punctuation('"', 8), word("Make", 9), space(13), word("the", 14), space(17), word("program", 18), space(25), word("act", 26), space(29), word("like", 30), space(34), word("a", 35), space(36), word("clown", 37), punctuation('"', 42)]}
	${'Revert "Upgrade "React" to 19.2.0 (#42)"'}                                      | ${[revertMarker("Revert"), space(6), punctuation('"', 7), word("Upgrade", 8), space(15), punctuation('"', 16), word("React", 17), punctuation('"', 22), space(23), word("to", 24), space(26), dependencyVersion("19.2.0", 27), ...issueLink(" (#42)", 33), punctuation('"', 39)]}
	${'revert "squash! i blame the previous developer"'}                               | ${[revertMarker("revert"), space(6), punctuation('"', 7), word("squash", 8), punctuation("!", 14), space(15), word("i", 16), space(17), word("blame", 18), space(23), word("the", 24), space(27), word("previous", 28), space(36), word("developer", 37), punctuation('"', 46)]}
	${'Revert  "Revert "  squash!  fixup! Made the code so clean that it sparkles ""'} | ${[revertMarker("Revert"), whitespace("  ", 6), punctuation('"', 8), revertMarker("Revert", 9), space(15), punctuation('"', 16), whitespace("  ", 17), word("squash", 19), punctuation("!", 25), whitespace("  ", 26), word("fixup", 28), punctuation("!", 33), space(34), word("Made", 35), space(39), word("the", 40), space(43), word("code", 44), space(48), word("so", 49), space(51), word("clean", 52), space(57), word("that", 58), space(62), word("it", 63), space(65), word("sparkles", 66), space(74), punctuation('""', 75)]}
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
	${'Revert "'}                                                 | ${[revertMarker("Revert"), space(6), punctuation('"', 7)]}
	${'Revert "  '}                                               | ${[revertMarker("Revert"), space(6), punctuation('"', 7), whitespace("  ", 8)]}
	${'Revert "Repair the soft ice machine'}                      | ${[revertMarker("Revert"), space(6), punctuation('"', 7), word("Repair", 8), space(14), word("the", 15), space(18), word("soft", 19), space(23), word("ice", 24), space(27), word("machine", 28)]}
	${'Revert "Revert "Repair the soft ice machine"'}             | ${[revertMarker("Revert"), space(6), punctuation('"', 7), revertMarker("Revert", 8), space(14), punctuation('"', 15), word("Repair", 16), space(22), word("the", 23), space(26), word("soft", 27), space(31), word("ice", 32), space(35), word("machine", 36), punctuation('"', 43)]}
	${'Revert "Revert "Revert "Repair the soft ice machine'}      | ${[revertMarker("Revert"), space(6), punctuation('"', 7), revertMarker("Revert", 8), space(14), punctuation('"', 15), revertMarker("Revert", 16), space(22), punctuation('"', 23), word("Repair", 24), space(30), word("the", 31), space(34), word("soft", 35), space(39), word("ice", 40), space(43), word("machine", 44)]}
	${'  revert " revert "Find a new "court jester" to blame " '} | ${[whitespace("  "), revertMarker("revert", 2), space(8), punctuation('"', 9), space(10), revertMarker("revert", 11), space(17), punctuation('"', 18), word("Find", 19), space(23), word("a", 24), space(25), word("new", 26), space(29), punctuation('"', 30), word("court", 31), space(36), word("jester", 37), punctuation('"', 43), space(44), word("to", 45), space(47), word("blame", 48), space(53), punctuation('" ', 54)]}
	${'Revert ""weirdly quoted message'}                          | ${[revertMarker("Revert"), space(6), punctuation('"', 7), punctuation('"', 8), word("weirdly", 9), space(16), word("quoted", 17), space(23), word("message", 24)]}
	${'fixup! Revert "Add an amazing feature'}                    | ${[squashMarker("fixup!"), space(6), revertMarker("Revert", 7), space(13), punctuation('"', 14), word("Add", 15), space(18), word("an", 19), space(21), word("amazing", 22), space(29), word("feature", 30)]}
	${'revert "a mere bugfix attempt"""'}                         | ${[revertMarker("revert"), space(6), punctuation('"', 7), word("a", 8), space(9), word("mere", 10), space(14), word("bugfix", 15), space(21), word("attempt", 22), punctuation('""', 29), punctuation('"', 31)]}
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
	${'#1 Revert "Add an amazing feature"'} | ${[issueLink("#1"), space(2), revertMarker("Revert", 3), space(9), punctuation('"', 10), word("Add", 11), space(14), word("an", 15), space(17), word("amazing", 18), space(25), word("feature", 26), punctuation('"', 33)]}
	${'GH-45 GL-193 revert "bugfix"'}       | ${[issueLink("GH-45"), space(5), issueLink("GL-193", 6), space(12), revertMarker("revert", 13), space(19), punctuation('"', 20), word("bugfix", 21), punctuation('"', 27)]}
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
