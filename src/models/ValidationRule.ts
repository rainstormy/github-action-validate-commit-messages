import type { Commit } from "./Commit"

export type ValidationRule<Key extends string> = {
	readonly key: Key
	readonly validate: (commit: Commit) => ValidationRule.Result
}

export namespace ValidationRule {
	export type Result = "invalid" | "valid"
}

export function defineValidationRule<Key extends string>(
	rule: ValidationRule<Key>,
): ValidationRule<Key> {
	return rule
}
