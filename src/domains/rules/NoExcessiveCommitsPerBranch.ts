import type { Commit, Commits } from "#commits/Commit.ts"
import { commitConcern } from "#rules/concerns/CommitConcern.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import type { RuleKey, RuleOptions } from "#rules/Rule.ts"

const rule = "noExcessiveCommitsPerBranch" satisfies RuleKey

/**
 * Verifies that the branch does not contain more than a given number of commits.
 *
 * Keeping pull requests small makes them easier to review and easier to revert if needed.
 * It may also help to catch accidental rebases onto wrong branches or stale commits.
 *
 * It ignores merge commits and commits with squash markers.
 */
export function noExcessiveCommitsPerBranch(
	commits: Commits,
	options: { maxCommits: number } | null,
): Concerns {
	return options !== null ? [...verifyCommits(commits, options)] : []
}

function* verifyCommits(commits: Commits, options: RuleOptions<typeof rule>): Generator<Concern> {
	let commitCount = 0

	for (const commit of commits) {
		if (!commit.isMergeCommit && !hasSquashMarker(commit)) {
			commitCount += 1

			if (commitCount > options.maxCommits) {
				yield commitConcern(rule, commit.sha)
			}
		}
	}
}

function hasSquashMarker(commit: Commit): boolean {
	return commit.subjectLine[0]?.type === "squash-marker"
}
