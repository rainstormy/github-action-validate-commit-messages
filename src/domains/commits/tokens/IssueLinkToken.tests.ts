import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { issueLink } from "#commits/tokens/IssueLinkToken.ts"
import { punctuation } from "#commits/tokens/PunctuationToken.ts"
import { revertMarker } from "#commits/tokens/RevertMarkerToken.ts"
import { squashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import { type TokenisedLine, tokenisePlainText } from "#commits/tokens/Token.ts"
import { space, whitespace } from "#commits/tokens/WhitespaceToken.ts"
import { word } from "#commits/tokens/WordToken.ts"
import { fakeTokenConfiguration } from "#configurations/Configuration.fixtures.ts"
import { issueLinkConfiguration } from "#configurations/IssueLinkTokenConfiguration.ts"

const githubStyle = fakeTokenConfiguration({
	issueLinks: issueLinkConfiguration(["#", "GH-", "GL-"], ["(no-issue)", "[incident]"]),
})
const jiraStyle = fakeTokenConfiguration({
	issueLinks: issueLinkConfiguration(["UNICORN-"], ["#SECURITY"]),
})
const none = fakeTokenConfiguration({ issueLinks: null })

describe.each`
	subjectLine                                                        | expectedTokens
	${"#1"}                                                            | ${[issueLink("#1")]}
	${"GH-0"}                                                          | ${[issueLink("GH-0")]}
	${"GL-4 over the hedge"}                                           | ${[issueLink("GL-4"), space(4), word("over", 5), space(9), word("the", 10), space(13), word("hedge", 14)]}
	${"-#1079"}                                                        | ${[punctuation("-"), issueLink("#1079", 1)]}
	${"Closes #24."}                                                   | ${[word("Closes"), space(6), issueLink("#24", 7), punctuation(".", 10)]}
	${"#1.5"}                                                          | ${[issueLink("#1"), punctuation(".", 2), word("5", 3)]}
	${"##78"}                                                          | ${[punctuation("#"), issueLink("#78", 1)]}
	${"#2 Release the robot butler"}                                   | ${[issueLink("#2"), space(2), word("Release", 3), space(10), word("the", 11), space(14), word("robot", 15), space(20), word("butler", 21)]}
	${"(#12) Fix this confusing plate of spaghetti"}                   | ${[issueLink("(#12)"), space(5), word("Fix", 6), space(9), word("this", 10), space(14), word("confusing", 15), space(24), word("plate", 25), space(30), word("of", 31), space(33), word("spaghetti", 34)]}
	${"amend!#59: Sneak in a funny easter egg"}                        | ${[squashMarker("amend!"), issueLink("#59:", 6), space(10), word("Sneak", 11), space(16), word("in", 17), space(19), word("a", 20), space(21), word("funny", 22), space(27), word("easter", 28), space(34), word("egg", 35)]}
	${" #8 #9 Solve the problem"}                                      | ${[space(), issueLink("#8", 1), space(3), issueLink("#9", 4), space(6), word("Solve", 7), space(12), word("the", 13), space(16), word("problem", 17)]}
	${"(GH-15) #30 [#45]:  make the program act like a clown GL-60"}   | ${[issueLink("(GH-15)"), space(7), issueLink("#30", 8), space(11), issueLink("[#45]:", 12), whitespace("  ", 18), word("make", 20), space(24), word("the", 25), space(28), word("program", 29), space(36), word("act", 37), space(40), word("like", 41), space(45), word("a", 46), space(47), word("clown", 48), space(53), issueLink("GL-60", 54)]}
	${"Add some extra love to the code #7"}                            | ${[word("Add"), space(3), word("some", 4), space(8), word("extra", 9), space(14), word("love", 15), space(19), word("to", 20), space(22), word("the", 23), space(26), word("code", 27), space(31), issueLink("#7", 32)]}
	${"squash! Apply strawberry jam to make the code sweeter (#7044)"} | ${[squashMarker("squash!"), space(7), word("Apply", 8), space(13), word("strawberry", 14), space(24), word("jam", 25), space(28), word("to", 29), space(31), word("make", 32), space(36), word("the", 37), space(40), word("code", 41), space(45), word("sweeter", 46), space(53), issueLink("(#7044)", 54)]}
	${"amend!(#42)Soften the API boundaries"}                          | ${[squashMarker("amend!"), issueLink("(#42)", 6), word("Soften", 11), space(17), word("the", 18), space(21), word("API", 22), space(25), word("boundaries", 26)]}
	${"Make the user interface less chaotic [GL-11] #17 "}             | ${[word("Make"), space(4), word("the", 5), space(8), word("user", 9), space(13), word("interface", 14), space(23), word("less", 24), space(28), word("chaotic", 29), space(36), issueLink("[GL-11]", 37), space(44), issueLink("#17", 45), space(48)]}
	${"squash! #12 Throw a tantrum (#34) #56 {GH-78} #90"}             | ${[squashMarker("squash!"), space(7), issueLink("#12"), space(11), word("Throw", 12), space(17), word("a", 18), space(19), word("tantrum", 20), space(27), issueLink("(#34)", 28), space(33), issueLink("#56", 34), space(37), issueLink("{GH-78}", 38), space(45), issueLink("#90", 46)]}
	${"fixup! Close #1337 by fixing the bug"}                          | ${[squashMarker("fixup!"), space(6), word("Close", 7), space(12), issueLink("#1337", 13), space(18), word("by", 19), space(21), word("fixing", 22), space(28), word("the", 29), space(32), word("bug", 33)]}
	${"<#71238> loosen the bolts"}                                     | ${[issueLink("<#71238>"), space(8), word("loosen", 9), space(15), word("the", 16), space(19), word("bolts", 20)]}
	${'Revert "[GH-39] This should fix it. Famous last words"'}        | ${[revertMarker("Revert"), space(6), punctuation('"', 7), issueLink("[GH-39]", 8), space(15), word("This", 16), space(20), word("should", 21), space(27), word("fix", 28), space(31), word("it", 32), punctuation(".", 34), space(35), word("Famous", 36), space(42), word("last", 43), space(47), word("words", 48), punctuation('"', 53)]}
	${"(no-issue) Polish the moon laser"}                              | ${[issueLink("(no-issue)"), space(10), word("Polish", 11), space(17), word("the", 18), space(21), word("moon", 22), space(26), word("laser", 27)]}
	${"Add safety rails (no-issue)"}                                   | ${[word("Add"), space(3), word("safety", 4), space(10), word("rails", 11), space(16), issueLink("(no-issue)", 17)]}
	${"squash! [incident] Teach the logs to use their inside voice"}   | ${[squashMarker("squash!"), space(7), issueLink("[incident]", 8), space(18), word("Teach", 19), space(24), word("the", 25), space(28), word("logs", 29), space(33), word("to", 34), space(36), word("use", 37), space(40), word("their", 41), space(46), word("inside", 47), space(53), word("voice", 54)]}
	${"(no-issue) #1107 Stop the toaster from joining standup"}        | ${[issueLink("(no-issue)"), space(10), issueLink("#1107", 11), space(16), word("Stop", 17), space(21), word("the", 22), space(25), word("toaster", 26), space(33), word("from", 34), space(38), word("joining", 39), space(46), word("standup", 47)]}
	${"[incident] Skip #42 and UNICORN-8"}                             | ${[issueLink("[incident]"), space(10), word("Skip", 11), space(15), issueLink("#42", 16), space(19), word("and", 20), space(23), word("UNICORN-8", 24)]}
	${"fixup![incident](no-issue){#621}secure the rail signals"}       | ${[squashMarker("fixup!"), issueLink("[incident]", 6), issueLink("(no-issue)", 16), issueLink("{#621}", 26), word("secure", 32), space(38), word("the", 39), space(42), word("rail", 43), space(47), word("signals", 48)]}
`(
	"when the subject line of $subjectLine contains GitHub-/GitLab-style issue links or wildcards",
	(props: { subjectLine: string; expectedTokens: TokenisedLine }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("extracts issue link tokens", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, githubStyle)
			expect(commit.subjectLine).toEqual(props.expectedTokens)
		})
	},
)

