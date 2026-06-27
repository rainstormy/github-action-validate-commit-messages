import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { issueLink } from "#commits/tokens/IssueLinkToken.ts"
import { punctuation } from "#commits/tokens/PunctuationToken.ts"
import { revertMarker } from "#commits/tokens/RevertMarkerToken.ts"
import { squashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import { type TokenisedLine, tokenisePlainText } from "#commits/tokens/Token.ts"
import { whitespace } from "#commits/tokens/WhitespaceToken.ts"
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
	${"GL-4 over the hedge"}                                           | ${[issueLink("GL-4 "), word("over", 5), whitespace(" ", 9), word("the", 10), whitespace(" ", 13), word("hedge", 14)]}
	${"-#1079"}                                                        | ${[punctuation("-"), issueLink("#1079", 1)]}
	${"Closes #24."}                                                   | ${[word("Closes"), issueLink(" #24", 6), punctuation(".", 10)]}
	${"#1.5"}                                                          | ${[issueLink("#1"), punctuation(".", 2), word("5", 3)]}
	${"##78"}                                                          | ${[punctuation("#"), issueLink("#78", 1)]}
	${"#2 Release the robot butler"}                                   | ${[issueLink("#2 "), word("Release", 3), whitespace(" ", 10), word("the", 11), whitespace(" ", 14), word("robot", 15), whitespace(" ", 20), word("butler", 21)]}
	${"(#12) Fix this confusing plate of spaghetti"}                   | ${[issueLink("(#12) "), word("Fix", 6), whitespace(" ", 9), word("this", 10), whitespace(" ", 14), word("confusing", 15), whitespace(" ", 24), word("plate", 25), whitespace(" ", 30), word("of", 31), whitespace(" ", 33), word("spaghetti", 34)]}
	${"amend!#59: Sneak in a funny easter egg"}                        | ${[squashMarker("amend!"), issueLink("#59: ", 6), word("Sneak", 11), whitespace(" ", 16), word("in", 17), whitespace(" ", 19), word("a", 20), whitespace(" ", 21), word("funny", 22), whitespace(" ", 27), word("easter", 28), whitespace(" ", 34), word("egg", 35)]}
	${" #8 #9 Solve the problem"}                                      | ${[issueLink(" #8 "), issueLink("#9 ", 4), word("Solve", 7), whitespace(" ", 12), word("the", 13), whitespace(" ", 16), word("problem", 17)]}
	${"(GH-15) #30 [#45]:  make the program act like a clown GL-60"}   | ${[issueLink("(GH-15) "), issueLink("#30 ", 8), issueLink("[#45]:  ", 12), word("make", 20), whitespace(" ", 24), word("the", 25), whitespace(" ", 28), word("program", 29), whitespace(" ", 36), word("act", 37), whitespace(" ", 40), word("like", 41), whitespace(" ", 45), word("a", 46), whitespace(" ", 47), word("clown", 48), issueLink(" GL-60", 53)]}
	${"Add some extra love to the code #7"}                            | ${[word("Add"), whitespace(" ", 3), word("some", 4), whitespace(" ", 8), word("extra", 9), whitespace(" ", 14), word("love", 15), whitespace(" ", 19), word("to", 20), whitespace(" ", 22), word("the", 23), whitespace(" ", 26), word("code", 27), issueLink(" #7", 31)]}
	${"squash! Apply strawberry jam to make the code sweeter (#7044)"} | ${[squashMarker("squash! "), word("Apply", 8), whitespace(" ", 13), word("strawberry", 14), whitespace(" ", 24), word("jam", 25), whitespace(" ", 28), word("to", 29), whitespace(" ", 31), word("make", 32), whitespace(" ", 36), word("the", 37), whitespace(" ", 40), word("code", 41), whitespace(" ", 45), word("sweeter", 46), issueLink(" (#7044)", 53)]}
	${"amend!(#42)Soften the API boundaries"}                          | ${[squashMarker("amend!"), issueLink("(#42)", 6), word("Soften", 11), whitespace(" ", 17), word("the", 18), whitespace(" ", 21), word("API", 22), whitespace(" ", 25), word("boundaries", 26)]}
	${"Make the user interface less chaotic [GL-11] #17 "}             | ${[word("Make"), whitespace(" ", 4), word("the", 5), whitespace(" ", 8), word("user", 9), whitespace(" ", 13), word("interface", 14), whitespace(" ", 23), word("less", 24), whitespace(" ", 28), word("chaotic", 29), issueLink(" [GL-11] ", 36), issueLink("#17 ", 45)]}
	${"squash! #12 Throw a tantrum (#34) #56 {GH-78} #90"}             | ${[squashMarker("squash! "), issueLink("#12 ", 8), word("Throw", 12), whitespace(" ", 17), word("a", 18), whitespace(" ", 19), word("tantrum", 20), issueLink(" (#34) ", 27), issueLink("#56 ", 34), issueLink("{GH-78} ", 38), issueLink("#90", 46)]}
	${"fixup! Close #1337 by fixing the bug"}                          | ${[squashMarker("fixup! "), word("Close", 7), issueLink(" #1337 ", 12), word("by", 19), whitespace(" ", 21), word("fixing", 22), whitespace(" ", 28), word("the", 29), whitespace(" ", 32), word("bug", 33)]}
	${"<#71238> loosen the bolts"}                                     | ${[issueLink("<#71238> "), word("loosen", 9), whitespace(" ", 15), word("the", 16), whitespace(" ", 19), word("bolts", 20)]}
	${'Revert "[GH-39] This should fix it. Famous last words"'}        | ${[revertMarker('Revert "', 1), issueLink("[GH-39] ", 8), word("This", 16), whitespace(" ", 20), word("should", 21), whitespace(" ", 27), word("fix", 28), whitespace(" ", 31), word("it", 32), punctuation(".", 34), whitespace(" ", 35), word("Famous", 36), whitespace(" ", 42), word("last", 43), whitespace(" ", 47), word("words", 48), revertMarker('"', 0, 53)]}
	${"(no-issue) Polish the moon laser"}                              | ${[issueLink("(no-issue) "), word("Polish", 11), whitespace(" ", 17), word("the", 18), whitespace(" ", 21), word("moon", 22), whitespace(" ", 26), word("laser", 27)]}
	${"Add safety rails (no-issue)"}                                   | ${[word("Add"), whitespace(" ", 3), word("safety", 4), whitespace(" ", 10), word("rails", 11), issueLink(" (no-issue)", 16)]}
	${"squash! [incident] Teach the logs to use their inside voice"}   | ${[squashMarker("squash! "), issueLink("[incident] ", 8), word("Teach", 19), whitespace(" ", 24), word("the", 25), whitespace(" ", 28), word("logs", 29), whitespace(" ", 33), word("to", 34), whitespace(" ", 36), word("use", 37), whitespace(" ", 40), word("their", 41), whitespace(" ", 46), word("inside", 47), whitespace(" ", 53), word("voice", 54)]}
	${"(no-issue) #1107 Stop the toaster from joining standup"}        | ${[issueLink("(no-issue) "), issueLink("#1107 ", 11), word("Stop", 17), whitespace(" ", 21), word("the", 22), whitespace(" ", 25), word("toaster", 26), whitespace(" ", 33), word("from", 34), whitespace(" ", 38), word("joining", 39), whitespace(" ", 46), word("standup", 47)]}
	${"[incident] Skip #42 and UNICORN-8"}                             | ${[issueLink("[incident] "), word("Skip", 11), issueLink(" #42 ", 15), word("and", 20), whitespace(" ", 23), word("UNICORN-8", 24)]}
	${"fixup![incident](no-issue){#621}secure the rail signals"}       | ${[squashMarker("fixup!"), issueLink("[incident]", 6), issueLink("(no-issue)", 16), issueLink("{#621}", 26), word("secure", 32), whitespace(" ", 38), word("the", 39), whitespace(" ", 42), word("rail", 43), whitespace(" ", 47), word("signals", 48)]}
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
	${"UNICORN-2 Release the robot butler"}                                                  | ${[issueLink("UNICORN-2 "), word("Release", 10), whitespace(" ", 17), word("the", 18), whitespace(" ", 21), word("robot", 22), whitespace(" ", 27), word("butler", 28)]}
	${"(UNICORN-12) Fix this confusing plate of spaghetti"}                                  | ${[issueLink("(UNICORN-12) "), word("Fix", 13), whitespace(" ", 16), word("this", 17), whitespace(" ", 21), word("confusing", 22), whitespace(" ", 31), word("plate", 32), whitespace(" ", 37), word("of", 38), whitespace(" ", 40), word("spaghetti", 41)]}
	${"amend!UNICORN-59: Sneak in a funny easter egg"}                                       | ${[squashMarker("amend!"), issueLink("UNICORN-59: ", 6), word("Sneak", 18), whitespace(" ", 23), word("in", 24), whitespace(" ", 26), word("a", 27), whitespace(" ", 28), word("funny", 29), whitespace(" ", 34), word("easter", 35), whitespace(" ", 41), word("egg", 42)]}
	${" UNICORN-8 UNICORN-9 Solve the problem"}                                              | ${[issueLink(" UNICORN-8 "), issueLink("UNICORN-9 ", 11), word("Solve", 21), whitespace(" ", 26), word("the", 27), whitespace(" ", 30), word("problem", 31)]}
	${"(UNICORN-15) UNICORN-30 [UNICORN-45]:  make the program act like a clown UNICORN-60"} | ${[issueLink("(UNICORN-15) "), issueLink("UNICORN-30 ", 13), issueLink("[UNICORN-45]:  ", 24), word("make", 39), whitespace(" ", 43), word("the", 44), whitespace(" ", 47), word("program", 48), whitespace(" ", 55), word("act", 56), whitespace(" ", 59), word("like", 60), whitespace(" ", 64), word("a", 65), whitespace(" ", 66), word("clown", 67), issueLink(" UNICORN-60", 72)]}
	${"Add some extra love to the code UNICORN-7"}                                           | ${[word("Add"), whitespace(" ", 3), word("some", 4), whitespace(" ", 8), word("extra", 9), whitespace(" ", 14), word("love", 15), whitespace(" ", 19), word("to", 20), whitespace(" ", 22), word("the", 23), whitespace(" ", 26), word("code", 27), issueLink(" UNICORN-7", 31)]}
	${"squash! Apply strawberry jam to make the code sweeter (UNICORN-7044)"}                | ${[squashMarker("squash! "), word("Apply", 8), whitespace(" ", 13), word("strawberry", 14), whitespace(" ", 24), word("jam", 25), whitespace(" ", 28), word("to", 29), whitespace(" ", 31), word("make", 32), whitespace(" ", 36), word("the", 37), whitespace(" ", 40), word("code", 41), whitespace(" ", 45), word("sweeter", 46), issueLink(" (UNICORN-7044)", 53)]}
	${"Make the user interface less chaotic [UNICORN-11] UNICORN-17 "}                       | ${[word("Make"), whitespace(" ", 4), word("the", 5), whitespace(" ", 8), word("user", 9), whitespace(" ", 13), word("interface", 14), whitespace(" ", 23), word("less", 24), whitespace(" ", 28), word("chaotic", 29), issueLink(" [UNICORN-11] ", 36), issueLink("UNICORN-17 ", 50)]}
	${"squash! UNICORN-12 Throw a tantrum (UNICORN-34) UNICORN-56 {UNICORN-78} UNICORN-90"}  | ${[squashMarker("squash! "), issueLink("UNICORN-12 ", 8), word("Throw", 19), whitespace(" ", 24), word("a", 25), whitespace(" ", 26), word("tantrum", 27), issueLink(" (UNICORN-34) ", 34), issueLink("UNICORN-56 ", 48), issueLink("{UNICORN-78} ", 59), issueLink("UNICORN-90", 72)]}
	${"fixup! Close UNICORN-1337 by fixing the bug"}                                         | ${[squashMarker("fixup! "), word("Close", 7), issueLink(" UNICORN-1337 ", 12), word("by", 26), whitespace(" ", 28), word("fixing", 29), whitespace(" ", 35), word("the", 36), whitespace(" ", 39), word("bug", 40)]}
	${"<UNICORN-71238> loosen the bolts"}                                                    | ${[issueLink("<UNICORN-71238> "), word("loosen", 16), whitespace(" ", 22), word("the", 23), whitespace(" ", 26), word("bolts", 27)]}
	${'Revert "[UNICORN-39] This should fix it. Famous last words"'}                         | ${[revertMarker('Revert "', 1), issueLink("[UNICORN-39] ", 8), word("This", 21), whitespace(" ", 25), word("should", 26), whitespace(" ", 32), word("fix", 33), whitespace(" ", 36), word("it", 37), punctuation(".", 39), whitespace(" ", 40), word("Famous", 41), whitespace(" ", 47), word("last", 48), whitespace(" ", 52), word("words", 53), revertMarker('"', 0, 58)]}
	${"#SECURITY bricked the wifi circuits"}                                                 | ${[issueLink("#SECURITY "), word("bricked", 10), whitespace(" ", 17), word("the", 18), whitespace(" ", 21), word("wifi", 22), whitespace(" ", 26), word("circuits", 27)]}
	${"UNICORN-880 stop mixing the toxic chemicals #SECURITY"}                               | ${[issueLink("UNICORN-880 "), word("stop", 12), whitespace(" ", 16), word("mixing", 17), whitespace(" ", 23), word("the", 24), whitespace(" ", 27), word("toxic", 28), whitespace(" ", 33), word("chemicals", 34), issueLink(" #SECURITY", 43)]}
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
