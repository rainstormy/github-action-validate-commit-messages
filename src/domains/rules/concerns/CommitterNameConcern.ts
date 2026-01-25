import type { RuleKey } from "#configurations/Configuration.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type CommitterNameConcern = {
	location: "committer-name"
	violatedRule: RuleKey
	commitSha: CommitSha
	characterRange: CharacterRange
}

export function committerNameConcern(
	violatedRule: RuleKey,
	commitSha: CommitSha,
	characterRange: CharacterRange,
): CommitterNameConcern {
	return {
		location: "committer-name",
		violatedRule,
		commitSha,
		characterRange,
	}
}
