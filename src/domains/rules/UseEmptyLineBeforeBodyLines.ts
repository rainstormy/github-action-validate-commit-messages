import type { Commit, Commits } from "#commits/Commit.ts"
import { formatTokenisedLine } from "#commits/tokens/Token.ts"
import { bodyLineConcern } from "#rules/concerns/BodyLineConcern.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

const rule = "useEmptyLineBeforeBodyLines" satisfies RuleKey

/**
 * Verifies that the subject line and message body is separated by exactly one empty line.
 *
 * Standardising the commit message format helps to preserve the readability of the commit history in various Git clients.
 */
export function* useEmptyLineBeforeBodyLines(
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
	let firstNonBlankLineNumber: number | null = null
	let lineNumber = 0

	for (const bodyLine of commit.bodyLines) {
		if (formatTokenisedLine(bodyLine).trim() !== "") {
			firstNonBlankLineNumber = lineNumber
			break
		}

		lineNumber += 1
	}

	if (firstNonBlankLineNumber === 0) {
		yield bodyLineConcern(rule, commit.sha, { line: 0, range: [0, 1] })
	}
	if (firstNonBlankLineNumber !== null && firstNonBlankLineNumber > 1) {
		yield bodyLineConcern(rule, commit.sha, { line: firstNonBlankLineNumber - 1, range: [0, 1] })
	}
}
