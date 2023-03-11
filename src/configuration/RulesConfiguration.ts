import type { RuleKey } from "+rules"
import { isRuleKey } from "+rules"
import { splitByComma } from "+utilities"
import { z } from "zod"

export const ruleKeysConfigurationSchema = z
	.string()
	.transform(splitByComma)
	.refine(hasAtLeastOneRuleKey, {
		message: "No rules specified",
	})
	.refine(hasNoDuplicatedRuleKeys, (keys) => ({
		message: `Duplicate rules: ${getDuplicatedRuleKeys(keys).join(", ")}`,
	}))
	.refine(hasNoUnknownRuleKeys, (keys) => ({
		message: `Unknown rules: ${getUnknownRuleKeys(keys).join(", ")}`,
	}))

function hasAtLeastOneRuleKey(keys: ReadonlyArray<string>): boolean {
	return keys.length > 0
}

function hasNoDuplicatedRuleKeys(keys: ReadonlyArray<string>): boolean {
	return new Set(keys).size === keys.length
}

function getDuplicatedRuleKeys(
	keys: ReadonlyArray<string>,
): ReadonlyArray<string> {
	return [...new Set(keys.filter((key, index) => keys.indexOf(key) !== index))]
}

function hasNoUnknownRuleKeys(
	keys: ReadonlyArray<string>,
): keys is ReadonlyArray<RuleKey> {
	return keys.every((key) => isRuleKey(key))
}

function getUnknownRuleKeys(
	keys: ReadonlyArray<string>,
): ReadonlyArray<string> {
	return [...new Set(keys.filter((key) => !isRuleKey(key)))]
}
