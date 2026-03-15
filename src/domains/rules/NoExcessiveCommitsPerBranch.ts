import type { Commits } from "#commits/Commit.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

export function noExcessiveCommitsPerBranch(
	_commits: Commits,
	_configuration: EmptyObject | null,
): Concerns {
	throw new Error("The `noExcessiveCommitsPerBranch` rule has not been implemented yet") // TODO: To be implemented.
}
