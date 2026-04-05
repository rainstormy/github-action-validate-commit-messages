import type { RuleContext } from "#rules/Rule.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type AuthorNameConcern = {
	location: "author-name"
	rule: RuleContext
	commitSha: CommitSha
	range: CharacterRange
}

export function authorNameConcern(
	rule: RuleContext,
	commitSha: CommitSha,
	props: Pick<AuthorNameConcern, "range">,
): AuthorNameConcern {
	return { location: "author-name", rule, commitSha, ...props }
}
