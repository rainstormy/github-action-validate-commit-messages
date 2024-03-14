import {
	type ImperativeSubjectLinesConfiguration,
	type RawImperativeSubjectLinesConfiguration,
	imperativeSubjectLinesConfigurationSchema,
} from "+rules/ImperativeSubjectLines/ImperativeSubjectLinesConfiguration"
import { count } from "+utilities/StringUtilities"
import { describe, expect, it } from "vitest"

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
	${"chatify,chatify"}                               | ${"must not contain duplicates: chatify"}
	${"deckenise,deckenize,chatify,chatify,deckenize"} | ${"must not contain duplicates: deckenize, chatify"}
	${"deckenize,deckenise,deckenise,deckenize"}       | ${"must not contain duplicates: deckenize, deckenise"}
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

		it("raises an error that points out the name of the incorrect parameter", () => {
			expect(() => parseConfiguration({ whitelist: rawWords })).toThrow(
				"imperative-subject-lines--whitelist",
			)
		})
	},
)

function parseConfiguration(
	rawConfiguration: RawImperativeSubjectLinesConfiguration,
): ImperativeSubjectLinesConfiguration {
	return imperativeSubjectLinesConfigurationSchema.parse(rawConfiguration)
}

function formatWords(words: ReadonlyArray<string>): string {
	return words.length === 0
		? "no words"
		: `${count(words, "word", "words")}: ${words.join(", ")}`
}
