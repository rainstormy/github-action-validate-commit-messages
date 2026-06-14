import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type SubjectLineConcern = {
	location: "subject-line"
	key: `${CommitSha}:C${CharacterRange[0]}-${CharacterRange[1]}:${SubjectLineConcernRuleKey}`
	rule: SubjectLineConcernRuleKey
	commitSha: CommitSha
	range: CharacterRange
}

export type SubjectLineConcernRuleKey =
	| "noBlankSubjectLines"
	| "noExcessiveWhitespace"
	| "noRevertRevertCommits"
	| "noSingleWordSubjectLines"
	| "noSquashMarkers"
	| "noUnexpectedPunctuation"
	| "useCapitalisedSubjectLines"
	| "useConciseSubjectLines"
	| "useImperativeSubjectLines"
	| "useIssueLinks"

export function subjectLineConcern(
	rule: SubjectLineConcernRuleKey,
	commitSha: CommitSha,
	props: Pick<SubjectLineConcern, "range">,
): SubjectLineConcern {
	return {
		location: "subject-line",
		key: `${commitSha}:C${props.range[0]}-${props.range[1]}:${rule}`,
		rule,
		commitSha,
		...props,
	}
}
