import { ruleKeys } from "+rules"
import {
	getDuplicateValues,
	getUnknownValues,
	requireAtLeastOneValue,
	requireNoDuplicateValues,
	requireNoUnknownValues,
	splitByComma,
} from "+utilities"
import { z } from "zod"

export const ruleKeysConfigurationSchema = z
	.string()
	.transform(splitByComma)
	.refine(requireAtLeastOneValue, {
		message: "must specify at least one value",
		path: ["rules"],
	})
	.refine(requireNoDuplicateValues, (values) => ({
		message: `must not contain duplicates: ${getDuplicateValues(values).join(
			", ",
		)}`,
		path: ["rules"],
	}))
	.refine(requireNoUnknownValues(ruleKeys), (values) => ({
		message: `must not contain unknown values: ${getUnknownValues(
			ruleKeys,
			values,
		).join(", ")}`,
		path: ["rules"],
	}))
