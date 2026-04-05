import type { RuleContext } from "#rules/Rule.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type SubjectLineConcern = {
	location: "subject-line"
	rule: RuleContext
	commitSha: CommitSha
	range: CharacterRange
}

export function subjectLineConcern(
	rule: RuleContext,
	commitSha: CommitSha,
	props: Pick<SubjectLineConcern, "range">,
): SubjectLineConcern {
	return { location: "subject-line", rule, commitSha, ...props }
}
