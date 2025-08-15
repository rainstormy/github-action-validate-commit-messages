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

export const noTrailingPunctuationInSubjectLinesConfigurationSchema = object({
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

export type RawNoTrailingPunctuationInSubjectLinesConfiguration = InferInput<
	typeof noTrailingPunctuationInSubjectLinesConfigurationSchema
>

export type NoTrailingPunctuationInSubjectLinesConfiguration = InferOutput<
	typeof noTrailingPunctuationInSubjectLinesConfigurationSchema
>
