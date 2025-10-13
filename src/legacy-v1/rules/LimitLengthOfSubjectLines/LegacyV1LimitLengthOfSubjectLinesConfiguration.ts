import {
	check,
	type InferInput,
	type InferOutput,
	object,
	pipe,
	string,
	transform,
} from "valibot"
import { requirePositiveInteger } from "#legacy-v1/utilities/StringUtilities.ts"

export const legacyV1LimitLengthOfSubjectLinesConfigurationSchema = object({
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

export type LegacyV1RawLimitLengthOfSubjectLinesConfiguration = InferInput<
	typeof legacyV1LimitLengthOfSubjectLinesConfigurationSchema
>

export type LegacyV1LimitLengthOfSubjectLinesConfiguration = InferOutput<
	typeof legacyV1LimitLengthOfSubjectLinesConfigurationSchema
>
