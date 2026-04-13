import type { RuleContext } from "#rules/Rule.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type CommitConcern = {
	location: "commit"
	rule: RuleContext
	commitSha: CommitSha
}

export function commitConcern(rule: RuleContext, commitSha: CommitSha): CommitConcern {
	return { location: "commit", rule, commitSha }
}
