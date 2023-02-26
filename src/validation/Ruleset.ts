import type { ApplicableRule, ApplicableRuleKey } from "+validation"
import { allApplicableRules } from "+validation"

export type Ruleset = ReadonlyArray<ApplicableRule>

export namespace Ruleset {
	export type ParseResult = ParseResult.Invalid | ParseResult.Valid

	export namespace ParseResult {
		export type Valid = {
			readonly status: "valid"
			readonly ruleset: Ruleset
		}

		export type Invalid = {
			readonly status: "invalid"
			readonly errorMessage: string
		}
	}
}

export function rulesetFromString(
	commaSeparatedKeys: string,
): Ruleset.ParseResult {
	const keys = commaSeparatedKeys
		.split(",")
		.map((key) => key.trim())
		.filter((key) => key.length > 0)

	const uniqueKeys = new Set(keys)

	if (uniqueKeys.size === 0) {
		return {
			status: "invalid",
			errorMessage: "No rules specified",
		}
	}

	if (uniqueKeys.size !== keys.length) {
		const duplicateKeysInOrderOfAppearance = new Set(
			keys.filter((key, index) => keys.indexOf(key) !== index),
		)

		return {
			status: "invalid",
			errorMessage: `Duplicate rules: ${[
				...duplicateKeysInOrderOfAppearance,
			].join(", ")}`,
		}
	}

	if (uniqueKeys.has("all")) {
		return uniqueKeys.size === 1
			? {
					status: "valid",
					ruleset: allApplicableRules,
			  }
			: {
					status: "invalid",
					errorMessage: "'all' cannot be combined with a specific set of rules",
			  }
	}

	const unknownKeysInOrderOfAppearance = keys.filter(
		(key) => !isApplicableRuleKey(key),
	)

	if (unknownKeysInOrderOfAppearance.length > 0) {
		return {
			status: "invalid",
			errorMessage: `Unknown rules: ${unknownKeysInOrderOfAppearance.join(
				", ",
			)}`,
		}
	}

	return {
		status: "valid",
		ruleset: allApplicableRules.filter((rule) => uniqueKeys.has(rule.key)),
	}
}

function isApplicableRuleKey(key: string): key is ApplicableRuleKey {
	return allApplicableRules.some((rule) => rule.key === key)
}
