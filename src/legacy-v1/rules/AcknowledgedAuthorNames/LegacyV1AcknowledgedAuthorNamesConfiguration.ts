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
} from "#legacy-v1/utilities/IterableUtilities.ts"
import { splitBySpace } from "#legacy-v1/utilities/StringUtilities.ts"

export const legacyV1AcknowledgedAuthorNamesConfigurationSchema = object({
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

export type LegacyV1RawAcknowledgedAuthorNamesConfiguration = InferInput<
	typeof legacyV1AcknowledgedAuthorNamesConfigurationSchema
>

export type LegacyV1AcknowledgedAuthorNamesConfiguration = InferOutput<
	typeof legacyV1AcknowledgedAuthorNamesConfigurationSchema
>
