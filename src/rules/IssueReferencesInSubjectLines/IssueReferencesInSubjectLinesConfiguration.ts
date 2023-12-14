import {
	getDuplicateValues,
	getUnknownValues,
	requireAtLeastOneValue,
	requireNoDuplicateValues,
	requireNoUnknownValues,
} from "+utilities/IterableUtilities"
import { splitByComma, splitBySpace } from "+utilities/StringUtilities"
import { z } from "zod"

const issueReferencePositions = ["as-prefix", "as-suffix"] as const

export type IssueReferencePosition = (typeof issueReferencePositions)[number]

export const issueReferencesInSubjectLinesConfigurationSchema = z.object({
	allowedPositions: z
		.string()
		.transform(splitByComma)
		.refine(requireAtLeastOneValue, {
			message: "must specify at least one value",
			path: ["issue-references-in-subject-lines--allowed-positions"],
		})
		.refine(requireNoDuplicateValues, (values) => ({
			message: `must not contain duplicates: ${getDuplicateValues(values).join(
				", ",
			)}`,
			path: ["issue-references-in-subject-lines--allowed-positions"],
		}))
		.refine(requireNoUnknownValues(issueReferencePositions), (values) => ({
			message: `must not contain unknown values: ${getUnknownValues(
				issueReferencePositions,
				values,
			).join(", ")}`,
			path: ["issue-references-in-subject-lines--allowed-positions"],
		})),
	patterns: z
		.string()
		.transform(splitBySpace)
		.refine(requireAtLeastOneValue, {
			message: "must specify at least one value",
			path: ["issue-references-in-subject-lines--patterns"],
		})
		.refine(requireNoDuplicateValues, (values) => ({
			message: `must not contain duplicates: ${getDuplicateValues(values).join(
				" ",
			)}`,
			path: ["issue-references-in-subject-lines--patterns"],
		})),
})

export type RawIssueReferencesInSubjectLinesConfiguration = z.input<
	typeof issueReferencesInSubjectLinesConfigurationSchema
>

export type IssueReferencesInSubjectLinesConfiguration = z.output<
	typeof issueReferencesInSubjectLinesConfigurationSchema
>
