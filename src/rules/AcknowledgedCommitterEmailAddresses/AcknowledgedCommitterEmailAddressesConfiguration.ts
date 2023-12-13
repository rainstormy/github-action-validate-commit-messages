import {
	getDuplicateValues,
	requireAtLeastOneValue,
	requireNoDuplicateValues,
} from "+utilities/IterableUtilities"
import { splitBySpace } from "+utilities/StringUtilities"
import { z } from "zod"

export const acknowledgedCommitterEmailAddressesConfigurationSchema = z.object({
	patterns: z
		.string()
		.transform(splitBySpace)
		.refine(requireAtLeastOneValue, {
			message: "must specify at least one value",
			path: ["acknowledged-committer-email-addresses--patterns"],
		})
		.refine(requireNoDuplicateValues, (values) => ({
			message: `must not contain duplicates: ${getDuplicateValues(values).join(
				" ",
			)}`,
			path: ["acknowledged-committer-email-addresses--patterns"],
		})),
})

export type RawAcknowledgedCommitterEmailAddressesConfiguration = z.input<
	typeof acknowledgedCommitterEmailAddressesConfigurationSchema
>

export type AcknowledgedCommitterEmailAddressesConfiguration = z.output<
	typeof acknowledgedCommitterEmailAddressesConfigurationSchema
>
