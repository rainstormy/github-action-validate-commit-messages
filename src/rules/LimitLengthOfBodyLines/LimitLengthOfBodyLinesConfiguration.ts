import { requirePositiveInteger } from "+utilities/StringUtilities"
import { z } from "zod"

export const limitLengthOfBodyLinesConfigurationSchema = z.object({
	maximumCharacters: z
		.string()
		.refine(requirePositiveInteger, (value) => ({
			message: `must be a positive integer: ${value}`,
			path: ["limit-length-of-body-lines--max-characters"],
		}))
		.transform((value) => Number.parseInt(value)),
})

export type RawLimitLengthOfBodyLinesConfiguration = z.input<
	typeof limitLengthOfBodyLinesConfigurationSchema
>

export type LimitLengthOfBodyLinesConfiguration = z.output<
	typeof limitLengthOfBodyLinesConfigurationSchema
>
