import {
	getDuplicateValues,
	requireAtLeastOneValue,
	requireNoDuplicateValues,
	splitBySpace,
} from "+utilities"
import { z } from "zod"

export const acknowledgedAuthorNamesConfigurationSchema = z.object({
	patterns: z
		.string()
		.transform(splitBySpace)
		.refine(requireAtLeastOneValue, {
			message: "must specify at least one value",
			path: ["acknowledged-author-names--patterns"],
		})
		.refine(requireNoDuplicateValues, (values) => ({
			message: `must not contain duplicates: ${getDuplicateValues(values).join(
				" ",
			)}`,
			path: ["acknowledged-author-names--patterns"],
		})),
})

export type RawAcknowledgedAuthorNamesConfiguration = z.input<
	typeof acknowledgedAuthorNamesConfigurationSchema
>

export type AcknowledgedAuthorNamesConfiguration = z.output<
	typeof acknowledgedAuthorNamesConfigurationSchema
>
