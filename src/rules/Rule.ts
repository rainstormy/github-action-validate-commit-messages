import type { Commit } from "+commits"

export const ruleKeys = [
	"capitalised-subject-lines",
	"no-merge-commits",
	"no-squash-commits",
	"no-trailing-punctuation-in-subject-lines",
] as const

export function isRuleKey(key: string): key is RuleKey {
	return (ruleKeys as ReadonlyArray<string>).includes(key)
}

export type RuleKey = (typeof ruleKeys)[number]

export type Rule = {
	readonly key: RuleKey
	readonly validate: (commit: Commit) => "invalid" | "valid"
}
