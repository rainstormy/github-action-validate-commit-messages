import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import {
	type ImperativeSubjectLinesConfiguration,
	type RawImperativeSubjectLinesConfiguration,
	imperativeSubjectLinesConfigurationSchema,
} from "#rules/ImperativeSubjectLines/ImperativeSubjectLinesConfiguration"
import { count } from "#utilities/StringUtilities"

describe.each`
	rawWords                 | expectedWords
	${""}                    | ${[]}
	${"  "}                  | ${[]}
	${",chatify "}           | ${["chatify"]}
	${"deckenise,deckenize"} | ${["deckenise", "deckenize"]}
`(
	"a whitelist of words from a valid string of $rawWords",
	(testRow: {
		readonly rawWords: string
		readonly expectedWords: ReadonlyArray<string>
	}) => {
		const { rawWords, expectedWords } = testRow

		it(`includes ${formatWords(expectedWords)}`, () => {
			const { whitelist: actualWords } = parseConfiguration({
				whitelist: rawWords,
			})

			expect(actualWords).toStrictEqual(expectedWords)
		})
	},
)

describe.each`
	rawWords                                           | expectedErrorMessage
	${"chatify,chatify"}                               | ${"Input parameter 'imperative-subject-lines--whitelist' must not contain duplicates: chatify"}
	${"deckenise,deckenize,chatify,chatify,deckenize"} | ${"Input parameter 'imperative-subject-lines--whitelist' must not contain duplicates: deckenize, chatify"}
	${"deckenize,deckenise,deckenise,deckenize"}       | ${"Input parameter 'imperative-subject-lines--whitelist' must not contain duplicates: deckenize, deckenise"}
`(
	"a whitelist of words from an invalid string of $rawWords",
	(testRow: {
		readonly rawWords: string
		readonly expectedErrorMessage: string
	}) => {
		const { rawWords, expectedErrorMessage } = testRow

		it(`raises an error with a message of '${expectedErrorMessage}'`, () => {
			expect(() => parseConfiguration({ whitelist: rawWords })).toThrow(
				expectedErrorMessage,
			)
		})
	},
)

function parseConfiguration(
	rawConfiguration: RawImperativeSubjectLinesConfiguration,
): ImperativeSubjectLinesConfiguration {
	return parse(imperativeSubjectLinesConfigurationSchema, rawConfiguration)
}

function formatWords(words: ReadonlyArray<string>): string {
	return words.length === 0
		? "no words"
		: `${count(words, "word", "words")}: ${words.join(", ")}`
}