describe.each`
	subjectLine
	${"#"}
	${"#MAIN"}
	${"gh-40 Gl-41 have wrong casing"}
	${"Add #fluent and #api as relevant tags"}
	${"the syntax is #(42)"}
	${"add the GH-cli"}
	${"GL--"}
	${"undo gh-view"}
	${"(NO-ISSUE) Polish the moon laser"}
	${"Sprinkles gl-amour on the buggy code"}
	${"GL-gh"}
	${"-468"}
	${"use line comments with 0#"}
	${"Add safety rails no-issue"}
	${"[Incident] Teach the logs to use their inside voice"}
	${"just like the outer space incident"}
`(
	"when the subject line of $subjectLine does not contain any GitHub-/GitLab-style issue links or wildcards",
	(props: { subjectLine: string }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, githubStyle)
			expect(commit.subjectLine).toEqual(tokenisePlainText(props.subjectLine))
		})
	},
)

describe.each`
	subjectLine                                                                              | expectedTokens
	${"UNICORN-1"}                                                                           | ${[issueLink("UNICORN-1")]}
	${"UNICORN-2 Release the robot butler"}                                                  | ${[issueLink("UNICORN-2"), space(9), word("Release", 10), space(17), word("the", 18), space(21), word("robot", 22), space(27), word("butler", 28)]}
	${"(UNICORN-12) Fix this confusing plate of spaghetti"}                                  | ${[issueLink("(UNICORN-12)"), space(12), word("Fix", 13), space(16), word("this", 17), space(21), word("confusing", 22), space(31), word("plate", 32), space(37), word("of", 38), space(40), word("spaghetti", 41)]}
	${"amend!UNICORN-59: Sneak in a funny easter egg"}                                       | ${[squashMarker("amend!"), issueLink("UNICORN-59:", 6), space(17), word("Sneak", 18), space(23), word("in", 24), space(26), word("a", 27), space(28), word("funny", 29), space(34), word("easter", 35), space(41), word("egg", 42)]}
	${" UNICORN-8 UNICORN-9 Solve the problem"}                                              | ${[space(), issueLink("UNICORN-8", 1), space(10), issueLink("UNICORN-9", 11), space(20), word("Solve", 21), space(26), word("the", 27), space(30), word("problem", 31)]}
	${"(UNICORN-15) UNICORN-30 [UNICORN-45]:  make the program act like a clown UNICORN-60"} | ${[issueLink("(UNICORN-15)"), space(12), issueLink("UNICORN-30", 13), space(23), issueLink("[UNICORN-45]:", 24), whitespace("  ", 37), word("make", 39), space(43), word("the", 44), space(47), word("program", 48), space(55), word("act", 56), space(59), word("like", 60), space(64), word("a", 65), space(66), word("clown", 67), space(72), issueLink("UNICORN-60", 73)]}
	${"Add some extra love to the code UNICORN-7"}                                           | ${[word("Add"), space(3), word("some", 4), space(8), word("extra", 9), space(14), word("love", 15), space(19), word("to", 20), space(22), word("the", 23), space(26), word("code", 27), space(31), issueLink("UNICORN-7", 32)]}
	${"squash! Apply strawberry jam to make the code sweeter (UNICORN-7044)"}                | ${[squashMarker("squash! "), word("Apply", 8), space(13), word("strawberry", 14), space(24), word("jam", 25), space(28), word("to", 29), space(31), word("make", 32), space(36), word("the", 37), space(40), word("code", 41), space(45), word("sweeter", 46), space(53), issueLink("(UNICORN-7044)", 54)]}
	${"Make the user interface less chaotic [UNICORN-11] UNICORN-17 "}                       | ${[word("Make"), space(4), word("the", 5), space(8), word("user", 9), space(13), word("interface", 14), space(23), word("less", 24), space(28), word("chaotic", 29), space(36), issueLink("[UNICORN-11]", 37), space(49), issueLink("UNICORN-17", 50), space(60)]}
	${"squash! UNICORN-12 Throw a tantrum (UNICORN-34) UNICORN-56 {UNICORN-78} UNICORN-90"}  | ${[squashMarker("squash!"), space(7), issueLink("UNICORN-12", 8), space(18), word("Throw", 19), space(24), word("a", 25), space(26), word("tantrum", 27), space(34), issueLink("(UNICORN-34)", 35), space(47), issueLink("UNICORN-56", 48), space(58), issueLink("{UNICORN-78}", 59), space(72), issueLink("UNICORN-90", 73)]}
	${"fixup! Close UNICORN-1337 by fixing the bug"}                                         | ${[squashMarker("fixup!"), space(6), word("Close", 7), space(12), issueLink("UNICORN-1337", 13), space(25), word("by", 26), space(28), word("fixing", 29), space(35), word("the", 36), space(39), word("bug", 40)]}
	${"<UNICORN-71238> loosen the bolts"}                                                    | ${[issueLink("<UNICORN-71238>"), space(15), word("loosen", 16), space(22), word("the", 23), space(26), word("bolts", 27)]}
	${'Revert "[UNICORN-39] This should fix it. Famous last words"'}                         | ${[revertMarker("Revert", 1), space(6), punctuation('"', 7), issueLink("[UNICORN-39]", 8), space(20), word("This", 21), space(25), word("should", 26), space(32), word("fix", 33), space(36), word("it", 37), punctuation(".", 39), space(40), word("Famous", 41), space(47), word("last", 48), space(52), word("words", 53), punctuation('"', 58)]}
	${"#SECURITY bricked the wifi circuits"}                                                 | ${[issueLink("#SECURITY"), space(9), word("bricked", 10), space(17), word("the", 18), space(21), word("wifi", 22), space(26), word("circuits", 27)]}
	${"UNICORN-880 stop mixing the toxic chemicals #SECURITY"}                               | ${[issueLink("UNICORN-880"), space(11), word("stop", 12), space(16), word("mixing", 17), space(23), word("the", 24), space(27), word("toxic", 28), space(33), word("chemicals", 34), space(43), issueLink("#SECURITY", 44)]}
`(
	"when the subject line of $subjectLine contains Jira-style issue links or wildcards",
	(props: { subjectLine: string; expectedTokens: TokenisedLine }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("extracts issue link tokens", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, jiraStyle)
			expect(commit.subjectLine).toEqual(props.expectedTokens)
		})
	},
)

