import {
	getDuplicateValues,
	requireNoDuplicateValues,
} from "+utilities/IterableUtilities"
import { splitByComma } from "+utilities/StringUtilities"
import { z } from "zod"

export const imperativeSubjectLinesConfigurationSchema = z.object({
	whitelist: z
		.string()
		.transform(splitByComma)
		.refine(requireNoDuplicateValues, (words) => ({
			message: `must not contain duplicates: ${getDuplicateValues(words).join(
				", ",
			)}`,
			path: ["imperative-subject-lines--whitelist"],
		})),
})

export type RawImperativeSubjectLinesConfiguration = z.input<
	typeof imperativeSubjectLinesConfigurationSchema
>

export type ImperativeSubjectLinesConfiguration = z.output<
	typeof imperativeSubjectLinesConfigurationSchema
>
