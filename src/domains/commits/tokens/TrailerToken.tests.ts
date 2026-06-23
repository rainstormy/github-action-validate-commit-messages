import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { dependencyVersion } from "#commits/tokens/DependencyVersionToken.ts"
import { inlineCode } from "#commits/tokens/InlineCodeToken.ts"
import { issueLink } from "#commits/tokens/IssueLinkToken.ts"
import { revertMarker } from "#commits/tokens/RevertMarkerToken.ts"
import { squashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import { rawText, text } from "#commits/tokens/TextToken.ts"
import type { TokenisedLine, TokenisedLines } from "#commits/tokens/Token.ts"
import { trailer } from "#commits/tokens/TrailerToken.ts"
import { fakeTokenConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeTokenConfiguration()

describe.each`
	subjectLine                                         | body                                                                                                                                                                                                                                        | expectedSubjectLine                                                                                                             | expectedBodyLines
	${"Update src/main.ts"}                             | ${"\nCo-Authored-By: Everloving Easter Bunny <everloving.easter.bunny@example.com>"}                                                                                                                                                        | ${[rawText("Update src/main.ts")]}                                                                                              | ${[[], [trailer("Co-Authored-By: ", "Everloving Easter Bunny <everloving.easter.bunny@example.com>")]]}
	${"Teach the changelog to whisper"}                 | ${"\nThe noisy bits moved to the release notes.\n\nFooter: charming"}                                                                                                                                                                       | ${[rawText("Teach the changelog to whisper")]}                                                                                  | ${[[], [rawText("The noisy bits moved to the release notes.")], [], [trailer("Footer: ", "charming")]]}
	${"do some pair programming"}                       | ${"\nthis commit is a collab\nco-authored-by: santa claus <santa.claus@example.com>\nco-authored-by  : gingerbread man <gingerbread.man@example.com>\nreported-by: little mermaid <little.mermaid@example.com>"}                            | ${[rawText("do some pair programming")]}                                                                                        | ${[[], [rawText("this commit is a collab")], [trailer("co-authored-by: ", "santa claus <santa.claus@example.com>")], [trailer("co-authored-by  : ", "gingerbread man <gingerbread.man@example.com>")], [trailer("reported-by: ", "little mermaid <little.mermaid@example.com>")]]}
	${"Calibrate `HotChocolateMachine`"}                | ${"The pressure now stays pleasantly dramatic.\n Signed-off-by:Michelangelo di Lodovico Buonarroti Simoni <28317649+cowabunga@users.noreply.github.com>"}                                                                                   | ${[text("Calibrate "), inlineCode("`HotChocolateMachine`", 10)]}                                                                | ${[[rawText("The pressure now stays pleasantly dramatic.")], [trailer(" Signed-off-by:", "Michelangelo di Lodovico Buonarroti Simoni <28317649+cowabunga@users.noreply.github.com>")]]}
	${"Upgrade the badge printer"}                      | ${"\nThe queue no longer panics.\nSchemamaxxed the validation and protected the valuable payload.\n\nRefs :: #123\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>\n\nBREAKING CHANGE: Old badge templates are gone."} | ${[rawText("Upgrade the badge printer")]}                                                                                       | ${[[], [rawText("The queue no longer panics.")], [rawText("Schemamaxxed the validation and protected the valuable payload.")], [], [trailer("Refs :", ": #123")], [trailer("Co-authored-by: ", "Copilot <223556219+Copilot@users.noreply.github.com>")], [], [trailer("BREAKING CHANGE: ", "Old badge templates are gone.")]]}
	${"Credit the careful reviewers"}                   | ${"\n\n  Reviewed-by:  April O'Neil <april.oneil@fastforward.com>\n\nSigned-off-by: baxter.stockman <baxter.stockman@fastforward.com>\n"}                                                                                                   | ${[rawText("Credit the careful reviewers")]}                                                                                    | ${[[], [], [trailer("  Reviewed-by:  ", "April O'Neil <april.oneil@fastforward.com>")], [], [trailer("Signed-off-by: ", "baxter.stockman <baxter.stockman@fastforward.com>")], []]}
	${"feat: document the careful shortcut"}            | ${"The body explains the shortcut.\nSigned-off-by: Master Splinter <sensei@ninja-academy.com>"}                                                                                                                                             | ${[rawText("feat: document the careful shortcut")]}                                                                             | ${[[rawText("The body explains the shortcut.")], [trailer("Signed-off-by: ", "Master Splinter <sensei@ninja-academy.com>")]]}
	${"add some goongala to the battle shell"}          | ${"Refs: #1337\nWith extra slices of pizza!!\n\nReviewed-by: April O'Neil <april.oneil@fastforward.com>\nSigned-off-by: Casey Jones <casey.jones@fastforward.com>"}                                                                         | ${[rawText("add some goongala to the battle shell")]}                                                                           | ${[[rawText("Refs: #1337")], [rawText("With extra slices of pizza!!")], [], [trailer("Reviewed-by: ", "April O'Neil <april.oneil@fastforward.com>")], [trailer("Signed-off-by: ", "Casey Jones <casey.jones@fastforward.com>")]]}
	${"Record the quiet acknowledgements"}              | ${"\nReviewed-by: \nBREAKING CHANGE:"}                                                                                                                                                                                                      | ${[rawText("Record the quiet acknowledgements")]}                                                                               | ${[[], [trailer("Reviewed-by: ", "")], [trailer("BREAKING CHANGE:", "")]]}
	${"fixup! calibrate tiny robot (#88)"}              | ${"\n  reviewed-by:   the night baker   "}                                                                                                                                                                                                  | ${[squashMarker("fixup! "), text("calibrate tiny robot", 7), issueLink(" (#88)", 27)]}                                          | ${[[], [trailer("  reviewed-by:   ", "the night baker   ")]]}
	${"squash! Teach CI to whisper GL-42"}              | ${"ACKED-BY:\tCAPTAIN STATIC\t"}                                                                                                                                                                                                            | ${[squashMarker("squash! "), text("Teach CI to whisper", 8), issueLink(" GL-42", 27)]}                                          | ${[[trailer("ACKED-BY:\t", "CAPTAIN STATIC\t")]]}
	${'Revert "Footer: make old parser nervous (#19)"'} | ${"\nbreaking change:   switch to quieter alarms   "}                                                                                                                                                                                       | ${[revertMarker('Revert "', 1), text("Footer: make old parser nervous", 8), issueLink(" (#19)", 39), revertMarker('"', 0, 45)]} | ${[[], [trailer("breaking change:   ", "switch to quieter alarms   ")]]}
	${"deps: lower the tiny boom"}                      | ${"WISHLIST :   cake first, tests second   "}                                                                                                                                                                                               | ${[rawText("deps: lower the tiny boom")]}                                                                                       | ${[[trailer("WISHLIST :   ", "cake first, tests second   ")]]}
	${"Add GPS notes"}                                  | ${"Refs: the map says key: value: keep walking"}                                                                                                                                                                                            | ${[rawText("Add GPS notes")]}                                                                                                   | ${[[trailer("Refs: ", "the map says key: value: keep walking")]]}
	${"Plan the loud migration"}                        | ${"\n\n\nBREAKING CHANGE: config now accepts host:port:mode"}                                                                                                                                                                               | ${[rawText("Plan the loud migration")]}                                                                                         | ${[[], [], [], [trailer("BREAKING CHANGE: ", "config now accepts host:port:mode")]]}
	${"document the field notes"}                       | ${"co-authored-by: Donatello <42069849+gogogadget@users.noreply.github.com>: with field notes"}                                                                                                                                             | ${[rawText("document the field notes")]}                                                                                        | ${[[trailer("co-authored-by: ", "Donatello <42069849+gogogadget@users.noreply.github.com>: with field notes")]]}
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
	subjectLine                               | body                                                                                                                                                                                                                          | expectedSubjectLine                                                                                | expectedBodyLines
	${"Explain the suspicious label"}         | ${"Refs: This looked official for a moment.\nThen the paragraph kept going."}                                                                                                                                                 | ${[rawText("Explain the suspicious label")]}                                                       | ${[[rawText("Refs: This looked official for a moment.")], [rawText("Then the paragraph kept going.")]]}
	${"Do some pair programming"}             | ${"\nThis commit is a collab.\n\nCo-authored-by: Gon Freecss <rock.paper.scissors@hunters.com>\nCo-authored-by: Killua Zoldyck <killua@godspeed.net>\n Reported-by: Hisoka <no4@phantom.com>\n\nAll participants had fun.\n"} | ${[rawText("Do some pair programming")]}                                                           | ${[[], [rawText("This commit is a collab.")], [], [rawText("Co-authored-by: Gon Freecss <rock.paper.scissors@hunters.com>")], [rawText("Co-authored-by: Killua Zoldyck <killua@godspeed.net>")], [rawText(" Reported-by: Hisoka <no4@phantom.com>")], [], [rawText("All participants had fun.")], []]}
	${"fixup! keep the lowercase memo"}       | ${"Footer: looks real\nthen it keeps talking"}                                                                                                                                                                                | ${[squashMarker("fixup! "), text("keep the lowercase memo", 7)]}                                   | ${[[rawText("Footer: looks real")], [rawText("then it keeps talking")]]}
	${"SQUASH! no token here maybe"}          | ${"ACKED-BY: The Captain\nordinary words after the captain"}                                                                                                                                                                  | ${[squashMarker("SQUASH! "), text("no token here maybe", 8)]}                                      | ${[[rawText("ACKED-BY: The Captain")], [rawText("ordinary words after the captain")]]}
	${'Revert "reviewed-by: subject mirage"'} | ${"breaking change: seems important\nbut this paragraph is still alive"}                                                                                                                                                      | ${[revertMarker('Revert "', 1), text("reviewed-by: subject mirage", 8), revertMarker('"', 0, 35)]} | ${[[rawText("breaking change: seems important")], [rawText("but this paragraph is still alive")]]}
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
	subjectLine                                                         | body                                                                                                                                                                                                                                                                                                                                                      | expectedSubjectLine                                                                                                                                                  | expectedBodyLines
	${"bugfix"}                                                         | ${"attempt 2"}                                                                                                                                                                                                                                                                                                                                            | ${[rawText("bugfix")]}                                                                                                                                               | ${[[rawText("attempt 2")]]}
	${"Refactor the taxi module"}                                       | ${"The roof sign now flashes politely."}                                                                                                                                                                                                                                                                                                                  | ${[rawText("Refactor the taxi module")]}                                                                                                                             | ${[[rawText("The roof sign now flashes politely.")]]}
	${"Resolve the conflicts"}                                          | ${"\nConflicts:\n\n src/grumpy-cat.ts\n src/summer-vacation-plans.ts"}                                                                                                                                                                                                                                                                                    | ${[rawText("Resolve the conflicts")]}                                                                                                                                | ${[[], [rawText("Conflicts:")], [], [rawText(" src/grumpy-cat.ts")], [rawText(" src/summer-vacation-plans.ts")]]}
	${"fixup! Upgrade @typescript-eslint/parser from 5.52.0 to 5.59.1"} | ${"\n\n\n\nBumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 5.52.0 to 5.59.1.\n- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)\n- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)"} | ${[squashMarker("fixup! "), text("Upgrade @typescript-eslint/parser from ", 7), dependencyVersion("5.52.0", 46), text(" to ", 52), dependencyVersion("5.59.1", 56)]} | ${[[], [], [], [], [rawText("Bumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 5.52.0 to 5.59.1.")], [rawText("- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)")], [rawText("- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)")]]}
	${"lowercase chores only"}                                          | ${"This body mentions refs: #44 inline."}                                                                                                                                                                                                                                                                                                                 | ${[rawText("lowercase chores only")]}                                                                                                                                | ${[[rawText("This body mentions refs: #44 inline.")]]}
	${"squash! refs: subject mirage"}                                   | ${"\nBREAKING CHANGE - not a colon trailer\nCo-authored-by = missing colon"}                                                                                                                                                                                                                                                                              | ${[squashMarker("squash! "), text("refs: subject mirage", 8)]}                                                                                                       | ${[[], [rawText("BREAKING CHANGE - not a colon trailer")], [rawText("Co-authored-by = missing colon")]]}
	${'Revert "Signed-off-by: subject mirage"'}                         | ${"Signed-off-by:\nNo final trailer follows this sentence."}                                                                                                                                                                                                                                                                                              | ${[revertMarker('Revert "', 1), text("Signed-off-by: subject mirage", 8), revertMarker('"', 0, 37)]}                                                                 | ${[[rawText("Signed-off-by:")], [rawText("No final trailer follows this sentence.")]]}
	${"Add GPS notes"}                                                  | ${"trailer-like: starts the body\nregular line closes the paragraph"}                                                                                                                                                                                                                                                                                     | ${[rawText("Add GPS notes")]}                                                                                                                                        | ${[[rawText("trailer-like: starts the body")], [rawText("regular line closes the paragraph")]]}
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
	${"Refs: This looked official for a moment."}                  | ${[rawText("Refs: This looked official for a moment.")]}
	${"Signed-off-by: April O'Neil <april.oneil@fastforward.com>"} | ${[rawText("Signed-off-by: April O'Neil <april.oneil@fastforward.com>")]}
	${"BREAKING CHANGE: The old badge printer retired."}           | ${[rawText("BREAKING CHANGE: The old badge printer retired.")]}
	${"Refs: looks official in the subject (#12)"}                 | ${[text("Refs: looks official in the subject"), issueLink(" (#12)", 35)]}
	${"signed-off-by: lowercase subject only"}                     | ${[rawText("signed-off-by: lowercase subject only")]}
	${"ACKED-BY: SUBJECT ONLY"}                                    | ${[rawText("ACKED-BY: SUBJECT ONLY")]}
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
