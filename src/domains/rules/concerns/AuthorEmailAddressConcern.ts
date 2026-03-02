import type { RuleKey } from "#configurations/Configuration.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type AuthorEmailAddressConcern = {
	location: "author-email-address"
	violatedRule: RuleKey
	commitSha: CommitSha
	characterRange: CharacterRange
}

export function authorEmailAddressConcern(
	violatedRule: RuleKey,
	commitSha: CommitSha,
	characterRange: CharacterRange,
): AuthorEmailAddressConcern {
	return {
		location: "author-email-address",
		violatedRule,
		commitSha,
		characterRange,
	}
}
