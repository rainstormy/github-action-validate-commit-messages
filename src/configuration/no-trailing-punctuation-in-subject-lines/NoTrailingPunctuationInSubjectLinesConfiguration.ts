import { splitBySpace } from "+utilities"
import { z } from "zod"

export const noTrailingPunctuationInSubjectLinesConfigurationSchema = z.object({
	customWhitelist: z.string().transform(splitBySpace),
})

export type NoTrailingPunctuationInSubjectLinesConfiguration = z.output<
	typeof noTrailingPunctuationInSubjectLinesConfigurationSchema
>
