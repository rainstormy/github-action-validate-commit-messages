import type { Configuration } from "+core"
import type { ApplicableRule, ApplicableRuleKey } from "+validation"
import { getAllApplicableRules } from "+validation"

export type Ruleset = ReadonlyArray<ApplicableRule>

type RulesetParserProps = {
	readonly rules: string
}

export type RulesetParser = {
	readonly parse: (props: RulesetParserProps) => RulesetParser.Result
}

export namespace RulesetParser {
	export type Result = Result.Invalid | Result.Valid

	export namespace Result {
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

const delimiters = /[ ,;]+/u

export function rulesetParserFrom(configuration: Configuration): RulesetParser {
	const allApplicableRules = getAllApplicableRules(configuration)

	return {
		parse: ({ rules }): RulesetParser.Result => {
			const keys = rules.split(delimiters).filter((key) => key.length > 0)

			const uniqueKeys = new Set(keys)

			if (uniqueKeys.size === 0) {
				return invalid("No rules specified")
			}

			if (uniqueKeys.size !== keys.length) {
				const duplicateKeysInOrderOfAppearance = new Set(
					keys.filter((key, index) => keys.indexOf(key) !== index),
				)

				return invalid(
					`Duplicate rules: ${[...duplicateKeysInOrderOfAppearance].join(
						", ",
					)}`,
				)
			}

			if (uniqueKeys.has("all")) {
				return uniqueKeys.size === 1
					? valid(allApplicableRules)
					: invalid("'all' cannot be combined with a specific set of rules")
			}

			const unknownKeysInOrderOfAppearance = keys.filter(
				(key) => !isApplicableRuleKey(key),
			)

			if (unknownKeysInOrderOfAppearance.length > 0) {
				return invalid(
					`Unknown rules: ${unknownKeysInOrderOfAppearance.join(", ")}`,
				)
			}

			return valid(
				allApplicableRules.filter((rule) => uniqueKeys.has(rule.key)),
			)
		},
	}

	function isApplicableRuleKey(key: string): key is ApplicableRuleKey {
		return allApplicableRules.some((rule) => rule.key === key)
	}
}

function invalid(errorMessage: string): RulesetParser.Result.Invalid {
	return { status: "invalid", errorMessage }
}

function valid(ruleset: Ruleset): RulesetParser.Result.Valid {
	return { status: "valid", ruleset }
}
