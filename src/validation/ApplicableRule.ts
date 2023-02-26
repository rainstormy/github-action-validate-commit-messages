import {
	requireNonFixupCommits,
	requireNonMergeCommits,
	requireNonSquashCommits,
} from "+rules"

export const allApplicableRules = [
	requireNonFixupCommits,
	requireNonSquashCommits,
	requireNonMergeCommits,
] as const

export type ApplicableRule = (typeof allApplicableRules)[number]
export type ApplicableRuleKey = ApplicableRule["key"]