describe.each`
	subjectLine
	${"UNICORN-"}
	${"unicorn-40 UnIcOrN-41 have wrong casing"}
	${"UNICORN-MAIN"}
	${"Add unicorn-specialities to the masses"}
	${"the syntax is UNICORN-(42)"}
	${"#1"}
	${"UNICORNS ASSEMBLE"}
	${"GH-15 GL-392 extra spicy code detected"}
	${"needs a bit more #security"}
	${"[SECURITY] Upgrade the Unicorn-1337 tech stack to the latest and greatest"}
`(
	"when the subject line of $subjectLine does not contain any Jira-style issue links or wildcards",
	(props: { subjectLine: string }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, jiraStyle)
			expect(commit.subjectLine).toEqual(tokenisePlainText(props.subjectLine))
		})
	},
)

describe.each`
	subjectLine
	${"#1"}
	${"GH-15 GL-392 extra spicy code detected"}
	${"Add some extra love to the code #7"}
	${"(no-issue) #1107 Stop the toaster from joining standup"}
	${"Make the user interface less chaotic [GL-11] #17 "}
	${"(UNICORN-12) Fix this confusing plate of spaghetti"}
	${"(UNICORN-15) UNICORN-30 [UNICORN-45]:  make the program act like a clown UNICORN-60"}
	${"#SECURITY bricked the wifi circuits"}
`(
	"when the subject line of $subjectLine contains potential issue links",
	(props: { subjectLine: string }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		describe("and issue link tokenisation is disabled", () => {
			it("leaves the subject line unchanged", () => {
				const commit = mapCrudeCommitToCommit(crudeCommit, none)
				expect(commit.subjectLine).toEqual(tokenisePlainText(props.subjectLine))
			})
		})
	},
)
