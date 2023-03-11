import type { Commit } from "+commits"
import { compoundCommitRefiner, squashPrefixCommitRefiner } from "+commits"
import type { Configuration } from "+configuration"

export type CommitRefiner = {
	readonly refineCommit: (commit: Commit) => Commit
}

export function commitRefinerFrom(configuration: Configuration): CommitRefiner {
	return compoundCommitRefiner([
		squashPrefixCommitRefiner(configuration.noSquashCommits),
	])
}
