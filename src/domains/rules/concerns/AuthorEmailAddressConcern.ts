import type { RuleKey } from "#configurations/Configuration.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type AuthorEmailAddressConcern = {
	location: "author-email-address"
	rule: RuleKey
	commit: CommitSha
	range: CharacterRange
}

export function authorEmailAddressConcern(
	props: Omit<AuthorEmailAddressConcern, "location">,
): AuthorEmailAddressConcern {
	return { ...props, location: "author-email-address" }
}
