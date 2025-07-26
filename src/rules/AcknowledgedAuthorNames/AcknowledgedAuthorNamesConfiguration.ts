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
import { splitBySpace } from "#utilities/StringUtilities"

export const acknowledgedAuthorNamesConfigurationSchema = object({
	patterns: pipe(
		string(),
		transform(splitBySpace),
		check(
			requireAtLeastOneValue,
			"Input parameter 'acknowledged-author-names--patterns' must specify at least one value",
		),
		check(
			requireNoDuplicateValues,
			(issue) =>
				`Input parameter 'acknowledged-author-names--patterns' must not contain duplicates: ${getDuplicateValues(
					issue.input,
				).join(" ")}`,
		),
	),
})

export type RawAcknowledgedAuthorNamesConfiguration = InferInput<
	typeof acknowledgedAuthorNamesConfigurationSchema
>

export type AcknowledgedAuthorNamesConfiguration = InferOutput<
	typeof acknowledgedAuthorNamesConfigurationSchema
>
