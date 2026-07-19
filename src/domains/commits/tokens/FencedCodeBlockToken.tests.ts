import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import {
	type Tokens,
	codeblock,
	punctuation,
	space,
	trailerkey,
	word,
} from "#commits/tokens/Token.ts"
import { fakeTokenConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeTokenConfiguration()

describe.each`
	subjectLine                                  | body                                                                                                                                                     | expectedBodyLines
	${"Teach the parser to carry tiny snippets"} | ${'The recipe starts here.\n```js\nconst snack = "waffle"\nconsole.log(snack)\n```\nAnd then the prose comes back.'}                                     | ${[[word("The"), space(3), word("recipe", 4), space(10), word("starts", 11), space(17), word("here", 18), punctuation(".", 22)], [codeblock("```js")], [codeblock('const snack = "waffle"')], [codeblock("console.log(snack)")], [codeblock("```")], [word("And"), space(3), word("then", 4), space(8), word("the", 9), space(12), word("prose", 13), space(18), word("comes", 19), space(24), word("back", 25), punctuation(".", 29)]]}
	${"let the empty block breathe"}             | ${"Before\n```\n```\nAfter"}                                                                                                                             | ${[[word("Before")], [codeblock("```")], [codeblock("```")], [word("After")]]}
	${"Keep code that smells like trailerkeys"}  | ${"```\nRefs: #404\nBREAKING CHANGE: the toaster learned sarcasm\n```\nSigned-off-by: Master Splinter <sensei@ninja-academy.com>"}                       | ${[[codeblock("```")], [codeblock("Refs: #404")], [codeblock("BREAKING CHANGE: the toaster learned sarcasm")], [codeblock("```")], [trailerkey("Signed-off-by"), punctuation(":", 13), space(14), word("Master", 15), space(21), word("Splinter", 22), space(30), punctuation("<", 31), word("sensei", 32), punctuation("@", 38), word("ninja-academy", 39), punctuation(".", 52), word("com", 53), punctuation(">", 56)]]}
	${"Tokenise two separate code postcards"}    | ${"```ts\nconst first = true\n```\nMiddle words.\n```sh\necho second\n```"}                                                                              | ${[[codeblock("```ts")], [codeblock("const first = true")], [codeblock("```")], [word("Middle"), space(6), word("words", 7), punctuation(".", 12)], [codeblock("```sh")], [codeblock("echo second")], [codeblock("```")]]}
	${"unclosed note fenced"}                    | ${'Intro\n```json\n{ "verified": false }\nRefs: #9001'}                                                                                                  | ${[[word("Intro")], [codeblock("```json")], [codeblock('{ "verified": false }')], [codeblock("Refs: #9001")]]}
	${"install the ceremonial shell helpers"}    | ${'```shell\npnpm add @rainstormy/comet-sprinkles --save-dev\npnpm exec comet --mode="committee-approved"\n```'}                                         | ${[[codeblock("```shell")], [codeblock("pnpm add @rainstormy/comet-sprinkles --save-dev")], [codeblock('pnpm exec comet --mode="committee-approved"')], [codeblock("```")]]}
	${"One long release breadcrumb"}             | ${'```shell\ncurl -L https://example.com/releases/2026/quietly-dramatic/checksums/commit-message-linter.tar.gz\nprintf "deploy window: 03:14 UTC"\n```'} | ${[[codeblock("```shell")], [codeblock("curl -L https://example.com/releases/2026/quietly-dramatic/checksums/commit-message-linter.tar.gz")], [codeblock('printf "deploy window: 03:14 UTC"')], [codeblock("```")]]}
	${"no tokenised links inside text fences"}   | ${"```text\nhttps://status.example.com/incidents/2026/06/14/linting-pipeline-refused-to-wear-a-tie?component=commit-body&severity=medium\n```"}          | ${[[codeblock("```text")], [codeblock("https://status.example.com/incidents/2026/06/14/linting-pipeline-refused-to-wear-a-tie?component=commit-body&severity=medium")], [codeblock("```")]]}
	${"Close a tiny fence with a bigger one"}    | ${'```\nconst cake = "tiny"\n````\nstill-open: not a trailerkey because fence was not closed properly\nand more prose follows'}                          | ${[[codeblock("```")], [codeblock('const cake = "tiny"')], [codeblock("````")], [codeblock("still-open: not a trailerkey because fence was not closed properly")], [codeblock("and more prose follows")]]}
`(
	"when the commit message of $body contains triple-backtick fenced code blocks",
	(props: { subjectLine: string; body: string; expectedBodyLines: Array<Tokens> }) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("does not extract any codeblock tokens in the subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).not.toContainToken("codeblock")
		})

		it("extracts codeblock tokens in the message body", () => {
			expect(props.expectedBodyLines).toContainToken("codeblock")

			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual(props.expectedBodyLines)
		})
	},
)

describe.each`
	subjectLine                                     | body                                                                                                                                                                                                                                    | expectedBodyLines
	${"nested fences inside bigger fences"}         | ${"````markdown\n```ts\nconst nested = true\n```\n````\nBack to ordinary markdown."}                                                                                                                                                    | ${[[codeblock("````markdown")], [codeblock("```ts")], [codeblock("const nested = true")], [codeblock("```")], [codeblock("````")], [word("Back"), space(4), word("to", 5), space(7), word("ordinary", 8), space(16), word("markdown", 17), punctuation(".", 25)]]}
	${"Keep triple ticks boring inside four ticks"} | ${"````\n```\nRefs: #111\n```\n````\nReviewed-by: Clipboard Captain <clip@example.com>"}                                                                                                                                                | ${[[codeblock("````")], [codeblock("```")], [codeblock("Refs: #111")], [codeblock("```")], [codeblock("````")], [trailerkey("Reviewed-by"), punctuation(":", 11), space(12), word("Clipboard", 13), space(22), word("Captain", 23), space(30), punctuation("<", 31), word("clip", 32), punctuation("@", 36), word("example", 37), punctuation(".", 44), word("com", 45), punctuation(">", 48)]]}
	${"calm heredocs around nested fences"}         | ${"````shell\ncat <<EOF > README.md\n```shell\npnpm add imaginary-updraft --filter ./packages/comet\nEOF\n````"}                                                                                                                        | ${[[codeblock("````shell")], [codeblock("cat <<EOF > README.md")], [codeblock("```shell")], [codeblock("pnpm add imaginary-updraft --filter ./packages/comet")], [codeblock("EOF")], [codeblock("````")]]}
	${"Archived the documentation breadcrumb"}      | ${'````markdown\n[release ledger](https://docs.example.com/products/comet/releases/2026/06/fenced-code-block-tokeniser?view=full&section=body-lines)\n```json\n{ "nested": true, "reason": "documentation copied itself" }\n```\n````'} | ${[[codeblock("````markdown")], [codeblock("[release ledger](https://docs.example.com/products/comet/releases/2026/06/fenced-code-block-tokeniser?view=full&section=body-lines)")], [codeblock("```json")], [codeblock('{ "nested": true, "reason": "documentation copied itself" }')], [codeblock("```")], [codeblock("````")]]}
`(
	"when the commit message of $body contains quadruple-backtick fenced code blocks",
	(props: { subjectLine: string; body: string; expectedBodyLines: Array<Tokens> }) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("does not extract any codeblock tokens in the subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).not.toContainToken("codeblock")
		})

		it("extracts codeblock tokens in the message body", () => {
			expect(props.expectedBodyLines).toContainToken("codeblock")

			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual(props.expectedBodyLines)
		})
	},
)

describe.each`
	subjectLine                                   | body
	${"indented triple fences"}                   | ${"  ```ts\nconst outside = true\n ```"}
	${"indented quadruple fences"}                | ${" ````markdown\n ```shell\npnpm add pretend-package\n ````"}
	${"Inline backticks is plain prose"}          | ${"This mentions ``` without starting at the beginning.\nAnd this line stays normal as well."}
	${"same goes for inline quadruple backticks"} | ${"The note says ````markdown halfway through the sentence.\nEven https://example.com/````/notes stays plain."}
	${"Ignore fences after impatient prefixes"}   | ${"prefix ```shell\nprefix ````markdown\ntext before ``` and text before ````"}
`(
	"when the commit message of $body contains backticks that do not begin a fenced code block",
	(props: { subjectLine: string; body: string; expectedBodyLines: Array<Tokens> }) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("does not extract any codeblock tokens in the subject line", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).not.toContainToken("codeblock")
		})

		it("does not extract any codeblock tokens in the message body", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).not.toContainToken("codeblock")
		})
	},
)
