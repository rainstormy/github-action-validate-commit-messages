import type { RuleKey } from "#configurations/Configuration.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type CommitterNameConcern = {
	location: "committer-name"
	rule: RuleKey
	commit: CommitSha
	range: CharacterRange
}

export function committerNameConcern(
	props: Omit<CommitterNameConcern, "location">,
): CommitterNameConcern {
	return { ...props, location: "committer-name" }
}
