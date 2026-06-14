import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { fencedCodeBlock } from "#commits/tokens/FencedCodeBlockToken.ts"
import { rawText } from "#commits/tokens/TextToken.ts"
import type { TokenisedLines } from "#commits/tokens/Token.ts"
import { trailer } from "#commits/tokens/TrailerToken.ts"
import { fakeTokenConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeTokenConfiguration()

describe.each`
	subjectLine                                  | body                                                                                                                                                     | expectedBodyLines
	${"Teach the parser to carry tiny snippets"} | ${'The recipe starts here.\n```js\nconst snack = "waffle"\nconsole.log(snack)\n```\nAnd then the prose comes back.'}                                     | ${[[rawText("The recipe starts here.")], [fencedCodeBlock("```js", [0, 5])], [fencedCodeBlock('const snack = "waffle"', [0, 22])], [fencedCodeBlock("console.log(snack)", [0, 18])], [fencedCodeBlock("```", [0, 3])], [rawText("And then the prose comes back.")]]}
	${"let the empty block breathe"}             | ${"Before\n```\n```\nAfter"}                                                                                                                             | ${[[rawText("Before")], [fencedCodeBlock("```", [0, 3])], [fencedCodeBlock("```", [0, 3])], [rawText("After")]]}
	${"Keep code that smells like trailers"}     | ${"```\nRefs: #404\nBREAKING CHANGE: the toaster learned sarcasm\n```\nSigned-off-by: Master Splinter <sensei@ninja-academy.com>"}                       | ${[[fencedCodeBlock("```", [0, 3])], [fencedCodeBlock("Refs: #404", [0, 10])], [fencedCodeBlock("BREAKING CHANGE: the toaster learned sarcasm", [0, 44])], [fencedCodeBlock("```", [0, 3])], [trailer("Signed-off-by: ", "Master Splinter <sensei@ninja-academy.com>", [0, 57])]]}
	${"Tokenise two separate code postcards"}    | ${"```ts\nconst first = true\n```\nMiddle words.\n```sh\necho second\n```"}                                                                              | ${[[fencedCodeBlock("```ts", [0, 5])], [fencedCodeBlock("const first = true", [0, 18])], [fencedCodeBlock("```", [0, 3])], [rawText("Middle words.")], [fencedCodeBlock("```sh", [0, 5])], [fencedCodeBlock("echo second", [0, 11])], [fencedCodeBlock("```", [0, 3])]]}
	${"unclosed note fenced"}                    | ${'Intro\n```json\n{ "verified": false }\nRefs: #9001'}                                                                                                  | ${[[rawText("Intro")], [fencedCodeBlock("```json", [0, 7])], [fencedCodeBlock('{ "verified": false }', [0, 21])], [fencedCodeBlock("Refs: #9001", [0, 11])]]}
	${"install the ceremonial shell helpers"}    | ${'```shell\npnpm add @rainstormy/comet-sprinkles --save-dev\npnpm exec comet --mode="committee-approved"\n```'}                                         | ${[[fencedCodeBlock("```shell", [0, 8])], [fencedCodeBlock("pnpm add @rainstormy/comet-sprinkles --save-dev", [0, 47])], [fencedCodeBlock('pnpm exec comet --mode="committee-approved"', [0, 43])], [fencedCodeBlock("```", [0, 3])]]}
	${"One long release breadcrumb"}             | ${'```shell\ncurl -L https://example.com/releases/2026/quietly-dramatic/checksums/commit-message-linter.tar.gz\nprintf "deploy window: 03:14 UTC"\n```'} | ${[[fencedCodeBlock("```shell", [0, 8])], [fencedCodeBlock("curl -L https://example.com/releases/2026/quietly-dramatic/checksums/commit-message-linter.tar.gz", [0, 97])], [fencedCodeBlock('printf "deploy window: 03:14 UTC"', [0, 33])], [fencedCodeBlock("```", [0, 3])]]}
	${"no tokenised links inside text fences"}   | ${"```text\nhttps://status.example.com/incidents/2026/06/14/linting-pipeline-refused-to-wear-a-tie?component=commit-body&severity=medium\n```"}          | ${[[fencedCodeBlock("```text", [0, 7])], [fencedCodeBlock("https://status.example.com/incidents/2026/06/14/linting-pipeline-refused-to-wear-a-tie?component=commit-body&severity=medium", [0, 124])], [fencedCodeBlock("```", [0, 3])]]}
`(
	"when the commit message of $body contains triple-backtick fenced code blocks",
	(props: { subjectLine: string; body: string; expectedBodyLines: TokenisedLines }) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual([rawText(props.subjectLine)])
		})

		it("extracts fenced code block tokens in the message body", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual(props.expectedBodyLines)
		})
	},
)

describe.each`
	subjectLine                                     | body                                                                                                                                                                                                                                    | expectedBodyLines
	${"nested fences inside bigger fences"}         | ${"````markdown\n```ts\nconst nested = true\n```\n````\nBack to ordinary markdown."}                                                                                                                                                    | ${[[fencedCodeBlock("````markdown", [0, 12])], [fencedCodeBlock("```ts", [0, 5])], [fencedCodeBlock("const nested = true", [0, 19])], [fencedCodeBlock("```", [0, 3])], [fencedCodeBlock("````", [0, 4])], [rawText("Back to ordinary markdown.")]]}
	${"Keep triple ticks boring inside four ticks"} | ${"````\n```\nRefs: #111\n```\n````\nReviewed-by: Clipboard Captain <clip@example.com>"}                                                                                                                                                | ${[[fencedCodeBlock("````", [0, 4])], [fencedCodeBlock("```", [0, 3])], [fencedCodeBlock("Refs: #111", [0, 10])], [fencedCodeBlock("```", [0, 3])], [fencedCodeBlock("````", [0, 4])], [trailer("Reviewed-by: ", "Clipboard Captain <clip@example.com>", [0, 49])]]}
	${"Close a tiny fence with a bigger one"}       | ${'```\nconst cake = "tiny"\n````\nRegular: not a trailer because prose follows\nstill regular'}                                                                                                                                        | ${[[fencedCodeBlock("```", [0, 3])], [fencedCodeBlock('const cake = "tiny"', [0, 19])], [fencedCodeBlock("````", [0, 4])], [rawText("Regular: not a trailer because prose follows")], [rawText("still regular")]]}
	${"calm heredocs around nested fences"}         | ${"````shell\ncat <<EOF > README.md\n```shell\npnpm add imaginary-updraft --filter ./packages/comet\nEOF\n````"}                                                                                                                        | ${[[fencedCodeBlock("````shell", [0, 9])], [fencedCodeBlock("cat <<EOF > README.md", [0, 21])], [fencedCodeBlock("```shell", [0, 8])], [fencedCodeBlock("pnpm add imaginary-updraft --filter ./packages/comet", [0, 52])], [fencedCodeBlock("EOF", [0, 3])], [fencedCodeBlock("````", [0, 4])]]}
	${"Archived the documentation breadcrumb"}      | ${'````markdown\n[release ledger](https://docs.example.com/products/comet/releases/2026/06/fenced-code-block-tokeniser?view=full&section=body-lines)\n```json\n{ "nested": true, "reason": "documentation copied itself" }\n```\n````'} | ${[[fencedCodeBlock("````markdown", [0, 12])], [fencedCodeBlock("[release ledger](https://docs.example.com/products/comet/releases/2026/06/fenced-code-block-tokeniser?view=full&section=body-lines)", [0, 131])], [fencedCodeBlock("```json", [0, 7])], [fencedCodeBlock('{ "nested": true, "reason": "documentation copied itself" }', [0, 59])], [fencedCodeBlock("```", [0, 3])], [fencedCodeBlock("````", [0, 4])]]}
`(
	"when the commit message of $body contains quadruple-backtick fenced code blocks",
	(props: { subjectLine: string; body: string; expectedBodyLines: TokenisedLines }) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual([rawText(props.subjectLine)])
		})

		it("extracts fenced code block tokens in the message body", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual(props.expectedBodyLines)
		})
	},
)

describe.each`
	subjectLine                                   | body                                                                                                            | expectedBodyLines
	${"indented triple fences"}                   | ${"  ```ts\nconst outside = true\n ```"}                                                                        | ${[[rawText("  ```ts")], [rawText("const outside = true")], [rawText(" ```")]]}
	${"indented quadruple fences"}                | ${" ````markdown\n ```shell\npnpm add pretend-package\n ````"}                                                  | ${[[rawText(" ````markdown")], [rawText(" ```shell")], [rawText("pnpm add pretend-package")], [rawText(" ````")]]}
	${"Inline backticks is plain prose"}          | ${"This mentions ``` without starting at the beginning.\nAnd this line stays normal as well."}                  | ${[[rawText("This mentions ``` without starting at the beginning.")], [rawText("And this line stays normal as well.")]]}
	${"same goes for inline quadruple backticks"} | ${"The note says ````markdown halfway through the sentence.\nEven https://example.com/````/notes stays plain."} | ${[[rawText("The note says ````markdown halfway through the sentence.")], [rawText("Even https://example.com/````/notes stays plain.")]]}
	${"Ignore fences after impatient prefixes"}   | ${"prefix ```shell\nprefix ````markdown\ntext before ``` and text before ````"}                                 | ${[[rawText("prefix ```shell")], [rawText("prefix ````markdown")], [rawText("text before ``` and text before ````")]]}
`(
	"when the commit message of $body contains backticks that do not begin a fenced code block",
	(props: { subjectLine: string; body: string; expectedBodyLines: TokenisedLines }) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual([rawText(props.subjectLine)])
		})

		it("leaves ordinary body lines unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual(props.expectedBodyLines)
		})
	},
)
