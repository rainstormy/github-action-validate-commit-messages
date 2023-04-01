import {
	getDuplicateValues,
	requireAtLeastOneValue,
	requireNoDuplicateValues,
	splitByComma,
} from "+utilities"
import { z } from "zod"

export const noSquashCommitsConfigurationSchema = z.object({
	disallowedPrefixes: z
		.string()
		.transform(splitByComma)
		.refine(requireAtLeastOneValue, {
			message: "must specify at least one value",
			path: ["no-squash-commits--disallowed-prefixes"],
		})
		.refine(requireNoDuplicateValues, (values) => ({
			message: `must not contain duplicates: ${getDuplicateValues(values).join(
				", ",
			)}`,
			path: ["no-squash-commits--disallowed-prefixes"],
		})),
})

export type RawNoSquashCommitsConfiguration = z.input<
	typeof noSquashCommitsConfigurationSchema
>

export type NoSquashCommitsConfiguration = z.output<
	typeof noSquashCommitsConfigurationSchema
>
