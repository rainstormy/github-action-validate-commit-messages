import type { Commit, Commits } from "#commits/Commit.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

const _rule = "noUnexpectedPunctuation" satisfies RuleKey

/**
 * It ignores revert commits.
 */
export function* noUnexpectedPunctuation(
	commits: Commits,
	options: EmptyObject | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	for (const commit of commits) {
		yield* getCommitConcerns(commit)
	}
}

function getCommitConcerns(_commit: Commit): Generator<Concern> {
	throw new Error("The `noUnexpectedPunctuation` rule has not been implemented yet") // TODO: To be implemented.
}
