import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type SubjectLineConcern = {
	location: "subject-line"
	rule: SubjectLineConcernRuleKey
	commitSha: CommitSha
	range: CharacterRange
}

export type SubjectLineConcernRuleKey =
	| "noBlankSubjectLines"
	| "noRevertRevertCommits"
	| "noSingleWordSubjectLines"
	| "noSquashMarkers"
	| "noUnexpectedPunctuation"
	| "noUnexpectedWhitespace"
	| "useCapitalisedSubjectLines"
	| "useConciseSubjectLines"
	| "useImperativeSubjectLines"
	| "useIssueLinks"

export function subjectLineConcern(
	rule: SubjectLineConcernRuleKey,
	commitSha: CommitSha,
	props: Pick<SubjectLineConcern, "range">,
): SubjectLineConcern {
	return { location: "subject-line", rule, commitSha, ...props }
}
