import type { CommitSha } from "#types/CommitSha.ts"

export type UserIdentityConcern = {
	location: "user-identity"
	rule: UserIdentityConcernRuleKey
	commitSha: CommitSha
	field: "author:email" | "author:name" | "committer:email" | "committer:name"
}

export type UserIdentityConcernRuleKey =
	| "useAuthorEmailPatterns"
	| "useAuthorNamePatterns"
	| "useCommitterEmailPatterns"
	| "useCommitterNamePatterns"

export function userIdentityConcern(
	rule: UserIdentityConcernRuleKey,
	commitSha: CommitSha,
	props: Pick<UserIdentityConcern, "field">,
): UserIdentityConcern {
	return { location: "user-identity", rule, commitSha, ...props }
}
