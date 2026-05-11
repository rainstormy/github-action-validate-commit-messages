import type { Commit, Commits } from "#commits/Commit.ts"
import { commitConcern } from "#rules/concerns/CommitConcern.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"
import { notNullish } from "#utilities/Arrays.ts"

const rule = "useSignedCommits" satisfies RuleKey

/**
 * Verifies that the commit has been signed cryptographically with a signing key.
 *
 * Signing commits protects authors from impersonation and helps to keep the commit history attributable.
 */
export function useSignedCommits(commits: Commits, options: EmptyObject | null): Concerns {
	return options !== null ? commits.map(verifyCommit).filter(notNullish) : []
}

function verifyCommit(commit: Commit): Concern | null {
	return commit.hasSignature ? null : commitConcern(rule, commit.sha)
}
