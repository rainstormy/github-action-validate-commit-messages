import { parse } from "valibot"
import { describe, expect, it } from "vitest"
import {
	type IssueReferencesInSubjectLinesConfiguration,
	type RawIssueReferencesInSubjectLinesConfiguration,
	issueReferencesInSubjectLinesConfigurationSchema,
} from "#legacy-v1/rules/IssueReferencesInSubjectLines/IssueReferencesInSubjectLinesConfiguration"
import { count } from "#legacy-v1/utilities/StringUtilities"

describe.each`
	rawPatterns                                                  | expectedPatterns
	${"#[1-9][0-9]*"}                                            | ${["#[1-9][0-9]*"]}
	${" (PEGASUS|UNICORN)-\\d+ "}                                | ${["(PEGASUS|UNICORN)-\\d+"]}
	${"ALPHA-[1-9][0-9]* BRAVO-[1-9][0-9]* CHARLIE-[1-9][0-9]*"} | ${["ALPHA-[1-9][0-9]*", "BRAVO-[1-9][0-9]*", "CHARLIE-[1-9][0-9]*"]}
`(
	"a list of patterns from a valid string of $rawPatterns",
	(testRow: {
		readonly rawPatterns: string
		readonly expectedPatterns: ReadonlyArray<string>
	}) => {
		const { rawPatterns, expectedPatterns } = testRow

		it(`includes ${formatPatterns(expectedPatterns)}`, () => {
			const { patterns: actualPatterns } = parseConfiguration({
				allowedPositions: "as-prefix,as-suffix",
				patterns: rawPatterns,
			})

			expect(actualPatterns).toStrictEqual(expectedPatterns)
		})
	},
)

describe.each`
	rawPatterns                                                                                                          | expectedErrorMessage
	${""}                                                                                                                | ${"Input parameter 'issue-references-in-subject-lines--patterns' must specify at least one value"}
	${"  "}                                                                                                              | ${"Input parameter 'issue-references-in-subject-lines--patterns' must specify at least one value"}
	${"#[1-9][0-9]* #[1-9][0-9]*"}                                                                                       | ${"Input parameter 'issue-references-in-subject-lines--patterns' must not contain duplicates: #[1-9][0-9]*"}
	${"ALPHA-[1-9][0-9]* BRAVO-[1-9][0-9]* CHARLIE-[1-9][0-9]* ALPHA-[1-9][0-9]*"}                                       | ${"Input parameter 'issue-references-in-subject-lines--patterns' must not contain duplicates: ALPHA-[1-9][0-9]*"}
	${"ALPHA-[1-9][0-9]* BRAVO-[1-9][0-9]* CHARLIE-[1-9][0-9]* CHARLIE-[1-9][0-9]* BRAVO-[1-9][0-9]* BRAVO-[1-9][0-9]*"} | ${"Input parameter 'issue-references-in-subject-lines--patterns' must not contain duplicates: BRAVO-[1-9][0-9]* CHARLIE-[1-9][0-9]*"}
`(
	"a list of patterns from an invalid string of $rawPatterns",
	(testRow: {
		readonly rawPatterns: string
		readonly expectedErrorMessage: string
	}) => {
		const { rawPatterns, expectedErrorMessage } = testRow

		it(`raises an error with a message of '${expectedErrorMessage}'`, () => {
			expect(() =>
				parseConfiguration({
					allowedPositions: "as-prefix,as-suffix",
					patterns: rawPatterns,
				}),
			).toThrow(expectedErrorMessage)
		})
	},
)

describe.each`
	rawPositions                  | expectedPositions
	${"as-prefix "}               | ${["as-prefix"]}
	${",,as-suffix "}             | ${["as-suffix"]}
	${"as-prefix,as-suffix"}      | ${["as-prefix", "as-suffix"]}
	${",as-suffix,,  ,as-prefix"} | ${["as-suffix", "as-prefix"]}
`(
	"a list of allowed positions from a valid string of $rawPositions",
	(testRow: {
		readonly rawPositions: string
		readonly expectedPositions: ReadonlyArray<string>
	}) => {
		const { rawPositions, expectedPositions } = testRow

		it(`includes ${formatPositions(expectedPositions)}`, () => {
			const { allowedPositions: actualPositions } = parseConfiguration({
				allowedPositions: rawPositions,
				patterns: "UNICORN-[1-9][0-9]*",
			})

			expect(actualPositions).toStrictEqual(expectedPositions)
		})
	},
)

describe.each`
	rawPositions                                           | expectedErrorMessage
	${""}                                                  | ${"Input parameter 'issue-references-in-subject-lines--allowed-positions' must specify at least one value"}
	${"  "}                                                | ${"Input parameter 'issue-references-in-subject-lines--allowed-positions' must specify at least one value"}
	${" ,   ,, , ,,, "}                                    | ${"Input parameter 'issue-references-in-subject-lines--allowed-positions' must specify at least one value"}
	${"as-prefix, as-infix, as-postfix, as-suffix"}        | ${"Input parameter 'issue-references-in-subject-lines--allowed-positions' must not contain unknown values: as-infix, as-postfix"}
	${"as-prefix,as-prefix"}                               | ${"Input parameter 'issue-references-in-subject-lines--allowed-positions' must not contain duplicates: as-prefix"}
	${"as-prefix,as-suffix,as-suffix"}                     | ${"Input parameter 'issue-references-in-subject-lines--allowed-positions' must not contain duplicates: as-suffix"}
	${"as-suffix,as-prefix,as-prefix,as-prefix,as-suffix"} | ${"Input parameter 'issue-references-in-subject-lines--allowed-positions' must not contain duplicates: as-suffix, as-prefix"}
`(
	"a list of allowed positions from an invalid string of $rawPositions",
	(testRow: {
		readonly rawPositions: string
		readonly expectedErrorMessage: string
	}) => {
		const { rawPositions, expectedErrorMessage } = testRow

		it(`raises an error with a message of '${expectedErrorMessage}'`, () => {
			expect(() =>
				parseConfiguration({
					allowedPositions: rawPositions,
					patterns: "UNICORN-[1-9][0-9]*",
				}),
			).toThrow(expectedErrorMessage)
		})
	},
)

function parseConfiguration(
	rawConfiguration: RawIssueReferencesInSubjectLinesConfiguration,
): IssueReferencesInSubjectLinesConfiguration {
	return parse(
		issueReferencesInSubjectLinesConfigurationSchema,
		rawConfiguration,
	)
}

function formatPatterns(patterns: ReadonlyArray<string>): string {
	return `${count(patterns, "pattern", "patterns")}: ${patterns.join(", ")}`
}

function formatPositions(positions: ReadonlyArray<string>): string {
	return `${count(positions, "position", "positions")}: ${positions.join(", ")}`
}
