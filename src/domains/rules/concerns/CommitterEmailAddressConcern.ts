import type { RuleContext } from "#rules/Rule.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type CommitterEmailAddressConcern = {
	location: "committer-email-address"
	rule: RuleContext
	commitSha: CommitSha
	range: CharacterRange
}

export function committerEmailAddressConcern(
	rule: RuleContext,
	commitSha: CommitSha,
	props: Pick<CommitterEmailAddressConcern, "range">,
): CommitterEmailAddressConcern {
	return { location: "committer-email-address", rule, commitSha, ...props }
}
