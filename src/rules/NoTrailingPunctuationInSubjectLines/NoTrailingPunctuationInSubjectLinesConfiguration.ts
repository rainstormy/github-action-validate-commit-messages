import {
	getDuplicateValues,
	requireNoDuplicateValues,
} from "+utilities/IterableUtilities"
import { splitBySpace } from "+utilities/StringUtilities"
import { z } from "zod"

export const noTrailingPunctuationInSubjectLinesConfigurationSchema = z.object({
	whitelist: z
		.string()
		.transform(splitBySpace)
		.refine(requireNoDuplicateValues, (suffixes) => ({
			message: `must not contain duplicates: ${getDuplicateValues(
				suffixes,
			).join(" ")}`,
			path: ["no-trailing-punctuation-in-subject-lines--whitelist"],
		})),
})

export type RawNoTrailingPunctuationInSubjectLinesConfiguration = z.input<
	typeof noTrailingPunctuationInSubjectLinesConfigurationSchema
>

export type NoTrailingPunctuationInSubjectLinesConfiguration = z.output<
	typeof noTrailingPunctuationInSubjectLinesConfigurationSchema
>
