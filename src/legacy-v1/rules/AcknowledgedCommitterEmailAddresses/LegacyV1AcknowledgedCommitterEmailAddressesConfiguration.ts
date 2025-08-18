import {
	check,
	type InferInput,
	type InferOutput,
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

export const legacyV1AcknowledgedCommitterEmailAddressesConfigurationSchema =
	object({
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

export type LegacyV1RawAcknowledgedCommitterEmailAddressesConfiguration =
	InferInput<
		typeof legacyV1AcknowledgedCommitterEmailAddressesConfigurationSchema
	>

export type LegacyV1AcknowledgedCommitterEmailAddressesConfiguration =
	InferOutput<
		typeof legacyV1AcknowledgedCommitterEmailAddressesConfigurationSchema
	>
