import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { issueLink } from "#commits/tokens/IssueLinkToken.ts"
import { squashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import type { TokenisedLine } from "#commits/tokens/Token.ts"
import { fakeConfiguration } from "#configurations/Configuration.fixtures.ts"

const configurationGithubStyle = fakeConfiguration()
const configurationJiraStyle = fakeConfiguration({ tokens: { issueLinkPrefixes: ["UNICORN-"] } })

describe.each`
	subjectLine                                                        | expectedTokens
	${"#1"}                                                            | ${[issueLink("#1")]}
	${"GH-0"}                                                          | ${[issueLink("GH-0")]}
	${"GL-4 over the hedge"}                                           | ${[issueLink("GL-4 "), "over the hedge"]}
	${"-#1079"}                                                        | ${["-", issueLink("#1079")]}
	${"Closes #24."}                                                   | ${["Closes", issueLink(" #24"), "."]}
	${"#1.5"}                                                          | ${[issueLink("#1"), ".5"]}
	${"##78"}                                                          | ${["#", issueLink("#78")]}
	${"#2 Release the robot butler"}                                   | ${[issueLink("#2 "), "Release the robot butler"]}
	${"(#12) Fix this confusing plate of spaghetti"}                   | ${[issueLink("(#12) "), "Fix this confusing plate of spaghetti"]}
	${"amend!#59: Sneak in a funny easter egg"}                        | ${[squashMarker("amend!"), issueLink("#59: "), "Sneak in a funny easter egg"]}
	${" #8 #9 Solve the problem"}                                      | ${[issueLink(" #8 "), issueLink("#9 "), "Solve the problem"]}
	${"(GH-15) #30 [#45]:  make the program act like a clown GL-60"}   | ${[issueLink("(GH-15) "), issueLink("#30 "), issueLink("[#45]:  "), "make the program act like a clown", issueLink(" GL-60")]}
	${"Add some extra love to the code #7"}                            | ${["Add some extra love to the code", issueLink(" #7")]}
	${"squash! Apply strawberry jam to make the code sweeter (#7044)"} | ${[squashMarker("squash! "), "Apply strawberry jam to make the code sweeter", issueLink(" (#7044)")]}
	${"amend!(#42)Soften the API boundaries"}                          | ${[squashMarker("amend!"), issueLink("(#42)"), "Soften the API boundaries"]}
	${"Make the user interface less chaotic [GL-11] #17 "}             | ${["Make the user interface less chaotic", issueLink(" [GL-11] "), issueLink("#17 ")]}
	${"squash! #12 Throw a tantrum (#34) #56 {GH-78} #90"}             | ${[squashMarker("squash! "), issueLink("#12 "), "Throw a tantrum", issueLink(" (#34) "), issueLink("#56 "), issueLink("{GH-78} "), issueLink("#90")]}
	${"fixup! Close #1337 by fixing the bug"}                          | ${[squashMarker("fixup! "), "Close", issueLink(" #1337 "), "by fixing the bug"]}
	${"<#71238> loosen the bolts"}                                     | ${[issueLink("<#71238> "), "loosen the bolts"]}
`(
	"when the subject line of $subjectLine contains GitHub-/GitLab-style issue links",
	(props: { subjectLine: string; expectedTokens: TokenisedLine }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("extracts issue link tokens", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configurationGithubStyle)
			expect(commit.subjectLine).toEqual(props.expectedTokens)
		})
	},
)

describe.each`
	subjectLine
	${"#"}
	${"#MAIN"}
	${"Add #fluent and #api as relevant tags"}
	${"the syntax is #(42)"}
	${"add the GH-cli"}
	${"GL--"}
	${"undo gh-view"}
	${"Sprinkles gl-amour on the buggy code"}
	${"GL-gh"}
	${"-468"}
	${"use line comments with 0#"}
`(
	"when the subject line of $subjectLine does not contain any GitHub-/GitLab-style issue links",
	(props: { subjectLine: string }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configurationGithubStyle)
			expect(commit.subjectLine).toEqual([props.subjectLine])
		})
	},
)

describe.each`
	subjectLine                                                                              | expectedTokens
	${"UNICORN-1"}                                                                           | ${[issueLink("UNICORN-1")]}
	${"UNICORN-2 Release the robot butler"}                                                  | ${[issueLink("UNICORN-2 "), "Release the robot butler"]}
	${"(UNICORN-12) Fix this confusing plate of spaghetti"}                                  | ${[issueLink("(UNICORN-12) "), "Fix this confusing plate of spaghetti"]}
	${"amend!UNICORN-59: Sneak in a funny easter egg"}                                       | ${[squashMarker("amend!"), issueLink("UNICORN-59: "), "Sneak in a funny easter egg"]}
	${" UNICORN-8 UNICORN-9 Solve the problem"}                                              | ${[issueLink(" UNICORN-8 "), issueLink("UNICORN-9 "), "Solve the problem"]}
	${"(UNICORN-15) UNICORN-30 [UNICORN-45]:  make the program act like a clown UNICORN-60"} | ${[issueLink("(UNICORN-15) "), issueLink("UNICORN-30 "), issueLink("[UNICORN-45]:  "), "make the program act like a clown", issueLink(" UNICORN-60")]}
	${"Add some extra love to the code UNICORN-7"}                                           | ${["Add some extra love to the code", issueLink(" UNICORN-7")]}
	${"squash! Apply strawberry jam to make the code sweeter (UNICORN-7044)"}                | ${[squashMarker("squash! "), "Apply strawberry jam to make the code sweeter", issueLink(" (UNICORN-7044)")]}
	${"Make the user interface less chaotic [UNICORN-11] UNICORN-17 "}                       | ${["Make the user interface less chaotic", issueLink(" [UNICORN-11] "), issueLink("UNICORN-17 ")]}
	${"squash! UNICORN-12 Throw a tantrum (UNICORN-34) UNICORN-56 {UNICORN-78} UNICORN-90"}  | ${[squashMarker("squash! "), issueLink("UNICORN-12 "), "Throw a tantrum", issueLink(" (UNICORN-34) "), issueLink("UNICORN-56 "), issueLink("{UNICORN-78} "), issueLink("UNICORN-90")]}
	${"fixup! Close UNICORN-1337 by fixing the bug"}                                         | ${[squashMarker("fixup! "), "Close", issueLink(" UNICORN-1337 "), "by fixing the bug"]}
	${"<UNICORN-71238> loosen the bolts"}                                                    | ${[issueLink("<UNICORN-71238> "), "loosen the bolts"]}
`(
	"when the subject line of $subjectLine contains Jira-style issue links",
	(props: { subjectLine: string; expectedTokens: TokenisedLine }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("extracts issue link tokens", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configurationJiraStyle)
			expect(commit.subjectLine).toEqual(props.expectedTokens)
		})
	},
)

describe.each`
	subjectLine
	${"UNICORN-"}
	${"UNICORN-MAIN"}
	${"Add unicorn-specialities to the masses"}
	${"the syntax is UNICORN-(42)"}
	${"#1"}
	${"UNICORNS ASSEMBLE"}
	${"GH-15 GL-392 extra spicy code detected"}
`(
	"when the subject line of $subjectLine does not contain any Jira-style issue links",
	(props: { subjectLine: string }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configurationJiraStyle)
			expect(commit.subjectLine).toEqual([props.subjectLine])
		})
	},
)
