import type { Commits } from "#commits/Commit.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

export function useCommitterEmailPatterns(
	_commits: Commits,
	_options: EmptyObject | null,
): Concerns {
	throw new Error("The `useCommitterEmailPatterns` rule has not been implemented yet") // TODO: To be implemented.
}
