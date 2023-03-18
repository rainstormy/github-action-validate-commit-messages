import { z } from "zod"

export const limitLineLengthsConfigurationSchema = z.object({
	maximumCharactersInBodyLine: z.string().pipe(
		z.coerce
			.number({
				required_error: "must be a non-negative integer",
				invalid_type_error: "must be a non-negative integer",
			})
			.int({ message: "must be a non-negative integer" })
			.min(0, { message: "must be a non-negative integer" }),
	),
	maximumCharactersInSubjectLine: z.string().pipe(
		z.coerce
			.number({
				required_error: "must be a non-negative integer",
				invalid_type_error: "must be a non-negative integer",
			})
			.int({ message: "must be a non-negative integer" })
			.min(0, { message: "must be a non-negative integer" }),
	),
})

export type RawLimitLineLengthsConfiguration = z.input<
	typeof limitLineLengthsConfigurationSchema
>

export type LimitLineLengthsConfiguration = z.output<
	typeof limitLineLengthsConfigurationSchema
>
