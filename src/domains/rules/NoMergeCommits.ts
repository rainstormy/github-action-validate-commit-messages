import type { Commit, Commits } from "#commits/Commit.ts"
import { commitConcern } from "#rules/concerns/CommitConcern.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"
import { notNullish } from "#utilities/Arrays.ts"

const rule = "noMergeCommits" satisfies RuleKey

/**
 * Verifies that the commit has at most one parent commit, thus disallowing merge commits.
 *
 * Avoiding merge commits makes the commit history linear and preserves the ability to rebase interactively.
 * This helps to preserve the readability of the commit history and makes it easier to revert changes later.
 */
export function noMergeCommits(commits: Commits, options: EmptyObject | null): Concerns {
	return options !== null ? commits.map(verifyCommit).filter(notNullish) : []
}

function verifyCommit(commit: Commit): Concern | null {
	return commit.isMergeCommit ? commitConcern(rule, commit.sha) : null
}
