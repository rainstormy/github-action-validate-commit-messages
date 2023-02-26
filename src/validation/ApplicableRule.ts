import type {
	CapitalisedSubjectLines,
	NoFixupCommits,
	NoMergeCommits,
	NoSquashCommits,
} from "+rules"
import {
	capitalisedSubjectLines,
	noFixupCommits,
	noMergeCommits,
	noSquashCommits,
} from "+rules"

export function getAllApplicableRules(): ReadonlyArray<ApplicableRule> {
	return [
		capitalisedSubjectLines(),
		noFixupCommits(),
		noSquashCommits(),
		noMergeCommits(),
	]
}

export type ApplicableRule =
	| CapitalisedSubjectLines
	| NoFixupCommits
	| NoMergeCommits
	| NoSquashCommits

export type ApplicableRuleKey = ApplicableRule["key"]
