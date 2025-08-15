import {
	type InferInput,
	type InferOutput,
	check,
	object,
	pipe,
	string,
	transform,
} from "valibot"
import {
	getDuplicateValues,
	requireNoDuplicateValues,
} from "#legacy-v1/utilities/IterableUtilities"
import { splitBySpace } from "#legacy-v1/utilities/StringUtilities"

export const legacyV1NoTrailingPunctuationInSubjectLinesConfigurationSchema =
	object({
		whitelist: pipe(
			string(),
			transform(splitBySpace),
			check(
				requireNoDuplicateValues,
				(issue) =>
					`Input parameter 'no-trailing-punctuation-in-subject-lines--whitelist' must not contain duplicates: ${getDuplicateValues(
						issue.input,
					).join(" ")}`,
			),
		),
	})

export type LegacyV1RawNoTrailingPunctuationInSubjectLinesConfiguration =
	InferInput<
		typeof legacyV1NoTrailingPunctuationInSubjectLinesConfigurationSchema
	>

export type LegacyV1NoTrailingPunctuationInSubjectLinesConfiguration =
	InferOutput<
		typeof legacyV1NoTrailingPunctuationInSubjectLinesConfigurationSchema
	>
