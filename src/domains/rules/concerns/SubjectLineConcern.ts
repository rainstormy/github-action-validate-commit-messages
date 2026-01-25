import type { RuleKey } from "#configurations/Configuration.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type SubjectLineConcern = {
	location: "subject-line"
	violatedRule: RuleKey
	commitSha: CommitSha
	characterRange: CharacterRange
}

export function subjectLineConcern(
	violatedRule: RuleKey,
	commitSha: CommitSha,
	characterRange: CharacterRange,
): SubjectLineConcern {
	return {
		location: "subject-line",
		violatedRule,
		commitSha,
		characterRange,
	}
}
