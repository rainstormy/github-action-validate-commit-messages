import type { RuleContext } from "#rules/Rule.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type CommitterNameConcern = {
	location: "committer-name"
	rule: RuleContext
	commitSha: CommitSha
	range: CharacterRange
}

export function committerNameConcern(
	rule: RuleContext,
	commitSha: CommitSha,
	props: Pick<CommitterNameConcern, "range">,
): CommitterNameConcern {
	return { location: "committer-name", rule, commitSha, ...props }
}
