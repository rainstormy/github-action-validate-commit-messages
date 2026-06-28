import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { fencedCodeBlock } from "#commits/tokens/FencedCodeBlockToken.ts"
import { punctuation } from "#commits/tokens/PunctuationToken.ts"
import { type TokenisedLines, tokenisePlainText } from "#commits/tokens/Token.ts"
import { trailer } from "#commits/tokens/TrailerToken.ts"
import { space, whitespace } from "#commits/tokens/WhitespaceToken.ts"
import { word } from "#commits/tokens/WordToken.ts"
import { fakeTokenConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeTokenConfiguration()

describe.each`
	subjectLine                                  | body                                                                                                                                                     | expectedBodyLines
	${"Teach the parser to carry tiny snippets"} | ${'The recipe starts here.\n```js\nconst snack = "waffle"\nconsole.log(snack)\n```\nAnd then the prose comes back.'}                                     | ${[[word("The"), space(3), word("recipe", 4), space(10), word("starts", 11), space(17), word("here", 18), punctuation(".", 22)], [fencedCodeBlock("```js")], [fencedCodeBlock('const snack = "waffle"')], [fencedCodeBlock("console.log(snack)")], [fencedCodeBlock("```")], [word("And"), space(3), word("then", 4), space(8), word("the", 9), space(12), word("prose", 13), space(18), word("comes", 19), space(24), word("back", 25), punctuation(".", 29)]]}
	${"let the empty block breathe"}             | ${"Before\n```\n```\nAfter"}                                                                                                                             | ${[[word("Before")], [fencedCodeBlock("```")], [fencedCodeBlock("```")], [word("After")]]}
	${"Keep code that smells like trailers"}     | ${"```\nRefs: #404\nBREAKING CHANGE: the toaster learned sarcasm\n```\nSigned-off-by: Master Splinter <sensei@ninja-academy.com>"}                       | ${[[fencedCodeBlock("```")], [fencedCodeBlock("Refs: #404")], [fencedCodeBlock("BREAKING CHANGE: the toaster learned sarcasm")], [fencedCodeBlock("```")], trailer("Signed-off-by: ", "Master Splinter <sensei@ninja-academy.com>")]}
	${"Tokenise two separate code postcards"}    | ${"```ts\nconst first = true\n```\nMiddle words.\n```sh\necho second\n```"}                                                                              | ${[[fencedCodeBlock("```ts")], [fencedCodeBlock("const first = true")], [fencedCodeBlock("```")], [word("Middle"), space(6), word("words", 7), punctuation(".", 12)], [fencedCodeBlock("```sh")], [fencedCodeBlock("echo second")], [fencedCodeBlock("```")]]}
	${"unclosed note fenced"}                    | ${'Intro\n```json\n{ "verified": false }\nRefs: #9001'}                                                                                                  | ${[[word("Intro")], [fencedCodeBlock("```json")], [fencedCodeBlock('{ "verified": false }')], [fencedCodeBlock("Refs: #9001")]]}
	${"install the ceremonial shell helpers"}    | ${'```shell\npnpm add @rainstormy/comet-sprinkles --save-dev\npnpm exec comet --mode="committee-approved"\n```'}                                         | ${[[fencedCodeBlock("```shell")], [fencedCodeBlock("pnpm add @rainstormy/comet-sprinkles --save-dev")], [fencedCodeBlock('pnpm exec comet --mode="committee-approved"')], [fencedCodeBlock("```")]]}
	${"One long release breadcrumb"}             | ${'```shell\ncurl -L https://example.com/releases/2026/quietly-dramatic/checksums/commit-message-linter.tar.gz\nprintf "deploy window: 03:14 UTC"\n```'} | ${[[fencedCodeBlock("```shell")], [fencedCodeBlock("curl -L https://example.com/releases/2026/quietly-dramatic/checksums/commit-message-linter.tar.gz")], [fencedCodeBlock('printf "deploy window: 03:14 UTC"')], [fencedCodeBlock("```")]]}
	${"no tokenised links inside text fences"}   | ${"```text\nhttps://status.example.com/incidents/2026/06/14/linting-pipeline-refused-to-wear-a-tie?component=commit-body&severity=medium\n```"}          | ${[[fencedCodeBlock("```text")], [fencedCodeBlock("https://status.example.com/incidents/2026/06/14/linting-pipeline-refused-to-wear-a-tie?component=commit-body&severity=medium")], [fencedCodeBlock("```")]]}
`(
	"when the commit message of $body contains triple-backtick fenced code blocks",
	(props: { subjectLine: string; body: string; expectedBodyLines: TokenisedLines }) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(tokenisePlainText(props.subjectLine))
		})

		it("extracts fenced code block tokens in the message body", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual(props.expectedBodyLines)
		})
	},
)

describe.each`
	subjectLine                                     | body                                                                                                                                                                                                                                    | expectedBodyLines
	${"nested fences inside bigger fences"}         | ${"````markdown\n```ts\nconst nested = true\n```\n````\nBack to ordinary markdown."}                                                                                                                                                    | ${[[fencedCodeBlock("````markdown")], [fencedCodeBlock("```ts")], [fencedCodeBlock("const nested = true")], [fencedCodeBlock("```")], [fencedCodeBlock("````")], [word("Back"), space(4), word("to", 5), space(7), word("ordinary", 8), space(16), word("markdown", 17), punctuation(".", 25)]]}
	${"Keep triple ticks boring inside four ticks"} | ${"````\n```\nRefs: #111\n```\n````\nReviewed-by: Clipboard Captain <clip@example.com>"}                                                                                                                                                | ${[[fencedCodeBlock("````")], [fencedCodeBlock("```")], [fencedCodeBlock("Refs: #111")], [fencedCodeBlock("```")], [fencedCodeBlock("````")], trailer("Reviewed-by: ", "Clipboard Captain <clip@example.com>")]}
	${"Close a tiny fence with a bigger one"}       | ${'```\nconst cake = "tiny"\n````\nRegular: not a trailer because prose follows\nstill regular'}                                                                                                                                        | ${[[fencedCodeBlock("```")], [fencedCodeBlock('const cake = "tiny"')], [fencedCodeBlock("````")], [word("Regular"), punctuation(":", 7), space(8), word("not", 9), space(12), word("a", 13), space(14), word("trailer", 15), space(22), word("because", 23), space(30), word("prose", 31), space(36), word("follows", 37)], [word("still"), space(5), word("regular", 6)]]}
	${"calm heredocs around nested fences"}         | ${"````shell\ncat <<EOF > README.md\n```shell\npnpm add imaginary-updraft --filter ./packages/comet\nEOF\n````"}                                                                                                                        | ${[[fencedCodeBlock("````shell")], [fencedCodeBlock("cat <<EOF > README.md")], [fencedCodeBlock("```shell")], [fencedCodeBlock("pnpm add imaginary-updraft --filter ./packages/comet")], [fencedCodeBlock("EOF")], [fencedCodeBlock("````")]]}
	${"Archived the documentation breadcrumb"}      | ${'````markdown\n[release ledger](https://docs.example.com/products/comet/releases/2026/06/fenced-code-block-tokeniser?view=full&section=body-lines)\n```json\n{ "nested": true, "reason": "documentation copied itself" }\n```\n````'} | ${[[fencedCodeBlock("````markdown")], [fencedCodeBlock("[release ledger](https://docs.example.com/products/comet/releases/2026/06/fenced-code-block-tokeniser?view=full&section=body-lines)")], [fencedCodeBlock("```json")], [fencedCodeBlock('{ "nested": true, "reason": "documentation copied itself" }')], [fencedCodeBlock("```")], [fencedCodeBlock("````")]]}
`(
	"when the commit message of $body contains quadruple-backtick fenced code blocks",
	(props: { subjectLine: string; body: string; expectedBodyLines: TokenisedLines }) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(tokenisePlainText(props.subjectLine))
		})

		it("extracts fenced code block tokens in the message body", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual(props.expectedBodyLines)
		})
	},
)

describe.each`
	subjectLine                                   | body                                                                                                            | expectedBodyLines
	${"indented triple fences"}                   | ${"  ```ts\nconst outside = true\n ```"}                                                                        | ${[[whitespace("  "), punctuation("```", 2), word("ts", 5)], [word("const"), space(5), word("outside", 6), space(13), punctuation("=", 14), space(15), word("true", 16)], [space(), punctuation("```", 1)]]}
	${"indented quadruple fences"}                | ${" ````markdown\n ```shell\npnpm add pretend-package\n ````"}                                                  | ${[[space(), punctuation("````", 1), word("markdown", 5)], [space(), punctuation("```", 1), word("shell", 4)], [word("pnpm"), space(4), word("add", 5), space(8), word("pretend-package", 9)], [space(), punctuation("````", 1)]]}
	${"Inline backticks is plain prose"}          | ${"This mentions ``` without starting at the beginning.\nAnd this line stays normal as well."}                  | ${[[word("This"), space(4), word("mentions", 5), space(13), punctuation("```", 14), space(17), word("without", 18), space(25), word("starting", 26), space(34), word("at", 35), space(37), word("the", 38), space(41), word("beginning", 42), punctuation(".", 51)], [word("And"), space(3), word("this", 4), space(8), word("line", 9), space(13), word("stays", 14), space(19), word("normal", 20), space(26), word("as", 27), space(29), word("well", 30), punctuation(".", 34)]]}
	${"same goes for inline quadruple backticks"} | ${"The note says ````markdown halfway through the sentence.\nEven https://example.com/````/notes stays plain."} | ${[[word("The"), space(3), word("note", 4), space(8), word("says", 9), space(13), punctuation("````", 14), word("markdown", 18), space(26), word("halfway", 27), space(34), word("through", 35), space(42), word("the", 43), space(46), word("sentence", 47), punctuation(".", 55)], [word("Even"), space(4), word("https", 5), punctuation("://", 10), word("example", 13), punctuation(".", 20), word("com", 21), punctuation("/````/", 24), word("notes", 30), space(35), word("stays", 36), space(41), word("plain", 42), punctuation(".", 47)]]}
	${"Ignore fences after impatient prefixes"}   | ${"prefix ```shell\nprefix ````markdown\ntext before ``` and text before ````"}                                 | ${[[word("prefix"), space(6), punctuation("```", 7), word("shell", 10)], [word("prefix"), space(6), punctuation("````", 7), word("markdown", 11)], [word("text"), space(4), word("before", 5), space(11), punctuation("```", 12), space(15), word("and", 16), space(19), word("text", 20), space(24), word("before", 25), space(31), punctuation("````", 32)]]}
`(
	"when the commit message of $body contains backticks that do not begin a fenced code block",
	(props: { subjectLine: string; body: string; expectedBodyLines: TokenisedLines }) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(tokenisePlainText(props.subjectLine))
		})

		it("leaves ordinary body lines unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual(props.expectedBodyLines)
		})
	},
)
