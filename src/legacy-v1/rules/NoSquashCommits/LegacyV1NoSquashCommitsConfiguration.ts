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
import { splitByComma } from "#legacy-v1/utilities/StringUtilities"

export const legacyV1NoSquashCommitsConfigurationSchema = object({
	disallowedPrefixes: pipe(
		string(),
		transform(splitByComma),
		check(
			requireAtLeastOneValue,
			"Input parameter 'no-squash-commits--disallowed-prefixes' must specify at least one value",
		),
		check(
			requireNoDuplicateValues,
			(issue) =>
				`Input parameter 'no-squash-commits--disallowed-prefixes' must not contain duplicates: ${getDuplicateValues(
					issue.input,
				).join(", ")}`,
		),
	),
})

export type LegacyV1RawNoSquashCommitsConfiguration = InferInput<
	typeof legacyV1NoSquashCommitsConfigurationSchema
>

export type LegacyV1NoSquashCommitsConfiguration = InferOutput<
	typeof legacyV1NoSquashCommitsConfigurationSchema
>
