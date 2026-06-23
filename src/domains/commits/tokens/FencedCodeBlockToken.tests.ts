import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { fencedCodeBlock } from "#commits/tokens/FencedCodeBlockToken.ts"
import { text } from "#commits/tokens/TextToken.ts"
import type { TokenisedLines } from "#commits/tokens/Token.ts"
import { trailer } from "#commits/tokens/TrailerToken.ts"
import { fakeTokenConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeTokenConfiguration()

describe.each`
	subjectLine                                  | body                                                                                                                                                     | expectedBodyLines
	${"Teach the parser to carry tiny snippets"} | ${'The recipe starts here.\n```js\nconst snack = "waffle"\nconsole.log(snack)\n```\nAnd then the prose comes back.'}                                     | ${[[text("The recipe starts here.")], [fencedCodeBlock("```js")], [fencedCodeBlock('const snack = "waffle"')], [fencedCodeBlock("console.log(snack)")], [fencedCodeBlock("```")], [text("And then the prose comes back.")]]}
	${"let the empty block breathe"}             | ${"Before\n```\n```\nAfter"}                                                                                                                             | ${[[text("Before")], [fencedCodeBlock("```")], [fencedCodeBlock("```")], [text("After")]]}
	${"Keep code that smells like trailers"}     | ${"```\nRefs: #404\nBREAKING CHANGE: the toaster learned sarcasm\n```\nSigned-off-by: Master Splinter <sensei@ninja-academy.com>"}                       | ${[[fencedCodeBlock("```")], [fencedCodeBlock("Refs: #404")], [fencedCodeBlock("BREAKING CHANGE: the toaster learned sarcasm")], [fencedCodeBlock("```")], [trailer("Signed-off-by: ", "Master Splinter <sensei@ninja-academy.com>")]]}
	${"Tokenise two separate code postcards"}    | ${"```ts\nconst first = true\n```\nMiddle words.\n```sh\necho second\n```"}                                                                              | ${[[fencedCodeBlock("```ts")], [fencedCodeBlock("const first = true")], [fencedCodeBlock("```")], [text("Middle words.")], [fencedCodeBlock("```sh")], [fencedCodeBlock("echo second")], [fencedCodeBlock("```")]]}
	${"unclosed note fenced"}                    | ${'Intro\n```json\n{ "verified": false }\nRefs: #9001'}                                                                                                  | ${[[text("Intro")], [fencedCodeBlock("```json")], [fencedCodeBlock('{ "verified": false }')], [fencedCodeBlock("Refs: #9001")]]}
	${"install the ceremonial shell helpers"}    | ${'```shell\npnpm add @rainstormy/comet-sprinkles --save-dev\npnpm exec comet --mode="committee-approved"\n```'}                                         | ${[[fencedCodeBlock("```shell")], [fencedCodeBlock("pnpm add @rainstormy/comet-sprinkles --save-dev")], [fencedCodeBlock('pnpm exec comet --mode="committee-approved"')], [fencedCodeBlock("```")]]}
	${"One long release breadcrumb"}             | ${'```shell\ncurl -L https://example.com/releases/2026/quietly-dramatic/checksums/commit-message-linter.tar.gz\nprintf "deploy window: 03:14 UTC"\n```'} | ${[[fencedCodeBlock("```shell")], [fencedCodeBlock("curl -L https://example.com/releases/2026/quietly-dramatic/checksums/commit-message-linter.tar.gz")], [fencedCodeBlock('printf "deploy window: 03:14 UTC"')], [fencedCodeBlock("```")]]}
	${"no tokenised links inside text fences"}   | ${"```text\nhttps://status.example.com/incidents/2026/06/14/linting-pipeline-refused-to-wear-a-tie?component=commit-body&severity=medium\n```"}          | ${[[fencedCodeBlock("```text")], [fencedCodeBlock("https://status.example.com/incidents/2026/06/14/linting-pipeline-refused-to-wear-a-tie?component=commit-body&severity=medium")], [fencedCodeBlock("```")]]}
`(
	"when the commit message of $body contains triple-backtick fenced code blocks",
	(props: { subjectLine: string; body: string; expectedBodyLines: TokenisedLines }) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual([text(props.subjectLine)])
		})

		it("extracts fenced code block tokens in the message body", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual(props.expectedBodyLines)
		})
	},
)

describe.each`
	subjectLine                                     | body                                                                                                                                                                                                                                    | expectedBodyLines
	${"nested fences inside bigger fences"}         | ${"````markdown\n```ts\nconst nested = true\n```\n````\nBack to ordinary markdown."}                                                                                                                                                    | ${[[fencedCodeBlock("````markdown")], [fencedCodeBlock("```ts")], [fencedCodeBlock("const nested = true")], [fencedCodeBlock("```")], [fencedCodeBlock("````")], [text("Back to ordinary markdown.")]]}
	${"Keep triple ticks boring inside four ticks"} | ${"````\n```\nRefs: #111\n```\n````\nReviewed-by: Clipboard Captain <clip@example.com>"}                                                                                                                                                | ${[[fencedCodeBlock("````")], [fencedCodeBlock("```")], [fencedCodeBlock("Refs: #111")], [fencedCodeBlock("```")], [fencedCodeBlock("````")], [trailer("Reviewed-by: ", "Clipboard Captain <clip@example.com>")]]}
	${"Close a tiny fence with a bigger one"}       | ${'```\nconst cake = "tiny"\n````\nRegular: not a trailer because prose follows\nstill regular'}                                                                                                                                        | ${[[fencedCodeBlock("```")], [fencedCodeBlock('const cake = "tiny"')], [fencedCodeBlock("````")], [text("Regular: not a trailer because prose follows")], [text("still regular")]]}
	${"calm heredocs around nested fences"}         | ${"````shell\ncat <<EOF > README.md\n```shell\npnpm add imaginary-updraft --filter ./packages/comet\nEOF\n````"}                                                                                                                        | ${[[fencedCodeBlock("````shell")], [fencedCodeBlock("cat <<EOF > README.md")], [fencedCodeBlock("```shell")], [fencedCodeBlock("pnpm add imaginary-updraft --filter ./packages/comet")], [fencedCodeBlock("EOF")], [fencedCodeBlock("````")]]}
	${"Archived the documentation breadcrumb"}      | ${'````markdown\n[release ledger](https://docs.example.com/products/comet/releases/2026/06/fenced-code-block-tokeniser?view=full&section=body-lines)\n```json\n{ "nested": true, "reason": "documentation copied itself" }\n```\n````'} | ${[[fencedCodeBlock("````markdown")], [fencedCodeBlock("[release ledger](https://docs.example.com/products/comet/releases/2026/06/fenced-code-block-tokeniser?view=full&section=body-lines)")], [fencedCodeBlock("```json")], [fencedCodeBlock('{ "nested": true, "reason": "documentation copied itself" }')], [fencedCodeBlock("```")], [fencedCodeBlock("````")]]}
`(
	"when the commit message of $body contains quadruple-backtick fenced code blocks",
	(props: { subjectLine: string; body: string; expectedBodyLines: TokenisedLines }) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual([text(props.subjectLine)])
		})

		it("extracts fenced code block tokens in the message body", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual(props.expectedBodyLines)
		})
	},
)

describe.each`
	subjectLine                                   | body                                                                                                            | expectedBodyLines
	${"indented triple fences"}                   | ${"  ```ts\nconst outside = true\n ```"}                                                                        | ${[[text("  ```ts")], [text("const outside = true")], [text(" ```")]]}
	${"indented quadruple fences"}                | ${" ````markdown\n ```shell\npnpm add pretend-package\n ````"}                                                  | ${[[text(" ````markdown")], [text(" ```shell")], [text("pnpm add pretend-package")], [text(" ````")]]}
	${"Inline backticks is plain prose"}          | ${"This mentions ``` without starting at the beginning.\nAnd this line stays normal as well."}                  | ${[[text("This mentions ``` without starting at the beginning.")], [text("And this line stays normal as well.")]]}
	${"same goes for inline quadruple backticks"} | ${"The note says ````markdown halfway through the sentence.\nEven https://example.com/````/notes stays plain."} | ${[[text("The note says ````markdown halfway through the sentence.")], [text("Even https://example.com/````/notes stays plain.")]]}
	${"Ignore fences after impatient prefixes"}   | ${"prefix ```shell\nprefix ````markdown\ntext before ``` and text before ````"}                                 | ${[[text("prefix ```shell")], [text("prefix ````markdown")], [text("text before ``` and text before ````")]]}
`(
	"when the commit message of $body contains backticks that do not begin a fenced code block",
	(props: { subjectLine: string; body: string; expectedBodyLines: TokenisedLines }) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual([text(props.subjectLine)])
		})

		it("leaves ordinary body lines unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual(props.expectedBodyLines)
		})
	},
)
