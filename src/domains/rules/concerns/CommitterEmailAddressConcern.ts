import type { RuleKey } from "#configurations/Configuration.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type CommitterEmailAddressConcern = {
	location: "committer-email-address"
	rule: RuleKey
	commit: CommitSha
	range: CharacterRange
}

export function committerEmailAddressConcern(
	props: Omit<CommitterEmailAddressConcern, "location">,
): CommitterEmailAddressConcern {
	return { ...props, location: "committer-email-address" }
}
