import {
	type InferInput,
	type InferOutput,
	check,
	object,
	pipe,
	string,
	transform,
} from "valibot"
import { requirePositiveInteger } from "#legacy-v1/utilities/StringUtilities"

export const limitLengthOfSubjectLinesConfigurationSchema = object({
	maximumCharacters: pipe(
		string(),
		check(
			requirePositiveInteger,
			(issue) =>
				`Input parameter 'limit-length-of-subject-lines--max-characters' must be a positive integer: ${issue.input}`,
		),
		transform(Number.parseInt),
	),
})

export type RawLimitLengthOfSubjectLinesConfiguration = InferInput<
	typeof limitLengthOfSubjectLinesConfigurationSchema
>

export type LimitLengthOfSubjectLinesConfiguration = InferOutput<
	typeof limitLengthOfSubjectLinesConfigurationSchema
>
