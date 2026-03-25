import type { RuleKey } from "#configurations/Configuration.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type CommitterEmailAddressConcern = {
	location: "committer-email-address"
	rule: RuleKey
	commitSha: CommitSha
	range: CharacterRange
}

export function committerEmailAddressConcern(
	rule: RuleKey,
	commitSha: CommitSha,
	props: Pick<CommitterEmailAddressConcern, "range">,
): CommitterEmailAddressConcern {
	return { location: "committer-email-address", rule, commitSha, ...props }
}
