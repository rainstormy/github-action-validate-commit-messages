import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { dependencyVersion } from "#commits/tokens/DependencyVersionToken.ts"
import { inlineCode } from "#commits/tokens/InlineCodeToken.ts"
import { issueLink } from "#commits/tokens/IssueLinkToken.ts"
import { punctuation } from "#commits/tokens/PunctuationToken.ts"
import { revertMarker } from "#commits/tokens/RevertMarkerToken.ts"
import { squashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import { type TokenisedLine, tokenisePlainText } from "#commits/tokens/Token.ts"
import { space } from "#commits/tokens/WhitespaceToken.ts"
import { word } from "#commits/tokens/WordToken.ts"
import { fakeTokenConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeTokenConfiguration()

describe.each`
	subjectLine                                         | expectedTokens
	${"``"}                                             | ${[inlineCode("``")]}
	${"`code`"}                                         | ${[inlineCode("`code`")]}
	${"Use `pnpm install` to get started"}              | ${[word("Use"), space(3), inlineCode("`pnpm install`", 4), space(18), word("to", 19), space(21), word("get", 22), space(25), word("started", 26)]}
	${"`git commit` is the command"}                    | ${[inlineCode("`git commit`"), space(12), word("is", 13), space(15), word("the", 16), space(19), word("command", 20)]}
	${"Run the command `git status`"}                   | ${[word("Run"), space(3), word("the", 4), space(7), word("command", 8), space(15), inlineCode("`git status`", 16)]}
	${"Run `this` and `that`"}                          | ${[word("Run"), space(3), inlineCode("`this`", 4), space(10), word("and", 11), space(14), inlineCode("`that`", 15)]}
	${"Replace `a`, `b`, and `c`"}                      | ${[word("Replace"), space(7), inlineCode("`a`", 8), punctuation(",", 11), space(12), inlineCode("`b`", 13), punctuation(",", 16), space(17), word("and", 18), space(21), inlineCode("`c`", 22)]}
	${"`1``23``456`"}                                   | ${[inlineCode("`1`"), inlineCode("`23`", 3), inlineCode("`456`", 7)]}
	${"fixup! Use `pnpm install` to get started"}       | ${[squashMarker("fixup!"), space(6), word("Use", 7), space(10), inlineCode("`pnpm install`", 11), space(25), word("to", 26), space(28), word("get", 29), space(32), word("started", 33)]}
	${'Revert "Use `pnpm install` to get started"'}     | ${[revertMarker("Revert"), space(6), punctuation('"', 7), word("Use", 8), space(11), inlineCode("`pnpm install`", 12), space(26), word("to", 27), space(29), word("get", 30), space(33), word("started", 34), punctuation('"', 41)]}
	${"Upgrade `react` from 18.3.1 to 19.2.0"}          | ${[word("Upgrade"), space(7), inlineCode("`react`", 8), space(15), word("from", 16), space(20), dependencyVersion("18.3.1", 21), space(27), word("to", 28), space(30), dependencyVersion("19.2.0", 31)]}
	${"#42: Replace `<a>` with new `<Link>` component"} | ${[issueLink("#42:"), space(4), word("Replace", 5), space(12), inlineCode("`<a>`", 13), space(18), word("with", 19), space(23), word("new", 24), space(27), inlineCode("`<Link>`", 28), space(36), word("component", 37)]}
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
	${"Closes `GL-2`"}                                         | ${[word("Closes"), space(6), inlineCode("`GL-2`", 7)]}
	${"New target: `1.0.0`"}                                   | ${[word("New"), space(3), word("target", 4), punctuation(":", 10), space(11), inlineCode("`1.0.0`", 12)]}
	${"`fixup!` is the correct syntax"}                        | ${[inlineCode("`fixup!`"), space(8), word("is", 9), space(11), word("the", 12), space(15), word("correct", 16), space(23), word("syntax", 24)]}
	${"squash! `fixup!` is the correct syntax"}                | ${[squashMarker("squash!"), space(7), inlineCode("`fixup!`", 8), space(16), word("is", 17), space(19), word("the", 20), space(23), word("correct", 24), space(31), word("syntax", 32)]}
	${"#440: Codename `GH-32`"}                                | ${[issueLink("#440:"), space(5), word("Codename", 6), space(14), inlineCode("`GH-32`", 15)]}
	${"this looks related to `#92`"}                           | ${[word("this"), space(4), word("looks", 5), space(10), word("related", 11), space(18), word("to", 19), space(21), inlineCode("`#92`", 22)]}
	${'Revert "`Revert` "the malfunctioning coffee machine""'} | ${[revertMarker("Revert"), space(6), punctuation('"', 7), inlineCode("`Revert`", 8), space(16), punctuation('"', 17), word("the", 18), space(21), word("malfunctioning", 22), space(36), word("coffee", 37), space(43), word("machine", 44), punctuation('""', 51)]}
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
			expect(commit.subjectLine).toEqual(tokenisePlainText(props.subjectLine))
		})
	},
)
