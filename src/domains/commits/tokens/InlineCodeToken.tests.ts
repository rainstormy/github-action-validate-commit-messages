import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { dependencyVersion } from "#commits/tokens/DependencyVersionToken.ts"
import { inlineCode } from "#commits/tokens/InlineCodeToken.ts"
import { issueLink } from "#commits/tokens/IssueLinkToken.ts"
import { revertMarker } from "#commits/tokens/RevertMarkerToken.ts"
import { squashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import { text } from "#commits/tokens/TextToken.ts"
import type { TokenisedLine } from "#commits/tokens/Token.ts"
import { fakeConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeConfiguration()

describe.each`
	subjectLine                                         | expectedTokens
	${"``"}                                             | ${[inlineCode("``")]}
	${"`code`"}                                         | ${[inlineCode("`code`")]}
	${"Use `pnpm install` to get started"}              | ${[text("Use "), inlineCode("`pnpm install`"), text(" to get started")]}
	${"`git commit` is the command"}                    | ${[inlineCode("`git commit`"), text(" is the command")]}
	${"Run the command `git status`"}                   | ${[text("Run the command "), inlineCode("`git status`")]}
	${"Run `this` and `that`"}                          | ${[text("Run "), inlineCode("`this`"), text(" and "), inlineCode("`that`")]}
	${"Replace `a`, `b`, and `c`"}                      | ${[text("Replace "), inlineCode("`a`"), text(", "), inlineCode("`b`"), text(", and "), inlineCode("`c`")]}
	${"`1``23``456`"}                                   | ${[inlineCode("`1`"), inlineCode("`23`"), inlineCode("`456`")]}
	${"fixup! Use `pnpm install` to get started"}       | ${[squashMarker("fixup! "), text("Use "), inlineCode("`pnpm install`"), text(" to get started")]}
	${'Revert "Use `pnpm install` to get started"'}     | ${[revertMarker('Revert "'), text("Use "), inlineCode("`pnpm install`"), text(' to get started"')]}
	${"Upgrade `react` from 18.3.1 to 19.2.0"}          | ${[text("Upgrade "), inlineCode("`react`"), text(" from "), dependencyVersion("18.3.1"), text(" to "), dependencyVersion("19.2.0")]}
	${"#42: Replace `<a>` with new `<Link>` component"} | ${[issueLink("#42: "), text("Replace "), inlineCode("`<a>`"), text(" with new "), inlineCode("`<Link>`"), text(" component")]}
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
	${"Closes `GL-2`"}                                         | ${[text("Closes "), inlineCode("`GL-2`")]}
	${"New target: `1.0.0`"}                                   | ${[text("New target: "), inlineCode("`1.0.0`")]}
	${"`fixup!` is the correct syntax"}                        | ${[inlineCode("`fixup!`"), text(" is the correct syntax")]}
	${"squash! `fixup!` is the correct syntax"}                | ${[squashMarker("squash! "), inlineCode("`fixup!`"), text(" is the correct syntax")]}
	${"#440: Codename `GH-32`"}                                | ${[issueLink("#440: "), text("Codename "), inlineCode("`GH-32`")]}
	${'Revert "`Revert` "the malfunctioning coffee machine""'} | ${[revertMarker('Revert "'), inlineCode("`Revert`"), text(' "the malfunctioning coffee machine""')]}
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
			expect(commit.subjectLine).toEqual([text(props.subjectLine)])
		})
	},
)
