import type { RuleKey } from "#rules/Rule.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type UserIdentityConcern = {
	location: "user-identity"
	rule: RuleKey
	commitSha: CommitSha
	field: "author:email" | "author:name" | "committer:email" | "committer:name"
}

export function userIdentityConcern(
	rule: RuleKey,
	commitSha: CommitSha,
	props: Pick<UserIdentityConcern, "field">,
): UserIdentityConcern {
	return { location: "user-identity", rule, commitSha, ...props }
}
