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

export const acknowledgedCommitterEmailAddressesConfigurationSchema = object({
	patterns: pipe(
		string(),
		transform(splitBySpace),
		check(
			requireAtLeastOneValue,
			"Input parameter 'acknowledged-committer-email-addresses--patterns' must specify at least one value",
		),
		check(
			requireNoDuplicateValues,
			(issue) =>
				`Input parameter 'acknowledged-committer-email-addresses--patterns' must not contain duplicates: ${getDuplicateValues(
					issue.input,
				).join(" ")}`,
		),
	),
})

export type RawAcknowledgedCommitterEmailAddressesConfiguration = InferInput<
	typeof acknowledgedCommitterEmailAddressesConfigurationSchema
>

export type AcknowledgedCommitterEmailAddressesConfiguration = InferOutput<
	typeof acknowledgedCommitterEmailAddressesConfigurationSchema
>
