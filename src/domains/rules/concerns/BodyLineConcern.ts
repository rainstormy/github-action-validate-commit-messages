import type { RuleKey } from "#configurations/Configuration.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type BodyLineConcern = {
	location: "body-line"
	violatedRule: RuleKey
	commitSha: CommitSha
	lineNumber: number
	characterRange: CharacterRange
}

export function bodyLineConcern(
	violatedRule: RuleKey,
	commitSha: CommitSha,
	lineNumber: number,
	characterRange: CharacterRange,
): BodyLineConcern {
	return {
		location: "body-line",
		violatedRule,
		commitSha,
		lineNumber,
		characterRange,
	}
}
