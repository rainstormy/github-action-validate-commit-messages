import type {
	RequireCapitalisedSubjectLines,
	RequireNonFixupCommits,
	RequireNonMergeCommits,
	RequireNonSquashCommits,
} from "+rules"
import {
	requireCapitalisedSubjectLines,
	requireNonFixupCommits,
	requireNonMergeCommits,
	requireNonSquashCommits,
} from "+rules"

export function getAllApplicableRules(): ReadonlyArray<ApplicableRule> {
	return [
		requireCapitalisedSubjectLines(),
		requireNonFixupCommits(),
		requireNonSquashCommits(),
		requireNonMergeCommits(),
	]
}

export type ApplicableRule =
	| RequireCapitalisedSubjectLines
	| RequireNonFixupCommits
	| RequireNonMergeCommits
	| RequireNonSquashCommits

export type ApplicableRuleKey = ApplicableRule["key"]
