import { requirePositiveInteger } from "+utilities"
import { z } from "zod"

export const limitLengthOfSubjectLinesConfigurationSchema = z.object({
	maximumCharacters: z
		.string()
		.refine(requirePositiveInteger, (value) => ({
			message: `must be a positive integer: ${value}`,
			path: ["limit-length-of-subject-lines--max-characters"],
		}))
		.transform((value) => Number.parseInt(value)),
})

export type RawLimitLengthOfSubjectLinesConfiguration = z.input<
	typeof limitLengthOfSubjectLinesConfigurationSchema
>

export type LimitLengthOfSubjectLinesConfiguration = z.output<
	typeof limitLengthOfSubjectLinesConfigurationSchema
>
