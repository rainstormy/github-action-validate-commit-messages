import {
	check,
	type InferInput,
	type InferOutput,
	object,
	pipe,
	string,
	transform,
} from "valibot"
import { requirePositiveInteger } from "#legacy-v1/utilities/StringUtilities"

export const legacyV1LimitLengthOfBodyLinesConfigurationSchema = object({
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

export type LegacyV1RawLimitLengthOfBodyLinesConfiguration = InferInput<
	typeof legacyV1LimitLengthOfBodyLinesConfigurationSchema
>

export type LegacyV1LimitLengthOfBodyLinesConfiguration = InferOutput<
	typeof legacyV1LimitLengthOfBodyLinesConfigurationSchema
>
