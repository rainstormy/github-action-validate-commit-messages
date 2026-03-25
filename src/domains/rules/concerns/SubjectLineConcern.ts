import type { RuleKey } from "#configurations/Configuration.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type SubjectLineConcern = {
	location: "subject-line"
	rule: RuleKey
	commitSha: CommitSha
	range: CharacterRange
}

export function subjectLineConcern(
	rule: RuleKey,
	commitSha: CommitSha,
	props: Pick<SubjectLineConcern, "range">,
): SubjectLineConcern {
	return { location: "subject-line", rule, commitSha, ...props }
}
