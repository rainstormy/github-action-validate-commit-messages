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
	${"``"}                                             | ${[inlineCode("``", [0, 2])]}
	${"`code`"}                                         | ${[inlineCode("`code`", [0, 6])]}
	${"Use `pnpm install` to get started"}              | ${[text("Use ", [0, 4]), inlineCode("`pnpm install`", [4, 18]), text(" to get started", [18, 33])]}
	${"`git commit` is the command"}                    | ${[inlineCode("`git commit`", [0, 12]), text(" is the command", [12, 27])]}
	${"Run the command `git status`"}                   | ${[text("Run the command ", [0, 16]), inlineCode("`git status`", [16, 28])]}
	${"Run `this` and `that`"}                          | ${[text("Run ", [0, 4]), inlineCode("`this`", [4, 10]), text(" and ", [10, 15]), inlineCode("`that`", [15, 21])]}
	${"Replace `a`, `b`, and `c`"}                      | ${[text("Replace ", [0, 8]), inlineCode("`a`", [8, 11]), text(", ", [11, 13]), inlineCode("`b`", [13, 16]), text(", and ", [16, 22]), inlineCode("`c`", [22, 25])]}
	${"`1``23``456`"}                                   | ${[inlineCode("`1`", [0, 3]), inlineCode("`23`", [3, 7]), inlineCode("`456`", [7, 12])]}
	${"fixup! Use `pnpm install` to get started"}       | ${[squashMarker("fixup! ", [0, 7]), text("Use ", [7, 11]), inlineCode("`pnpm install`", [11, 25]), text(" to get started", [25, 40])]}
	${'Revert "Use `pnpm install` to get started"'}     | ${[revertMarker('Revert "', 1, [0, 8]), text("Use ", [8, 12]), inlineCode("`pnpm install`", [12, 26]), text(" to get started", [26, 41]), revertMarker('"', 0, [41, 42])]}
	${"Upgrade `react` from 18.3.1 to 19.2.0"}          | ${[text("Upgrade ", [0, 8]), inlineCode("`react`", [8, 15]), text(" from ", [15, 21]), dependencyVersion("18.3.1", [21, 27]), text(" to ", [27, 31]), dependencyVersion("19.2.0", [31, 37])]}
	${"#42: Replace `<a>` with new `<Link>` component"} | ${[issueLink("#42: ", [0, 5]), text("Replace ", [5, 13]), inlineCode("`<a>`", [13, 18]), text(" with new ", [18, 28]), inlineCode("`<Link>`", [28, 36]), text(" component", [36, 46])]}
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
	${"`#42`"}                                                 | ${[inlineCode("`#42`", [0, 5])]}
	${"Closes `GL-2`"}                                         | ${[text("Closes ", [0, 7]), inlineCode("`GL-2`", [7, 13])]}
	${"New target: `1.0.0`"}                                   | ${[text("New target: ", [0, 12]), inlineCode("`1.0.0`", [12, 19])]}
	${"`fixup!` is the correct syntax"}                        | ${[inlineCode("`fixup!`", [0, 8]), text(" is the correct syntax", [8, 30])]}
	${"squash! `fixup!` is the correct syntax"}                | ${[squashMarker("squash! ", [0, 8]), inlineCode("`fixup!`", [8, 16]), text(" is the correct syntax", [16, 38])]}
	${"#440: Codename `GH-32`"}                                | ${[issueLink("#440: ", [0, 6]), text("Codename ", [6, 15]), inlineCode("`GH-32`", [15, 22])]}
	${"this looks related to `#92`"}                           | ${[text("this looks related to ", [0, 22]), inlineCode("`#92`", [22, 27])]}
	${'Revert "`Revert` "the malfunctioning coffee machine""'} | ${[revertMarker('Revert "', 1, [0, 8]), inlineCode("`Revert`", [8, 16]), text(' "the malfunctioning coffee machine"', [16, 52]), revertMarker('"', 0, [52, 53])]}
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
			expect(commit.subjectLine).toEqual([text(props.subjectLine, [0, props.subjectLine.length])])
		})
	},
)
