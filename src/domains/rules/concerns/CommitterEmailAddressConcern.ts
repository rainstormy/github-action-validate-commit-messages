import type { RuleKey } from "#configurations/Configuration.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type CommitterEmailAddressConcern = {
	location: "committer-email-address"
	violatedRule: RuleKey
	commitSha: CommitSha
	characterRange: CharacterRange
}

export function committerEmailAddressConcern(
	violatedRule: RuleKey,
	commitSha: CommitSha,
	characterRange: CharacterRange,
): CommitterEmailAddressConcern {
	return {
		location: "committer-email-address",
		violatedRule,
		commitSha,
		characterRange,
	}
}
