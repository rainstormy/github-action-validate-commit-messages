import { check, pipe, string, transform } from "valibot"
import {
	type LegacyV1RuleKeys,
	legacyV1RuleKeys,
} from "#legacy-v1/rules/LegacyV1Rule"
import {
	getDuplicateValues,
	getUnknownValues,
	requireAtLeastOneValue,
	requireNoDuplicateValues,
	requireNoUnknownValues,
} from "#legacy-v1/utilities/IterableUtilities"
import { splitByComma } from "#legacy-v1/utilities/StringUtilities"

export const legacyV1RuleKeysConfigurationSchema = pipe(
	string(),
	transform(splitByComma),
	check(
		requireAtLeastOneValue,
		"Input parameter 'rules' must specify at least one value",
	),
	check(
		requireNoUnknownValues(legacyV1RuleKeys),
		(issue) =>
			`Input parameter 'rules' must not contain unknown values: ${getUnknownValues(
				legacyV1RuleKeys,
				issue.input,
			).join(", ")}`,
	),
	check(
		requireNoDuplicateValues,
		(issue) =>
			`Input parameter 'rules' must not contain duplicates: ${getDuplicateValues(
				issue.input,
			).join(", ")}`,
	),
	transform((input) => input as LegacyV1RuleKeys),
)
