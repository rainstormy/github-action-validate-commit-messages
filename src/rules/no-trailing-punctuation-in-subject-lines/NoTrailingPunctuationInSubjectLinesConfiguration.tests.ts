import type {
	NoTrailingPunctuationInSubjectLinesConfiguration,
	RawNoTrailingPunctuationInSubjectLinesConfiguration,
} from "+rules"
import { noTrailingPunctuationInSubjectLinesConfigurationSchema } from "+rules"
import { count } from "+utilities"

describe.each`
	rawSuffixes              | expectedSuffixes
	${""}                    | ${[]}
	${"  "}                  | ${[]}
	${"."}                   | ${["."]}
	${". , : ; - ="}         | ${[".", ",", ":", ";", "-", "="]}
	${" ?  ! "}              | ${["?", "!"]}
	${"  + - * /"}           | ${["+", "-", "*", "/"]}
	${"... ?? !! && || // "} | ${["...", "??", "!!", "&&", "||", "//"]}
`(
	"a whitelist of suffixes from a valid string of $rawSuffixes",
	(testRow: {
		readonly rawSuffixes: string
		readonly expectedSuffixes: ReadonlyArray<string>
	}) => {
		const { rawSuffixes, expectedSuffixes } = testRow

		it(`includes ${formatSuffixes(expectedSuffixes)}`, () => {
			const { whitelist: actualSuffixes } = parseConfiguration({
				whitelist: rawSuffixes,
			})

			expect(actualSuffixes).toStrictEqual(expectedSuffixes)
		})
	},
)

describe.each`
	rawSuffixes                | expectedErrorMessage
	${". . ,"}                 | ${"must not contain duplicates: ."}
	${", . ! : . ,"}           | ${"must not contain duplicates: , ."}
	${"- + ! ? : : + + . , !"} | ${"must not contain duplicates: + ! :"}
`(
	"a whitelist of suffixes from an invalid string of $rawSuffixes",
	(testRow: {
		readonly rawSuffixes: string
		readonly expectedErrorMessage: string
	}) => {
		const { rawSuffixes, expectedErrorMessage } = testRow

		it(`raises an error with a message of '${expectedErrorMessage}'`, () => {
			expect(() => parseConfiguration({ whitelist: rawSuffixes })).toThrow(
				expectedErrorMessage,
			)
		})

		it(`raises an error that points out the name of the incorrect parameter`, () => {
			expect(() => parseConfiguration({ whitelist: rawSuffixes })).toThrow(
				"no-trailing-punctuation-in-subject-lines--whitelist",
			)
		})
	},
)

function parseConfiguration(
	rawConfiguration: RawNoTrailingPunctuationInSubjectLinesConfiguration,
): NoTrailingPunctuationInSubjectLinesConfiguration {
	return noTrailingPunctuationInSubjectLinesConfigurationSchema.parse(
		rawConfiguration,
	)
}

function formatSuffixes(suffixes: ReadonlyArray<string>): string {
	return suffixes.length === 0
		? "no suffixes"
		: `${count(suffixes, "suffix", "suffixes")}: ${suffixes.join(" ")}`
}
