import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { dependencyVersion } from "#commits/tokens/DependencyVersionToken.ts"
import { inlineCode } from "#commits/tokens/InlineCodeToken.ts"
import { issueLink } from "#commits/tokens/IssueLinkToken.ts"
import { revertMarker } from "#commits/tokens/RevertMarkerToken.ts"
import { squashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import { text } from "#commits/tokens/TextToken.ts"
import type { TokenisedLine, TokenisedLines } from "#commits/tokens/Token.ts"
import { trailer } from "#commits/tokens/TrailerToken.ts"
import { fakeConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeConfiguration()

describe.each`
	subjectLine                                         | body                                                                                                                                                                                                                                        | expectedSubjectLine                                                                                                                                       | expectedBodyLines
	${"Update src/main.ts"}                             | ${"\nCo-Authored-By: Everloving Easter Bunny <everloving.easter.bunny@example.com>"}                                                                                                                                                        | ${[text("Update src/main.ts", [0, 18])]}                                                                                                                  | ${[[], [trailer("Co-Authored-By: ", "Everloving Easter Bunny <everloving.easter.bunny@example.com>", [0, 77])]]}
	${"Teach the changelog to whisper"}                 | ${"\nThe noisy bits moved to the release notes.\n\nFooter: charming"}                                                                                                                                                                       | ${[text("Teach the changelog to whisper", [0, 30])]}                                                                                                      | ${[[], [text("The noisy bits moved to the release notes.", [0, 42])], [], [trailer("Footer: ", "charming", [0, 16])]]}
	${"do some pair programming"}                       | ${"\nthis commit is a collab\nco-authored-by: santa claus <santa.claus@example.com>\nco-authored-by  : gingerbread man <gingerbread.man@example.com>\nreported-by: little mermaid <little.mermaid@example.com>"}                            | ${[text("do some pair programming", [0, 24])]}                                                                                                            | ${[[], [text("this commit is a collab", [0, 23])], [trailer("co-authored-by: ", "santa claus <santa.claus@example.com>", [0, 53])], [trailer("co-authored-by  : ", "gingerbread man <gingerbread.man@example.com>", [0, 63])], [trailer("reported-by: ", "little mermaid <little.mermaid@example.com>", [0, 56])]]}
	${"Calibrate `HotChocolateMachine`"}                | ${"The pressure now stays pleasantly dramatic.\n Signed-off-by:Michelangelo di Lodovico Buonarroti Simoni <28317649+cowabunga@users.noreply.github.com>"}                                                                                   | ${[text("Calibrate ", [0, 10]), inlineCode("`HotChocolateMachine`", [10, 31])]}                                                                           | ${[[text("The pressure now stays pleasantly dramatic.", [0, 43])], [trailer(" Signed-off-by:", "Michelangelo di Lodovico Buonarroti Simoni <28317649+cowabunga@users.noreply.github.com>", [0, 103])]]}
	${"Upgrade the badge printer"}                      | ${"\nThe queue no longer panics.\nSchemamaxxed the validation and protected the valuable payload.\n\nRefs :: #123\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>\n\nBREAKING CHANGE: Old badge templates are gone."} | ${[text("Upgrade the badge printer", [0, 25])]}                                                                                                           | ${[[], [text("The queue no longer panics.", [0, 27])], [text("Schemamaxxed the validation and protected the valuable payload.", [0, 63])], [], [trailer("Refs :", ": #123", [0, 12])], [trailer("Co-authored-by: ", "Copilot <223556219+Copilot@users.noreply.github.com>", [0, 68])], [], [trailer("BREAKING CHANGE: ", "Old badge templates are gone.", [0, 46])]]}
	${"Credit the careful reviewers"}                   | ${"\n\n  Reviewed-by:  April O'Neil <april.oneil@fastforward.com>\n\nSigned-off-by: baxter.stockman <baxter.stockman@fastforward.com>\n"}                                                                                                   | ${[text("Credit the careful reviewers", [0, 28])]}                                                                                                        | ${[[], [], [trailer("  Reviewed-by:  ", "April O'Neil <april.oneil@fastforward.com>", [0, 58])], [], [trailer("Signed-off-by: ", "baxter.stockman <baxter.stockman@fastforward.com>", [0, 64])], []]}
	${"feat: document the careful shortcut"}            | ${"The body explains the shortcut.\nSigned-off-by: Master Splinter <sensei@ninja-academy.com>"}                                                                                                                                             | ${[text("feat: document the careful shortcut", [0, 35])]}                                                                                                 | ${[[text("The body explains the shortcut.", [0, 31])], [trailer("Signed-off-by: ", "Master Splinter <sensei@ninja-academy.com>", [0, 57])]]}
	${"add some goongala to the battle shell"}          | ${"Refs: #1337\nWith extra slices of pizza!!\n\nReviewed-by: April O'Neil <april.oneil@fastforward.com>\nSigned-off-by: Casey Jones <casey.jones@fastforward.com>"}                                                                         | ${[text("add some goongala to the battle shell", [0, 37])]}                                                                                               | ${[[text("Refs: #1337", [0, 11])], [text("With extra slices of pizza!!", [0, 28])], [], [trailer("Reviewed-by: ", "April O'Neil <april.oneil@fastforward.com>", [0, 55])], [trailer("Signed-off-by: ", "Casey Jones <casey.jones@fastforward.com>", [0, 56])]]}
	${"Record the quiet acknowledgements"}              | ${"\nReviewed-by: \nBREAKING CHANGE:"}                                                                                                                                                                                                      | ${[text("Record the quiet acknowledgements", [0, 33])]}                                                                                                   | ${[[], [trailer("Reviewed-by: ", "", [0, 13])], [trailer("BREAKING CHANGE:", "", [0, 16])]]}
	${"fixup! calibrate tiny robot (#88)"}              | ${"\n  reviewed-by:   the night baker   "}                                                                                                                                                                                                  | ${[squashMarker("fixup! ", [0, 7]), text("calibrate tiny robot", [7, 27]), issueLink(" (#88)", [27, 33])]}                                                | ${[[], [trailer("  reviewed-by:   ", "the night baker   ", [0, 35])]]}
	${"squash! Teach CI to whisper GL-42"}              | ${"ACKED-BY:\tCAPTAIN STATIC\t"}                                                                                                                                                                                                            | ${[squashMarker("squash! ", [0, 8]), text("Teach CI to whisper", [8, 27]), issueLink(" GL-42", [27, 33])]}                                                | ${[[trailer("ACKED-BY:\t", "CAPTAIN STATIC\t", [0, 25])]]}
	${'Revert "Footer: make old parser nervous (#19)"'} | ${"\nbreaking change:   switch to quieter alarms   "}                                                                                                                                                                                       | ${[revertMarker('Revert "', 1, [0, 8]), text("Footer: make old parser nervous", [8, 39]), issueLink(" (#19)", [39, 45]), revertMarker('"', 0, [45, 46])]} | ${[[], [trailer("breaking change:   ", "switch to quieter alarms   ", [0, 46])]]}
	${"deps: lower the tiny boom"}                      | ${"WISHLIST :   cake first, tests second   "}                                                                                                                                                                                               | ${[text("deps: lower the tiny boom", [0, 25])]}                                                                                                           | ${[[trailer("WISHLIST :   ", "cake first, tests second   ", [0, 40])]]}
	${"Add GPS notes"}                                  | ${"Refs: the map says key: value: keep walking"}                                                                                                                                                                                            | ${[text("Add GPS notes", [0, 13])]}                                                                                                                       | ${[[trailer("Refs: ", "the map says key: value: keep walking", [0, 43])]]}
	${"Plan the loud migration"}                        | ${"\n\n\nBREAKING CHANGE: config now accepts host:port:mode"}                                                                                                                                                                               | ${[text("Plan the loud migration", [0, 23])]}                                                                                                             | ${[[], [], [], [trailer("BREAKING CHANGE: ", "config now accepts host:port:mode", [0, 50])]]}
	${"document the field notes"}                       | ${"co-authored-by: Donatello <42069849+gogogadget@users.noreply.github.com>: with field notes"}                                                                                                                                             | ${[text("document the field notes", [0, 24])]}                                                                                                            | ${[[trailer("co-authored-by: ", "Donatello <42069849+gogogadget@users.noreply.github.com>: with field notes", [0, 90])]]}
`(
	"when the commit message of $body contains trailers",
	(props: {
		subjectLine: string
		body: string
		expectedSubjectLine: TokenisedLine
		expectedBodyLines: TokenisedLines
	}) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(props.expectedSubjectLine)
		})

		it("extracts trailer tokens in the message body", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual(props.expectedBodyLines)
		})
	},
)

