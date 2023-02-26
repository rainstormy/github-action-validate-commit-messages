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
import type { Configuration } from "./Configuration"

export function getAllApplicableRules(
	configuration: Configuration, // eslint-disable-line typescript/no-unused-vars -- The configuration is unused for now.
): ReadonlyArray<ApplicableRule> {
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
