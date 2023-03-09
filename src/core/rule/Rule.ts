import type { Commit } from "+core"

export type Rule<Key extends string> = {
	readonly key: Key
	readonly validate: (commit: Commit) => Rule.Result
}

export namespace Rule {
	export type Result = "invalid" | "valid"
}

export function defineRule<Key extends string>(rule: Rule<Key>): Rule<Key> {
	return rule
}
