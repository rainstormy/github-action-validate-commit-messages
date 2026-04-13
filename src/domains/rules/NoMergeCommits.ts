import type { Commit, Commits } from "#commits/Commit.ts"
import { commitConcern } from "#rules/concerns/CommitConcern.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import { type RuleContext, ruleContext } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"
import { notNullish } from "#utilities/Arrays.ts"

/**
 * Verifies that the commit has at most one parent commit, thus disallowing merge commits.
 *
 * Avoiding merge commits makes the commit history linear and preserves the ability to rebase interactively.
 * This helps to preserve the readability of the commit history and makes it easier to revert changes later.
 */
export function noMergeCommits(commits: Commits, options: EmptyObject | null): Concerns {
	if (options === null) {
		return []
	}

	const rule = ruleContext("noMergeCommits")
	return commits.map((commit) => verifyCommit(commit, rule)).filter(notNullish)
}

function verifyCommit(commit: Commit, rule: RuleContext): Concern | null {
	if (commit.isMergeCommit) {
		return commitConcern(rule, commit.sha)
	}

	return null
}
