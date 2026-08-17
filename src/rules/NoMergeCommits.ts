import type { Commits } from "#commits/Commit.ts"
import type { RuleKey, RulesetConfiguration } from "#configurations/RulesetConfiguration.ts"
import { commitConcern } from "#rules/concerns/CommitConcern.ts"
import type { Concern } from "#rules/concerns/Concern.ts"

/**
 * Verifies that the commit has at most one parent commit, thus disallowing merge commits.
 *
 * Avoiding merge commits makes the commit history linear and preserves the ability to rebase interactively.
 * This helps to preserve the readability of the commit history and makes it easier to revert changes later.
 */
export function* noMergeCommits(
	commits: Commits,
	ruleset: RulesetConfiguration,
): Generator<Concern> {
	const rule: RuleKey = "noMergeCommits"
	const configuration = ruleset[rule]

	if (configuration.level === "off") {
		return
	}

	for (const commit of commits) {
		if (commit.isMergeCommit) {
			yield commitConcern(rule, commit.sha)
		}
	}
}
