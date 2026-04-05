import type { RuleContext } from "#rules/Rule.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type AuthorEmailAddressConcern = {
	location: "author-email-address"
	rule: RuleContext
	commitSha: CommitSha
	range: CharacterRange
}

export function authorEmailAddressConcern(
	rule: RuleContext,
	commitSha: CommitSha,
	props: Pick<AuthorEmailAddressConcern, "range">,
): AuthorEmailAddressConcern {
	return { location: "author-email-address", rule, commitSha, ...props }
}
