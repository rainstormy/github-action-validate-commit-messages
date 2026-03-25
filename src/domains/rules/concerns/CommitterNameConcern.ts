import type { RuleKey } from "#configurations/Configuration.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type CommitterNameConcern = {
	location: "committer-name"
	rule: RuleKey
	commitSha: CommitSha
	range: CharacterRange
}

export function committerNameConcern(
	rule: RuleKey,
	commitSha: CommitSha,
	props: Pick<CommitterNameConcern, "range">,
): CommitterNameConcern {
	return { location: "committer-name", rule, commitSha, ...props }
}
