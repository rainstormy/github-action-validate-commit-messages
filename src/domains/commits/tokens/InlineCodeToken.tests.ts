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
import { whitespace } from "#commits/tokens/WhitespaceToken.ts"
import { word } from "#commits/tokens/WordToken.ts"
import { fakeTokenConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeTokenConfiguration()

describe.each`
	subjectLine                                         | expectedTokens
	${"``"}                                             | ${[inlineCode("``")]}
	${"`code`"}                                         | ${[inlineCode("`code`")]}
	${"Use `pnpm install` to get started"}              | ${[word("Use"), whitespace(" ", 3), inlineCode("`pnpm install`", 4), whitespace(" ", 18), word("to", 19), whitespace(" ", 21), word("get", 22), whitespace(" ", 25), word("started", 26)]}
	${"`git commit` is the command"}                    | ${[inlineCode("`git commit`"), whitespace(" ", 12), word("is", 13), whitespace(" ", 15), word("the", 16), whitespace(" ", 19), word("command", 20)]}
	${"Run the command `git status`"}                   | ${[word("Run"), whitespace(" ", 3), word("the", 4), whitespace(" ", 7), word("command", 8), whitespace(" ", 15), inlineCode("`git status`", 16)]}
	${"Run `this` and `that`"}                          | ${[word("Run"), whitespace(" ", 3), inlineCode("`this`", 4), whitespace(" ", 10), word("and", 11), whitespace(" ", 14), inlineCode("`that`", 15)]}
	${"Replace `a`, `b`, and `c`"}                      | ${[word("Replace"), whitespace(" ", 7), inlineCode("`a`", 8), punctuation(",", 11), whitespace(" ", 12), inlineCode("`b`", 13), punctuation(",", 16), whitespace(" ", 17), word("and", 18), whitespace(" ", 21), inlineCode("`c`", 22)]}
	${"`1``23``456`"}                                   | ${[inlineCode("`1`"), inlineCode("`23`", 3), inlineCode("`456`", 7)]}
	${"fixup! Use `pnpm install` to get started"}       | ${[squashMarker("fixup! "), word("Use", 7), whitespace(" ", 10), inlineCode("`pnpm install`", 11), whitespace(" ", 25), word("to", 26), whitespace(" ", 28), word("get", 29), whitespace(" ", 32), word("started", 33)]}
	${'Revert "Use `pnpm install` to get started"'}     | ${[revertMarker('Revert "', 1), word("Use", 8), whitespace(" ", 11), inlineCode("`pnpm install`", 12), whitespace(" ", 26), word("to", 27), whitespace(" ", 29), word("get", 30), whitespace(" ", 33), word("started", 34), revertMarker('"', 0, 41)]}
	${"Upgrade `react` from 18.3.1 to 19.2.0"}          | ${[word("Upgrade"), whitespace(" ", 7), inlineCode("`react`", 8), whitespace(" ", 15), word("from", 16), whitespace(" ", 20), dependencyVersion("18.3.1", 21), whitespace(" ", 27), word("to", 28), whitespace(" ", 30), dependencyVersion("19.2.0", 31)]}
	${"#42: Replace `<a>` with new `<Link>` component"} | ${[issueLink("#42: "), word("Replace", 5), whitespace(" ", 12), inlineCode("`<a>`", 13), whitespace(" ", 18), word("with", 19), whitespace(" ", 23), word("new", 24), whitespace(" ", 27), inlineCode("`<Link>`", 28), whitespace(" ", 36), word("component", 37)]}
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
	${"Closes `GL-2`"}                                         | ${[word("Closes"), whitespace(" ", 6), inlineCode("`GL-2`", 7)]}
	${"New target: `1.0.0`"}                                   | ${[word("New"), whitespace(" ", 3), word("target", 4), punctuation(":", 10), whitespace(" ", 11), inlineCode("`1.0.0`", 12)]}
	${"`fixup!` is the correct syntax"}                        | ${[inlineCode("`fixup!`"), whitespace(" ", 8), word("is", 9), whitespace(" ", 11), word("the", 12), whitespace(" ", 15), word("correct", 16), whitespace(" ", 23), word("syntax", 24)]}
	${"squash! `fixup!` is the correct syntax"}                | ${[squashMarker("squash! "), inlineCode("`fixup!`", 8), whitespace(" ", 16), word("is", 17), whitespace(" ", 19), word("the", 20), whitespace(" ", 23), word("correct", 24), whitespace(" ", 31), word("syntax", 32)]}
	${"#440: Codename `GH-32`"}                                | ${[issueLink("#440: "), word("Codename", 6), whitespace(" ", 14), inlineCode("`GH-32`", 15)]}
	${"this looks related to `#92`"}                           | ${[word("this"), whitespace(" ", 4), word("looks", 5), whitespace(" ", 10), word("related", 11), whitespace(" ", 18), word("to", 19), whitespace(" ", 21), inlineCode("`#92`", 22)]}
	${'Revert "`Revert` "the malfunctioning coffee machine""'} | ${[revertMarker('Revert "', 1), inlineCode("`Revert`", 8), whitespace(" ", 16), punctuation('"', 17), word("the", 18), whitespace(" ", 21), word("malfunctioning", 22), whitespace(" ", 36), word("coffee", 37), whitespace(" ", 43), word("machine", 44), punctuation('"', 51), revertMarker('"', 0, 52)]}
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
