import type { RuleKey } from "#configurations/Configuration.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type SubjectLineConcern = {
	location: "subject-line"
	rule: RuleKey
	commit: CommitSha
	columns: CharacterRange
}

export function subjectLineConcern(
	props: Omit<SubjectLineConcern, "location">,
): SubjectLineConcern {
	return { ...props, location: "subject-line" }
}
