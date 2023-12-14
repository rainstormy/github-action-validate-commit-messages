import {
	getDuplicateValues,
	requireAtLeastOneValue,
	requireNoDuplicateValues,
} from "+utilities/IterableUtilities"
import { splitBySpace } from "+utilities/StringUtilities"
import { z } from "zod"

export const acknowledgedCommitterNamesConfigurationSchema = z.object({
	patterns: z
		.string()
		.transform(splitBySpace)
		.refine(requireAtLeastOneValue, {
			message: "must specify at least one value",
			path: ["acknowledged-committer-names--patterns"],
		})
		.refine(requireNoDuplicateValues, (values) => ({
			message: `must not contain duplicates: ${getDuplicateValues(values).join(
				" ",
			)}`,
			path: ["acknowledged-committer-names--patterns"],
		})),
})

export type RawAcknowledgedCommitterNamesConfiguration = z.input<
	typeof acknowledgedCommitterNamesConfigurationSchema
>

export type AcknowledgedCommitterNamesConfiguration = z.output<
	typeof acknowledgedCommitterNamesConfigurationSchema
>
