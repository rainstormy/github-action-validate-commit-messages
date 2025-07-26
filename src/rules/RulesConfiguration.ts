import { check, pipe, string, transform } from "valibot"
import { type RuleKeys, ruleKeys } from "#rules/Rule"
import {
	getDuplicateValues,
	getUnknownValues,
	requireAtLeastOneValue,
	requireNoDuplicateValues,
	requireNoUnknownValues,
} from "#utilities/IterableUtilities"
import { splitByComma } from "#utilities/StringUtilities"

export const ruleKeysConfigurationSchema = pipe(
	string(),
	transform(splitByComma),
	check(
		requireAtLeastOneValue,
		"Input parameter 'rules' must specify at least one value",
	),
	check(
		requireNoUnknownValues(ruleKeys),
		(issue) =>
			`Input parameter 'rules' must not contain unknown values: ${getUnknownValues(
				ruleKeys,
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
	transform((input) => input as RuleKeys),
)
