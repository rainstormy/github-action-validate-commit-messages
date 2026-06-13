import type { Commit, Commits } from "#commits/Commit.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

const _rule = "useLineWrapping" satisfies RuleKey

export function* useLineWrapping(
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
	throw new Error("The `useLineWrapping` rule has not been implemented yet") // TODO: To be implemented.
}
