import type { RuleKey } from "#configurations/Configuration.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type AuthorNameConcern = {
	location: "author-name"
	rule: RuleKey
	commit: CommitSha
	columns: CharacterRange
}

export function authorNameConcern(
	props: Omit<AuthorNameConcern, "location">,
): AuthorNameConcern {
	return { ...props, location: "author-name" }
}
