import type { Commit, CommitRefiner } from "+rules"

export const ruleKeys = [
	"capitalised-subject-lines",
	"empty-line-after-subject-lines",
	"imperative-subject-lines",
	"issue-references-in-subject-lines",
	"limit-line-lengths",
	"multi-word-subject-lines",
	"no-inappropriate-whitespace",
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
