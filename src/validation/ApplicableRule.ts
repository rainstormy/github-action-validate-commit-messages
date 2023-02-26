import {
	requireCapitalisedSubjectLines,
	requireNonFixupCommits,
	requireNonMergeCommits,
	requireNonSquashCommits,
} from "+rules"

export const allApplicableRules = [
	requireCapitalisedSubjectLines,
	requireNonFixupCommits,
	requireNonSquashCommits,
	requireNonMergeCommits,
] as const

export type ApplicableRule = (typeof allApplicableRules)[number]
export type ApplicableRuleKey = ApplicableRule["key"]
