import type { Commits } from "#commits/Commit.ts"
import type { TokenisedLine } from "#commits/tokens/Token.ts"
import { commitConcern } from "#rules/concerns/CommitConcern.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"
import { collapseWhitespace } from "#utilities/Strings.ts"

const rule = "noRepeatedSubjectLines" satisfies RuleKey

/**
 * Verifies that each commit has a unique subject line within the branch.
 *
 * Commits that repeat a subject line are probably meant to be squash commits or the author may have forgotten to update the subject line.
 * Rewording commits or combining squash commits with their ancestors makes the commit history cleaner and easier to read.
 *
 * It is whitespace- and case-insensitive.
 * It ignores merge commits, revert commits, and commits with squash markers.
 */
export function* noRepeatedSubjectLines(
	commits: Commits,
	options: EmptyObject | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	const previousSubjectLines = new Set<string>()

	for (const commit of commits) {
		const normalisedSubjectLine = getNormalisedSubjectLine(commit.subjectLine)

		if (normalisedSubjectLine !== null) {
			if (previousSubjectLines.has(normalisedSubjectLine) && !commit.isMergeCommit) {
				yield commitConcern(rule, commit.sha)
			}
			previousSubjectLines.add(normalisedSubjectLine)
		}
	}
}

function getNormalisedSubjectLine(subjectLine: TokenisedLine): string | null {
	const significantText: Array<string> = []

	for (const token of subjectLine) {
		if (token.type === "revert-marker" || token.type === "squash-marker") {
			return null
		}

		significantText.push(collapseWhitespace(token.value.trim()).toLowerCase())
	}

	return significantText.join("")
}
