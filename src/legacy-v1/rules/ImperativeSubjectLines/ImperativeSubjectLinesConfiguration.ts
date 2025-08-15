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
import { splitByComma } from "#legacy-v1/utilities/StringUtilities"

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
