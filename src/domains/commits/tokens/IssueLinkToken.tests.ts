import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { issueLink } from "#commits/tokens/IssueLinkToken.ts"
import { revertMarker } from "#commits/tokens/RevertMarkerToken.ts"
import { squashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import { rawText, text } from "#commits/tokens/TextToken.ts"
import type { TokenisedLine } from "#commits/tokens/Token.ts"
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
	${"GL-4 over the hedge"}                                           | ${[issueLink("GL-4 "), text("over the hedge", 5)]}
	${"-#1079"}                                                        | ${[text("-"), issueLink("#1079", 1)]}
	${"Closes #24."}                                                   | ${[text("Closes"), issueLink(" #24", 6), text(".", 10)]}
	${"#1.5"}                                                          | ${[issueLink("#1"), text(".5", 2)]}
	${"##78"}                                                          | ${[text("#"), issueLink("#78", 1)]}
	${"#2 Release the robot butler"}                                   | ${[issueLink("#2 "), text("Release the robot butler", 3)]}
	${"(#12) Fix this confusing plate of spaghetti"}                   | ${[issueLink("(#12) "), text("Fix this confusing plate of spaghetti", 6)]}
	${"amend!#59: Sneak in a funny easter egg"}                        | ${[squashMarker("amend!"), issueLink("#59: ", 6), text("Sneak in a funny easter egg", 11)]}
	${" #8 #9 Solve the problem"}                                      | ${[issueLink(" #8 "), issueLink("#9 ", 4), text("Solve the problem", 7)]}
	${"(GH-15) #30 [#45]:  make the program act like a clown GL-60"}   | ${[issueLink("(GH-15) "), issueLink("#30 ", 8), issueLink("[#45]:  ", 12), text("make the program act like a clown", 20), issueLink(" GL-60", 53)]}
	${"Add some extra love to the code #7"}                            | ${[text("Add some extra love to the code"), issueLink(" #7", 31)]}
	${"squash! Apply strawberry jam to make the code sweeter (#7044)"} | ${[squashMarker("squash! "), text("Apply strawberry jam to make the code sweeter", 8), issueLink(" (#7044)", 53)]}
	${"amend!(#42)Soften the API boundaries"}                          | ${[squashMarker("amend!"), issueLink("(#42)", 6), text("Soften the API boundaries", 11)]}
	${"Make the user interface less chaotic [GL-11] #17 "}             | ${[text("Make the user interface less chaotic"), issueLink(" [GL-11] ", 36), issueLink("#17 ", 45)]}
	${"squash! #12 Throw a tantrum (#34) #56 {GH-78} #90"}             | ${[squashMarker("squash! "), issueLink("#12 ", 8), text("Throw a tantrum", 12), issueLink(" (#34) ", 27), issueLink("#56 ", 34), issueLink("{GH-78} ", 38), issueLink("#90", 46)]}
	${"fixup! Close #1337 by fixing the bug"}                          | ${[squashMarker("fixup! "), text("Close", 7), issueLink(" #1337 ", 12), text("by fixing the bug", 19)]}
	${"<#71238> loosen the bolts"}                                     | ${[issueLink("<#71238> "), text("loosen the bolts", 9)]}
	${'Revert "[GH-39] This should fix it. Famous last words"'}        | ${[revertMarker('Revert "', 1), issueLink("[GH-39] ", 8), text("This should fix it. Famous last words", 16), revertMarker('"', 0, 53)]}
	${"(no-issue) Polish the moon laser"}                              | ${[issueLink("(no-issue) "), text("Polish the moon laser", 11)]}
	${"Add safety rails (no-issue)"}                                   | ${[text("Add safety rails"), issueLink(" (no-issue)", 16)]}
	${"squash! [incident] Teach the logs to use their inside voice"}   | ${[squashMarker("squash! "), issueLink("[incident] ", 8), text("Teach the logs to use their inside voice", 19)]}
	${"(no-issue) #1107 Stop the toaster from joining standup"}        | ${[issueLink("(no-issue) "), issueLink("#1107 ", 11), text("Stop the toaster from joining standup", 17)]}
	${"[incident] Skip #42 and UNICORN-8"}                             | ${[issueLink("[incident] "), text("Skip", 11), issueLink(" #42 ", 15), text("and UNICORN-8", 20)]}
	${"fixup![incident](no-issue){#621}secure the rail signals"}       | ${[squashMarker("fixup!"), issueLink("[incident]", 6), issueLink("(no-issue)", 16), issueLink("{#621}", 26), text("secure the rail signals", 32)]}
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
			expect(commit.subjectLine).toEqual([rawText(props.subjectLine)])
		})
	},
)

