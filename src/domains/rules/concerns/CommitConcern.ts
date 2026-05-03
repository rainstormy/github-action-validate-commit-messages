import type { RuleKey } from "#rules/Rule.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type CommitConcern = {
	location: "commit"
	rule: RuleKey
	commitSha: CommitSha
}

export function commitConcern(rule: RuleKey, commitSha: CommitSha): CommitConcern {
	return { location: "commit", rule, commitSha }
}
