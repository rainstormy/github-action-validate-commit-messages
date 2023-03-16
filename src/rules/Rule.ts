import type { Commit, CommitRefiner } from "+rules"

export const ruleKeys = [
	"capitalised-subject-lines",
	"imperative-subject-lines",
	"issue-references-in-subject-lines",
	"multi-word-subject-lines",
	"no-merge-commits",
	"no-squash-commits",
	"no-trailing-punctuation-in-subject-lines",
] as const

export type RuleKey = (typeof ruleKeys)[number]

export type Rule = {
	readonly key: RuleKey
	readonly refine?: CommitRefiner
	readonly validate: (commit: Commit) => "invalid" | "valid"
}
