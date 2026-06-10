import type { CommitSha } from "#types/CommitSha.ts"

export type CommitConcern = {
	location: "commit"
	rule: CommitConcernRuleKey
	commitSha: CommitSha
}

export type CommitConcernRuleKey =
	| "noExcessiveCommitsPerBranch"
	| "noMergeCommits"
	| "noRepeatedSubjectLines"
	| "useSignedCommits"

export function commitConcern(rule: CommitConcernRuleKey, commitSha: CommitSha): CommitConcern {
	return { location: "commit", rule, commitSha }
}
