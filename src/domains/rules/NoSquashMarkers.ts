import type { Commits } from "#commits/Commit.ts"
import type { TokenisedLine } from "#commits/tokens/Token.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

const rule = "noSquashMarkers" satisfies RuleKey

/**
 * Verifies that the subject line does not contain any squash marker.
 *
 * Combining squash commits with their ancestors makes the commit history cleaner and easier to read,
 * as it omits unnecessary diffs and increases the cohesion of commits. It also makes it easier to revert changes later.
 */
export function* noSquashMarkers(
	commits: Commits,
	options: EmptyObject | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	for (const commit of commits) {
		const range = getLeadingSquashMarkerRange(commit.subjectLine)

		if (range !== null) {
			yield subjectLineConcern(rule, commit.sha, { range })
		}
	}
}

function getLeadingSquashMarkerRange(subjectLine: TokenisedLine): CharacterRange | null {
	const firstSignificantTokenIndex = subjectLine.findIndex((token) => token.type !== "whitespace")
	const firstSignificantToken = subjectLine[firstSignificantTokenIndex]

	if (firstSignificantToken?.type !== "squash-marker") {
		return null
	}

	const startIndex = firstSignificantToken.range[0]
	let endIndex = firstSignificantToken.range[1]

	for (const token of subjectLine.slice(firstSignificantTokenIndex + 1)) {
		if (token.type !== "squash-marker" && token.type !== "whitespace") {
			break
		}

		if (token.type === "squash-marker") {
			endIndex = token.range[1]
		}
	}

	return [startIndex, endIndex]
}
