import {
	type InferInput,
	type InferOutput,
	check,
	object,
	pipe,
	string,
	transform,
} from "valibot"
import {
	getDuplicateValues,
	requireAtLeastOneValue,
	requireNoDuplicateValues,
} from "#legacy-v1/utilities/IterableUtilities"
import { splitBySpace } from "#legacy-v1/utilities/StringUtilities"

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
