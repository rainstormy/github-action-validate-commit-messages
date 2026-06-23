import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { dependencyVersion } from "#commits/tokens/DependencyVersionToken.ts"
import { inlineCode } from "#commits/tokens/InlineCodeToken.ts"
import { issueLink } from "#commits/tokens/IssueLinkToken.ts"
import { revertMarker } from "#commits/tokens/RevertMarkerToken.ts"
import { squashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import { rawText, text } from "#commits/tokens/TextToken.ts"
import type { TokenisedLine } from "#commits/tokens/Token.ts"
import { fakeTokenConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeTokenConfiguration()

describe.each`
	subjectLine                                         | expectedTokens
	${"``"}                                             | ${[inlineCode("``")]}
	${"`code`"}                                         | ${[inlineCode("`code`")]}
	${"Use `pnpm install` to get started"}              | ${[text("Use "), inlineCode("`pnpm install`", 4), text(" to get started", 18)]}
	${"`git commit` is the command"}                    | ${[inlineCode("`git commit`"), text(" is the command", 12)]}
	${"Run the command `git status`"}                   | ${[text("Run the command "), inlineCode("`git status`", 16)]}
	${"Run `this` and `that`"}                          | ${[text("Run "), inlineCode("`this`", 4), text(" and ", 10), inlineCode("`that`", 15)]}
	${"Replace `a`, `b`, and `c`"}                      | ${[text("Replace "), inlineCode("`a`", 8), text(", ", 11), inlineCode("`b`", 13), text(", and ", 16), inlineCode("`c`", 22)]}
	${"`1``23``456`"}                                   | ${[inlineCode("`1`"), inlineCode("`23`", 3), inlineCode("`456`", 7)]}
	${"fixup! Use `pnpm install` to get started"}       | ${[squashMarker("fixup! "), text("Use ", 7), inlineCode("`pnpm install`", 11), text(" to get started", 25)]}
	${'Revert "Use `pnpm install` to get started"'}     | ${[revertMarker('Revert "', 1), text("Use ", 8), inlineCode("`pnpm install`", 12), text(" to get started", 26), revertMarker('"', 0, 41)]}
	${"Upgrade `react` from 18.3.1 to 19.2.0"}          | ${[text("Upgrade "), inlineCode("`react`", 8), text(" from ", 15), dependencyVersion("18.3.1", 21), text(" to ", 27), dependencyVersion("19.2.0", 31)]}
	${"#42: Replace `<a>` with new `<Link>` component"} | ${[issueLink("#42: "), text("Replace ", 5), inlineCode("`<a>`", 13), text(" with new ", 18), inlineCode("`<Link>`", 28), text(" component", 36)]}
`(
	"when the subject line of $subjectLine contains inline code phrases",
	(props: { subjectLine: string; expectedTokens: TokenisedLine }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("extracts inline code tokens", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(props.expectedTokens)
		})
	},
)

describe.each`
	subjectLine                                                | expectedTokens
	${"`#42`"}                                                 | ${[inlineCode("`#42`")]}
	${"Closes `GL-2`"}                                         | ${[text("Closes "), inlineCode("`GL-2`", 7)]}
	${"New target: `1.0.0`"}                                   | ${[text("New target: "), inlineCode("`1.0.0`", 12)]}
	${"`fixup!` is the correct syntax"}                        | ${[inlineCode("`fixup!`"), text(" is the correct syntax", 8)]}
	${"squash! `fixup!` is the correct syntax"}                | ${[squashMarker("squash! "), inlineCode("`fixup!`", 8), text(" is the correct syntax", 16)]}
	${"#440: Codename `GH-32`"}                                | ${[issueLink("#440: "), text("Codename ", 6), inlineCode("`GH-32`", 15)]}
	${"this looks related to `#92`"}                           | ${[text("this looks related to "), inlineCode("`#92`", 22)]}
	${'Revert "`Revert` "the malfunctioning coffee machine""'} | ${[revertMarker('Revert "', 1), inlineCode("`Revert`", 8), text(' "the malfunctioning coffee machine"', 16), revertMarker('"', 0, 52)]}
`(
	"when the subject line of $subjectLine contains inline code phrases that resemble other kinds of tokens",
	(props: { subjectLine: string; expectedTokens: TokenisedLine }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("extracts inline code tokens", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(props.expectedTokens)
		})
	},
)

describe.each`
	subjectLine
	${"Good boy"}
	${"It's not a backtick issue"}
	${"Use ` alone"}
	${"Revert the `unclosed phrase"}
	${"A backtick at the end `"}
`(
	"when the subject line of $subjectLine does not contain any inline code phrases",
	(props: { subjectLine: string }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual([rawText(props.subjectLine)])
		})
	},
)
