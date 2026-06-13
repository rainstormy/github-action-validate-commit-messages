import type { Commits } from "#commits/Commit.ts"
import { commitConcern } from "#rules/concerns/CommitConcern.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

const rule = "useSignedCommits" satisfies RuleKey

/**
 * Verifies that the commit has been signed cryptographically with a signing key.
 *
 * Signing commits protects authors from impersonation and helps to keep the commit history attributable.
 */
export function* useSignedCommits(
	commits: Commits,
	options: EmptyObject | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	for (const commit of commits) {
		if (!commit.hasSignature) {
			yield commitConcern(rule, commit.sha)
		}
	}
}
