import type { RuleKey } from "#rules/Rule.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type AuthorNameConcern = {
	location: "author-name"
	rule: RuleKey
	commitSha: CommitSha
	range: CharacterRange
}

export function authorNameConcern(
	rule: RuleKey,
	commitSha: CommitSha,
	props: Pick<AuthorNameConcern, "range">,
): AuthorNameConcern {
	return { location: "author-name", rule, commitSha, ...props }
}
