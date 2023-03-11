import { splitByComma } from "+utilities"
import { z } from "zod"

export const noSquashCommitsConfigurationSchema = z.object({
	disallowedPrefixes: z.string().transform(splitByComma),
})

export type NoSquashCommitsConfiguration = z.output<
	typeof noSquashCommitsConfigurationSchema
>
