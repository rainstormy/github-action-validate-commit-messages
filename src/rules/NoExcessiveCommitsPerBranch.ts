import type { Commits } from "#commits/Commit.ts"
import { isToken } from "#commits/Token.ts"
import type { RuleKey, RulesetConfiguration } from "#configurations/RulesetConfiguration.ts"
import { commitConcern } from "#rules/concerns/CommitConcern.ts"
import type { Concern } from "#rules/concerns/Concern.ts"

/**
 * Verifies that the branch does not contain more than a given number of commits.
 *
 * Keeping pull requests small makes them easier to review and easier to revert if needed.
 * It may also help to catch accidental rebases onto wrong branches or stale commits.
 *
 * It ignores merge commits and commits with squash markers.
 */
export function* noExcessiveCommitsPerBranch(
	commits: Commits,
	ruleset: RulesetConfiguration,
): Generator<Concern> {
	const rule: RuleKey = "noExcessiveCommitsPerBranch"
	const configuration = ruleset[rule]

	if (configuration.level === "off") {
		return
	}

	const maxCommits = configuration.options.maxCommits

	let commitCount = 0

	for (const commit of commits) {
		if (commit.isMergeCommit || commit.subjectLine.some(isToken("squash"))) {
			continue
		}

		commitCount += 1

		if (commitCount > maxCommits) {
			yield commitConcern(rule, commit.sha)
		}
	}
}
