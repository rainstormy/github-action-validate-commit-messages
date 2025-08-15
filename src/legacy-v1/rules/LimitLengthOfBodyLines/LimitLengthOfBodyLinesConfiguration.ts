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

export const limitLengthOfBodyLinesConfigurationSchema = object({
	maximumCharacters: pipe(
		string(),
		check(
			requirePositiveInteger,
			(issue) =>
				`Input parameter 'limit-length-of-body-lines--max-characters' must be a positive integer: ${issue.input}`,
		),
		transform(Number.parseInt),
	),
})

export type RawLimitLengthOfBodyLinesConfiguration = InferInput<
	typeof limitLengthOfBodyLinesConfigurationSchema
>

export type LimitLengthOfBodyLinesConfiguration = InferOutput<
	typeof limitLengthOfBodyLinesConfigurationSchema
>
