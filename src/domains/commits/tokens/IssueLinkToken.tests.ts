import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { issueLink } from "#commits/tokens/IssueLinkToken.ts"
import { revertMarker } from "#commits/tokens/RevertMarkerToken.ts"
import { squashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import { text } from "#commits/tokens/TextToken.ts"
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
	${"#1"}                                                            | ${[issueLink("#1", [0, 2])]}
	${"GH-0"}                                                          | ${[issueLink("GH-0", [0, 4])]}
	${"GL-4 over the hedge"}                                           | ${[issueLink("GL-4 ", [0, 5]), text("over the hedge", [5, 19])]}
	${"-#1079"}                                                        | ${[text("-", [0, 1]), issueLink("#1079", [1, 6])]}
	${"Closes #24."}                                                   | ${[text("Closes", [0, 6]), issueLink(" #24", [6, 10]), text(".", [10, 11])]}
	${"#1.5"}                                                          | ${[issueLink("#1", [0, 2]), text(".5", [2, 4])]}
	${"##78"}                                                          | ${[text("#", [0, 1]), issueLink("#78", [1, 4])]}
	${"#2 Release the robot butler"}                                   | ${[issueLink("#2 ", [0, 3]), text("Release the robot butler", [3, 27])]}
	${"(#12) Fix this confusing plate of spaghetti"}                   | ${[issueLink("(#12) ", [0, 6]), text("Fix this confusing plate of spaghetti", [6, 43])]}
	${"amend!#59: Sneak in a funny easter egg"}                        | ${[squashMarker("amend!", [0, 6]), issueLink("#59: ", [6, 11]), text("Sneak in a funny easter egg", [11, 38])]}
	${" #8 #9 Solve the problem"}                                      | ${[issueLink(" #8 ", [0, 4]), issueLink("#9 ", [4, 7]), text("Solve the problem", [7, 24])]}
	${"(GH-15) #30 [#45]:  make the program act like a clown GL-60"}   | ${[issueLink("(GH-15) ", [0, 8]), issueLink("#30 ", [8, 12]), issueLink("[#45]:  ", [12, 20]), text("make the program act like a clown", [20, 53]), issueLink(" GL-60", [53, 59])]}
	${"Add some extra love to the code #7"}                            | ${[text("Add some extra love to the code", [0, 31]), issueLink(" #7", [31, 34])]}
	${"squash! Apply strawberry jam to make the code sweeter (#7044)"} | ${[squashMarker("squash! ", [0, 8]), text("Apply strawberry jam to make the code sweeter", [8, 53]), issueLink(" (#7044)", [53, 61])]}
	${"amend!(#42)Soften the API boundaries"}                          | ${[squashMarker("amend!", [0, 6]), issueLink("(#42)", [6, 11]), text("Soften the API boundaries", [11, 36])]}
	${"Make the user interface less chaotic [GL-11] #17 "}             | ${[text("Make the user interface less chaotic", [0, 36]), issueLink(" [GL-11] ", [36, 45]), issueLink("#17 ", [45, 49])]}
	${"squash! #12 Throw a tantrum (#34) #56 {GH-78} #90"}             | ${[squashMarker("squash! ", [0, 8]), issueLink("#12 ", [8, 12]), text("Throw a tantrum", [12, 27]), issueLink(" (#34) ", [27, 34]), issueLink("#56 ", [34, 38]), issueLink("{GH-78} ", [38, 46]), issueLink("#90", [46, 49])]}
	${"fixup! Close #1337 by fixing the bug"}                          | ${[squashMarker("fixup! ", [0, 7]), text("Close", [7, 12]), issueLink(" #1337 ", [12, 19]), text("by fixing the bug", [19, 36])]}
	${"<#71238> loosen the bolts"}                                     | ${[issueLink("<#71238> ", [0, 9]), text("loosen the bolts", [9, 25])]}
	${'Revert "[GH-39] This should fix it. Famous last words"'}        | ${[revertMarker('Revert "', 1, [0, 8]), issueLink("[GH-39] ", [8, 16]), text("This should fix it. Famous last words", [16, 53]), revertMarker('"', 0, [53, 54])]}
	${"(no-issue) Polish the moon laser"}                              | ${[issueLink("(no-issue) ", [0, 11]), text("Polish the moon laser", [11, 32])]}
	${"Add safety rails (no-issue)"}                                   | ${[text("Add safety rails", [0, 16]), issueLink(" (no-issue)", [16, 27])]}
	${"squash! [incident] Teach the logs to use their inside voice"}   | ${[squashMarker("squash! ", [0, 8]), issueLink("[incident] ", [8, 19]), text("Teach the logs to use their inside voice", [19, 59])]}
	${"(no-issue) #1107 Stop the toaster from joining standup"}        | ${[issueLink("(no-issue) ", [0, 11]), issueLink("#1107 ", [11, 17]), text("Stop the toaster from joining standup", [17, 54])]}
	${"[incident] Skip #42 and UNICORN-8"}                             | ${[issueLink("[incident] ", [0, 11]), text("Skip", [11, 15]), issueLink(" #42 ", [15, 20]), text("and UNICORN-8", [20, 33])]}
	${"fixup![incident](no-issue){#621}secure the rail signals"}       | ${[squashMarker("fixup!", [0, 6]), issueLink("[incident]", [6, 16]), issueLink("(no-issue)", [16, 26]), issueLink("{#621}", [26, 32]), text("secure the rail signals", [32, 55])]}
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
			expect(commit.subjectLine).toEqual([text(props.subjectLine, [0, props.subjectLine.length])])
		})
	},
)

