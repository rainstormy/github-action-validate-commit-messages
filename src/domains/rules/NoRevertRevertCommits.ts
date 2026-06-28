import type { Commit, Commits } from "#commits/Commit.ts"
import type { TokenisedLine } from "#commits/tokens/Token.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"
import { countOccurrences } from "#utilities/Strings.ts"

const rule = "noRevertRevertCommits" satisfies RuleKey

/**
 * Verifies that the subject line contains at most one revert marker.
 *
 * Cherry-picking the original commit provides more context, such as the original commit message and authorship.
 * This helps to preserve the traceability of the commit history.
 */
export function* noRevertRevertCommits(
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

function* getCommitConcerns(commit: Commit): Generator<Concern> {
	const revertMarkerRange = getRevertRevertMarkerRange(commit.subjectLine)

	if (revertMarkerRange !== null) {
		yield subjectLineConcern(rule, commit.sha, { range: revertMarkerRange })
	}
}

function getRevertRevertMarkerRange(subjectLine: TokenisedLine): CharacterRange | null {
	let occurrences = 0
	let startIndex: number | null = null
	let endIndex = 0
	let hasStartedRevertMarker = false

	for (const token of subjectLine) {
		if (hasStartedRevertMarker && token.type !== "revert-marker" && token.type !== "whitespace") {
			break
		}
		if (hasStartedRevertMarker || token.type === "revert-marker") {
			if (token.type === "revert-marker" && startIndex === null) {
				startIndex = token.range[0]
			}

			occurrences +=
				token.type === "revert-marker"
					? countOccurrences(token.value, "revert", { caseInsensitive: true })
					: 0
			if (token.type === "revert-marker") {
				hasStartedRevertMarker = true
				endIndex = token.range[1]
			}
		}
	}

	return occurrences > 1 && startIndex !== null ? [startIndex, endIndex] : null
}
