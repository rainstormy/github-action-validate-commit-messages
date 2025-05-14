import {
	getDuplicateValues,
	getUnknownValues,
	requireAtLeastOneValue,
	requireNoDuplicateValues,
	requireNoUnknownValues,
} from "+utilities/IterableUtilities"
import { splitByComma, splitBySpace } from "+utilities/StringUtilities"
import {
	type InferInput,
	type InferOutput,
	check,
	object,
	pipe,
	string,
	transform,
} from "valibot"

const issueReferencePositions = ["as-prefix", "as-suffix"] as const

export type IssueReferencePosition = (typeof issueReferencePositions)[number]
export type IssueReferencePositions = Array<IssueReferencePosition>

export const issueReferencesInSubjectLinesConfigurationSchema = object({
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
		transform((input) => input as IssueReferencePositions),
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

export type RawIssueReferencesInSubjectLinesConfiguration = InferInput<
	typeof issueReferencesInSubjectLinesConfigurationSchema
>

export type IssueReferencesInSubjectLinesConfiguration = InferOutput<
	typeof issueReferencesInSubjectLinesConfigurationSchema
>
