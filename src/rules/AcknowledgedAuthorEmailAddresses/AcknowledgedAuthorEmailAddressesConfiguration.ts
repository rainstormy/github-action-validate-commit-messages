import {
	getDuplicateValues,
	requireAtLeastOneValue,
	requireNoDuplicateValues,
} from "+utilities/IterableUtilities"
import { splitBySpace } from "+utilities/StringUtilities"
import {
	type InferInput,
	type InferOutput,
	check,
	object,
	pipe,
	string,
	transform,
} from "valibot"

export const acknowledgedAuthorEmailAddressesConfigurationSchema = object({
	patterns: pipe(
		string(),
		transform(splitBySpace),
		check(
			requireAtLeastOneValue,
			"Input parameter 'acknowledged-author-email-addresses--patterns' must specify at least one value",
		),
		check(
			requireNoDuplicateValues,
			(issue) =>
				`Input parameter 'acknowledged-author-email-addresses--patterns' must not contain duplicates: ${getDuplicateValues(
					issue.input,
				).join(" ")}`,
		),
	),
})

export type RawAcknowledgedAuthorEmailAddressesConfiguration = InferInput<
	typeof acknowledgedAuthorEmailAddressesConfigurationSchema
>

export type AcknowledgedAuthorEmailAddressesConfiguration = InferOutput<
	typeof acknowledgedAuthorEmailAddressesConfigurationSchema
>