describe.each`
	subjectLine                               | body                                                                                                                                                                                                                          | expectedSubjectLine                                                                                                    | expectedBodyLines
	${"Explain the suspicious label"}         | ${"Refs: This looked official for a moment.\nThen the paragraph kept going."}                                                                                                                                                 | ${[text("Explain the suspicious label", [0, 28])]}                                                                     | ${[[text("Refs: This looked official for a moment.", [0, 40])], [text("Then the paragraph kept going.", [0, 30])]]}
	${"Do some pair programming"}             | ${"\nThis commit is a collab.\n\nCo-authored-by: Gon Freecss <rock.paper.scissors@hunters.com>\nCo-authored-by: Killua Zoldyck <killua@godspeed.net>\n Reported-by: Hisoka <no4@phantom.com>\n\nAll participants had fun.\n"} | ${[text("Do some pair programming", [0, 24])]}                                                                         | ${[[], [text("This commit is a collab.", [0, 24])], [], [text("Co-authored-by: Gon Freecss <rock.paper.scissors@hunters.com>", [0, 61])], [text("Co-authored-by: Killua Zoldyck <killua@godspeed.net>", [0, 52])], [text(" Reported-by: Hisoka <no4@phantom.com>", [0, 38])], [], [text("All participants had fun.", [0, 25])], []]}
	${"fixup! keep the lowercase memo"}       | ${"Footer: looks real\nthen it keeps talking"}                                                                                                                                                                                | ${[squashMarker("fixup! ", [0, 7]), text("keep the lowercase memo", [7, 30])]}                                         | ${[[text("Footer: looks real", [0, 18])], [text("then it keeps talking", [0, 21])]]}
	${"SQUASH! no token here maybe"}          | ${"ACKED-BY: The Captain\nordinary words after the captain"}                                                                                                                                                                  | ${[squashMarker("SQUASH! ", [0, 8]), text("no token here maybe", [8, 27])]}                                            | ${[[text("ACKED-BY: The Captain", [0, 21])], [text("ordinary words after the captain", [0, 32])]]}
	${'Revert "reviewed-by: subject mirage"'} | ${"breaking change: seems important\nbut this paragraph is still alive"}                                                                                                                                                      | ${[revertMarker('Revert "', 1, [0, 8]), text("reviewed-by: subject mirage", [8, 35]), revertMarker('"', 0, [35, 36])]} | ${[[text("breaking change: seems important", [0, 32])], [text("but this paragraph is still alive", [0, 33])]]}
`(
	"when the commit message of $body contains trailer-like lines followed by regular lines of text",
	(props: {
		subjectLine: string
		body: string
		expectedSubjectLine: TokenisedLine
		expectedBodyLines: TokenisedLines
	}) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(props.expectedSubjectLine)
		})

		it("leaves the body lines unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual(props.expectedBodyLines)
		})
	},
)

