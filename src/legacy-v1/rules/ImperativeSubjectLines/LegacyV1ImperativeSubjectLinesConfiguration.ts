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
	requireNoDuplicateValues,
} from "#legacy-v1/utilities/IterableUtilities.ts"
import { splitByComma } from "#legacy-v1/utilities/StringUtilities.ts"

export const legacyV1ImperativeSubjectLinesConfigurationSchema = object({
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

export type LegacyV1RawImperativeSubjectLinesConfiguration = InferInput<
	typeof legacyV1ImperativeSubjectLinesConfigurationSchema
>

export type LegacyV1ImperativeSubjectLinesConfiguration = InferOutput<
	typeof legacyV1ImperativeSubjectLinesConfigurationSchema
>
