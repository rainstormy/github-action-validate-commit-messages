import {
	getDuplicateValues,
	requireAtLeastOneValue,
	requireNoDuplicateValues,
} from "+utilities/IterableUtilities"
import { splitBySpace } from "+utilities/StringUtilities"
import { z } from "zod"

export const acknowledgedAuthorEmailAddressesConfigurationSchema = z.object({
	patterns: z
		.string()
		.transform(splitBySpace)
		.refine(requireAtLeastOneValue, {
			message: "must specify at least one value",
			path: ["acknowledged-author-email-addresses--patterns"],
		})
		.refine(requireNoDuplicateValues, (values) => ({
			message: `must not contain duplicates: ${getDuplicateValues(values).join(
				" ",
			)}`,
			path: ["acknowledged-author-email-addresses--patterns"],
		})),
})

export type RawAcknowledgedAuthorEmailAddressesConfiguration = z.input<
	typeof acknowledgedAuthorEmailAddressesConfigurationSchema
>

export type AcknowledgedAuthorEmailAddressesConfiguration = z.output<
	typeof acknowledgedAuthorEmailAddressesConfigurationSchema
>