describe.each`
	subjectLine                                                         | body                                                                                                                                                                                                                                                                                                                                                      | expectedSubjectLine                                                                                                                                                                                  | expectedBodyLines
	${"bugfix"}                                                         | ${"attempt 2"}                                                                                                                                                                                                                                                                                                                                            | ${[text("bugfix", [0, 6])]}                                                                                                                                                                          | ${[[text("attempt 2", [0, 9])]]}
	${"Refactor the taxi module"}                                       | ${"The roof sign now flashes politely."}                                                                                                                                                                                                                                                                                                                  | ${[text("Refactor the taxi module", [0, 24])]}                                                                                                                                                       | ${[[text("The roof sign now flashes politely.", [0, 35])]]}
	${"Resolve the conflicts"}                                          | ${"\nConflicts:\n\n src/grumpy-cat.ts\n src/summer-vacation-plans.ts"}                                                                                                                                                                                                                                                                                    | ${[text("Resolve the conflicts", [0, 21])]}                                                                                                                                                          | ${[[], [text("Conflicts:", [0, 10])], [], [text(" src/grumpy-cat.ts", [0, 18])], [text(" src/summer-vacation-plans.ts", [0, 29])]]}
	${"fixup! Upgrade @typescript-eslint/parser from 5.52.0 to 5.59.1"} | ${"\n\n\n\nBumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 5.52.0 to 5.59.1.\n- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)\n- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)"} | ${[squashMarker("fixup! ", [0, 7]), text("Upgrade @typescript-eslint/parser from ", [7, 46]), dependencyVersion("5.52.0", [46, 52]), text(" to ", [52, 56]), dependencyVersion("5.59.1", [56, 62])]} | ${[[], [], [], [], [text("Bumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 5.52.0 to 5.59.1.", [0, 138])], [text("- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)", [0, 82])], [text("- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)", [0, 108])]]}
	${"lowercase chores only"}                                          | ${"This body mentions refs: #44 inline."}                                                                                                                                                                                                                                                                                                                 | ${[text("lowercase chores only", [0, 21])]}                                                                                                                                                          | ${[[text("This body mentions refs: #44 inline.", [0, 36])]]}
	${"squash! refs: subject mirage"}                                   | ${"\nBREAKING CHANGE - not a colon trailer\nCo-authored-by = missing colon"}                                                                                                                                                                                                                                                                              | ${[squashMarker("squash! ", [0, 8]), text("refs: subject mirage", [8, 28])]}                                                                                                                         | ${[[], [text("BREAKING CHANGE - not a colon trailer", [0, 37])], [text("Co-authored-by = missing colon", [0, 30])]]}
	${'Revert "Signed-off-by: subject mirage"'}                         | ${"Signed-off-by:\nNo final trailer follows this sentence."}                                                                                                                                                                                                                                                                                              | ${[revertMarker('Revert "', 1, [0, 8]), text("Signed-off-by: subject mirage", [8, 37]), revertMarker('"', 0, [37, 38])]}                                                                             | ${[[text("Signed-off-by:", [0, 14])], [text("No final trailer follows this sentence.", [0, 39])]]}
	${"Add GPS notes"}                                                  | ${"trailer-like: starts the body\nregular line closes the paragraph"}                                                                                                                                                                                                                                                                                     | ${[text("Add GPS notes", [0, 13])]}                                                                                                                                                                  | ${[[text("trailer-like: starts the body", [0, 29])], [text("regular line closes the paragraph", [0, 33])]]}
`(
	"when the commit message of $body does not contain any trailers",
	(props: {
		subjectLine: string
		body: string
		expectedSubjectLine: TokenisedLine
		expectedBodyLines: TokenisedLines
	}) => {
		const crudeCommit = fakeCrudeCommit({ message: `${props.subjectLine}\n${props.body}` })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(props.expectedSubjectLine)
		})

		it("leaves the body lines unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual(props.expectedBodyLines)
		})
	},
)

describe.each`
	subjectLine                                                    | expectedSubjectLine
	${"Refs: This looked official for a moment."}                  | ${[text("Refs: This looked official for a moment.", [0, 40])]}
	${"Signed-off-by: April O'Neil <april.oneil@fastforward.com>"} | ${[text("Signed-off-by: April O'Neil <april.oneil@fastforward.com>", [0, 57])]}
	${"BREAKING CHANGE: The old badge printer retired."}           | ${[text("BREAKING CHANGE: The old badge printer retired.", [0, 47])]}
	${"Refs: looks official in the subject (#12)"}                 | ${[text("Refs: looks official in the subject", [0, 35]), issueLink(" (#12)", [35, 41])]}
	${"signed-off-by: lowercase subject only"}                     | ${[text("signed-off-by: lowercase subject only", [0, 37])]}
	${"ACKED-BY: SUBJECT ONLY"}                                    | ${[text("ACKED-BY: SUBJECT ONLY", [0, 22])]}
`(
	"when the subject line looks like a trailer",
	(props: { subjectLine: string; expectedSubjectLine: TokenisedLine }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(props.expectedSubjectLine)
		})

		it("has no body lines", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.bodyLines).toEqual([])
		})
	},
)