describe.each`
	subjectLine                                                                              | expectedTokens
	${"UNICORN-1"}                                                                           | ${[issueLink("UNICORN-1", [0, 9])]}
	${"UNICORN-2 Release the robot butler"}                                                  | ${[issueLink("UNICORN-2 ", [0, 10]), text("Release the robot butler", [10, 34])]}
	${"(UNICORN-12) Fix this confusing plate of spaghetti"}                                  | ${[issueLink("(UNICORN-12) ", [0, 13]), text("Fix this confusing plate of spaghetti", [13, 50])]}
	${"amend!UNICORN-59: Sneak in a funny easter egg"}                                       | ${[squashMarker("amend!", [0, 6]), issueLink("UNICORN-59: ", [6, 18]), text("Sneak in a funny easter egg", [18, 45])]}
	${" UNICORN-8 UNICORN-9 Solve the problem"}                                              | ${[issueLink(" UNICORN-8 ", [0, 11]), issueLink("UNICORN-9 ", [11, 21]), text("Solve the problem", [21, 38])]}
	${"(UNICORN-15) UNICORN-30 [UNICORN-45]:  make the program act like a clown UNICORN-60"} | ${[issueLink("(UNICORN-15) ", [0, 13]), issueLink("UNICORN-30 ", [13, 24]), issueLink("[UNICORN-45]:  ", [24, 39]), text("make the program act like a clown", [39, 72]), issueLink(" UNICORN-60", [72, 83])]}
	${"Add some extra love to the code UNICORN-7"}                                           | ${[text("Add some extra love to the code", [0, 31]), issueLink(" UNICORN-7", [31, 41])]}
	${"squash! Apply strawberry jam to make the code sweeter (UNICORN-7044)"}                | ${[squashMarker("squash! ", [0, 8]), text("Apply strawberry jam to make the code sweeter", [8, 53]), issueLink(" (UNICORN-7044)", [53, 68])]}
	${"Make the user interface less chaotic [UNICORN-11] UNICORN-17 "}                       | ${[text("Make the user interface less chaotic", [0, 36]), issueLink(" [UNICORN-11] ", [36, 50]), issueLink("UNICORN-17 ", [50, 61])]}
	${"squash! UNICORN-12 Throw a tantrum (UNICORN-34) UNICORN-56 {UNICORN-78} UNICORN-90"}  | ${[squashMarker("squash! ", [0, 8]), issueLink("UNICORN-12 ", [8, 19]), text("Throw a tantrum", [19, 34]), issueLink(" (UNICORN-34) ", [34, 48]), issueLink("UNICORN-56 ", [48, 59]), issueLink("{UNICORN-78} ", [59, 72]), issueLink("UNICORN-90", [72, 82])]}
	${"fixup! Close UNICORN-1337 by fixing the bug"}                                         | ${[squashMarker("fixup! ", [0, 7]), text("Close", [7, 12]), issueLink(" UNICORN-1337 ", [12, 26]), text("by fixing the bug", [26, 43])]}
	${"<UNICORN-71238> loosen the bolts"}                                                    | ${[issueLink("<UNICORN-71238> ", [0, 16]), text("loosen the bolts", [16, 32])]}
	${'Revert "[UNICORN-39] This should fix it. Famous last words"'}                         | ${[revertMarker('Revert "', 1, [0, 8]), issueLink("[UNICORN-39] ", [8, 21]), text("This should fix it. Famous last words", [21, 58]), revertMarker('"', 0, [58, 59])]}
	${"#SECURITY bricked the wifi circuits"}                                                 | ${[issueLink("#SECURITY ", [0, 10]), text("bricked the wifi circuits", [10, 35])]}
	${"UNICORN-880 stop mixing the toxic chemicals #SECURITY"}                               | ${[issueLink("UNICORN-880 ", [0, 12]), text("stop mixing the toxic chemicals", [12, 43]), issueLink(" #SECURITY", [43, 53])]}
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
			expect(commit.subjectLine).toEqual([text(props.subjectLine, [0, props.subjectLine.length])])
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
				expect(commit.subjectLine).toEqual([text(props.subjectLine, [0, props.subjectLine.length])])
			})
		})
	},
)
