import type { Configuration } from "+core"
import type {
	CapitalisedSubjectLines,
	NoFixupCommits,
	NoMergeCommits,
	NoSquashCommits,
	NoTrailingPunctuationInSubjectLines,
} from "+rules"
import {
	capitalisedSubjectLines,
	noFixupCommits,
	noMergeCommits,
	noSquashCommits,
	noTrailingPunctuationInSubjectLines,
} from "+rules"

export function getAllApplicableRules(
	configuration: Configuration,
): ReadonlyArray<ApplicableRule> {
	return [
		capitalisedSubjectLines(),
		noFixupCommits(),
		noSquashCommits(),
		noMergeCommits(),
		noTrailingPunctuationInSubjectLines(configuration),
	]
}

export type ApplicableRule =
	| CapitalisedSubjectLines
	| NoFixupCommits
	| NoMergeCommits
	| NoSquashCommits
	| NoTrailingPunctuationInSubjectLines

export type ApplicableRuleKey = ApplicableRule["key"]
