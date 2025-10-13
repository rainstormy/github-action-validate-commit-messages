import {
	check,
	type InferInput,
	type InferOutput,
	object,
	pipe,
	string,
	transform,
} from "valibot"
import {
	getDuplicateValues,
	getUnknownValues,
	requireAtLeastOneValue,
	requireNoDuplicateValues,
	requireNoUnknownValues,
} from "#legacy-v1/utilities/IterableUtilities.ts"
import {
	splitByComma,
	splitBySpace,
} from "#legacy-v1/utilities/StringUtilities.ts"

const issueReferencePositions = ["as-prefix", "as-suffix"] as const

export type LegacyV1IssueReferencePosition =
	(typeof issueReferencePositions)[number]
export type LegacyV1IssueReferencePositions =
	Array<LegacyV1IssueReferencePosition>

export const legacyV1IssueReferencesInSubjectLinesConfigurationSchema = object({
	allowedPositions: pipe(
		string(),
		transform(splitByComma),
		check(
			requireAtLeastOneValue,
			"Input parameter 'issue-references-in-subject-lines--allowed-positions' must specify at least one value",
		),
		check(
			requireNoDuplicateValues,
			(issue) =>
				`Input parameter 'issue-references-in-subject-lines--allowed-positions' must not contain duplicates: ${getDuplicateValues(
					issue.input,
				).join(", ")}`,
		),
		check(
			requireNoUnknownValues(issueReferencePositions),
			(issue) =>
				`Input parameter 'issue-references-in-subject-lines--allowed-positions' must not contain unknown values: ${getUnknownValues(
					issueReferencePositions,
					issue.input,
				).join(", ")}`,
		),
		transform((input) => input as LegacyV1IssueReferencePositions),
	),
	patterns: pipe(
		string(),
		transform(splitBySpace),
		check(
			requireAtLeastOneValue,
			"Input parameter 'issue-references-in-subject-lines--patterns' must specify at least one value",
		),
		check(
			requireNoDuplicateValues,
			(issue) =>
				`Input parameter 'issue-references-in-subject-lines--patterns' must not contain duplicates: ${getDuplicateValues(
					issue.input,
				).join(" ")}`,
		),
	),
})

export type LegacyV1RawIssueReferencesInSubjectLinesConfiguration = InferInput<
	typeof legacyV1IssueReferencesInSubjectLinesConfigurationSchema
>

export type LegacyV1IssueReferencesInSubjectLinesConfiguration = InferOutput<
	typeof legacyV1IssueReferencesInSubjectLinesConfigurationSchema
>
