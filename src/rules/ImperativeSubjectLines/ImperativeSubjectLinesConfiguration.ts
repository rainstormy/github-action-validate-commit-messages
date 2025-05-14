import {
	getDuplicateValues,
	requireNoDuplicateValues,
} from "+utilities/IterableUtilities"
import { splitByComma } from "+utilities/StringUtilities"
import {
	type InferInput,
	type InferOutput,
	check,
	object,
	pipe,
	string,
	transform,
} from "valibot"

export const imperativeSubjectLinesConfigurationSchema = object({
	whitelist: pipe(
		string(),
		transform(splitByComma),
		check(
			requireNoDuplicateValues,
			(issue) =>
				`Input parameter 'imperative-subject-lines--whitelist' must not contain duplicates: ${getDuplicateValues(
					issue.input,
				).join(", ")}`,
		),
	),
})

export type RawImperativeSubjectLinesConfiguration = InferInput<
	typeof imperativeSubjectLinesConfigurationSchema
>

export type ImperativeSubjectLinesConfiguration = InferOutput<
	typeof imperativeSubjectLinesConfigurationSchema
>
