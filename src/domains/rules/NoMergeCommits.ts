import type { Commits } from "#commits/Commit.ts"
import { commitConcern } from "#rules/concerns/CommitConcern.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

const rule = "noMergeCommits" satisfies RuleKey

/**
 * Verifies that the commit has at most one parent commit, thus disallowing merge commits.
 *
 * Avoiding merge commits makes the commit history linear and preserves the ability to rebase interactively.
 * This helps to preserve the readability of the commit history and makes it easier to revert changes later.
 */
export function* noMergeCommits(commits: Commits, options: EmptyObject | null): Generator<Concern> {
	if (options === null) {
		return
	}

	for (const commit of commits) {
		if (commit.isMergeCommit) {
			yield commitConcern(rule, commit.sha)
		}
	}
}
