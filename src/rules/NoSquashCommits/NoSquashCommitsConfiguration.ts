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
} from "#utilities/IterableUtilities"
import { splitByComma } from "#utilities/StringUtilities"

export const noSquashCommitsConfigurationSchema = object({
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

export type RawNoSquashCommitsConfiguration = InferInput<
	typeof noSquashCommitsConfigurationSchema
>

export type NoSquashCommitsConfiguration = InferOutput<
	typeof noSquashCommitsConfigurationSchema
>