describe.each`
	subjectLine                                                                              | expectedTokens
	${"UNICORN-1"}                                                                           | ${[issueLink("UNICORN-1")]}
	${"UNICORN-2 Release the robot butler"}                                                  | ${[issueLink("UNICORN-2 "), text("Release the robot butler", 10)]}
	${"(UNICORN-12) Fix this confusing plate of spaghetti"}                                  | ${[issueLink("(UNICORN-12) "), text("Fix this confusing plate of spaghetti", 13)]}
	${"amend!UNICORN-59: Sneak in a funny easter egg"}                                       | ${[squashMarker("amend!"), issueLink("UNICORN-59: ", 6), text("Sneak in a funny easter egg", 18)]}
	${" UNICORN-8 UNICORN-9 Solve the problem"}                                              | ${[issueLink(" UNICORN-8 "), issueLink("UNICORN-9 ", 11), text("Solve the problem", 21)]}
	${"(UNICORN-15) UNICORN-30 [UNICORN-45]:  make the program act like a clown UNICORN-60"} | ${[issueLink("(UNICORN-15) "), issueLink("UNICORN-30 ", 13), issueLink("[UNICORN-45]:  ", 24), text("make the program act like a clown", 39), issueLink(" UNICORN-60", 72)]}
	${"Add some extra love to the code UNICORN-7"}                                           | ${[text("Add some extra love to the code"), issueLink(" UNICORN-7", 31)]}
	${"squash! Apply strawberry jam to make the code sweeter (UNICORN-7044)"}                | ${[squashMarker("squash! "), text("Apply strawberry jam to make the code sweeter", 8), issueLink(" (UNICORN-7044)", 53)]}
	${"Make the user interface less chaotic [UNICORN-11] UNICORN-17 "}                       | ${[text("Make the user interface less chaotic"), issueLink(" [UNICORN-11] ", 36), issueLink("UNICORN-17 ", 50)]}
	${"squash! UNICORN-12 Throw a tantrum (UNICORN-34) UNICORN-56 {UNICORN-78} UNICORN-90"}  | ${[squashMarker("squash! "), issueLink("UNICORN-12 ", 8), text("Throw a tantrum", 19), issueLink(" (UNICORN-34) ", 34), issueLink("UNICORN-56 ", 48), issueLink("{UNICORN-78} ", 59), issueLink("UNICORN-90", 72)]}
	${"fixup! Close UNICORN-1337 by fixing the bug"}                                         | ${[squashMarker("fixup! "), text("Close", 7), issueLink(" UNICORN-1337 ", 12), text("by fixing the bug", 26)]}
	${"<UNICORN-71238> loosen the bolts"}                                                    | ${[issueLink("<UNICORN-71238> "), text("loosen the bolts", 16)]}
	${'Revert "[UNICORN-39] This should fix it. Famous last words"'}                         | ${[revertMarker('Revert "', 1), issueLink("[UNICORN-39] ", 8), text("This should fix it. Famous last words", 21), revertMarker('"', 0, 58)]}
	${"#SECURITY bricked the wifi circuits"}                                                 | ${[issueLink("#SECURITY "), text("bricked the wifi circuits", 10)]}
	${"UNICORN-880 stop mixing the toxic chemicals #SECURITY"}                               | ${[issueLink("UNICORN-880 "), text("stop mixing the toxic chemicals", 12), issueLink(" #SECURITY", 43)]}
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
			expect(commit.subjectLine).toEqual([rawText(props.subjectLine)])
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
				expect(commit.subjectLine).toEqual([rawText(props.subjectLine)])
			})
		})
	},
)
