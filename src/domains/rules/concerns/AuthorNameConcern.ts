import type { RuleKey } from "#configurations/Configuration.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type AuthorNameConcern = {
	location: "author-name"
	violatedRule: RuleKey
	commitSha: CommitSha
	characterRange: CharacterRange
}

export function authorNameConcern(
	violatedRule: RuleKey,
	commitSha: CommitSha,
	characterRange: CharacterRange,
): AuthorNameConcern {
	return {
		location: "author-name",
		violatedRule,
		commitSha,
		characterRange,
	}
}
