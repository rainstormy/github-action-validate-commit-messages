import type { Commit, Commits } from "#commits/Commit.ts"
import { isNonBlankTokenisedLine } from "#commits/tokens/Token.ts"
import { bodyLineConcern } from "#rules/concerns/BodyLineConcern.ts"
import type { Concern, Concerns } from "#rules/concerns/Concern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"
import { notNullish } from "#utilities/Arrays.ts"

const rule = "useEmptyLineBeforeBodyLines" satisfies RuleKey

/**
 * Verifies that the subject line and message body is separated by exactly one empty line.
 *
 * Standardising the commit message format helps to preserve the readability of the commit history in various Git clients.
 */
export function useEmptyLineBeforeBodyLines(
	commits: Commits,
	options: EmptyObject | null,
): Concerns {
	return options !== null ? commits.map(verifyCommit).filter(notNullish) : []
}

function verifyCommit(commit: Commit): Concern | null {
	let firstNonBlankLineNumber: number | null = null
	let lineNumber = 0

	for (const bodyLine of commit.bodyLines) {
		if (isNonBlankTokenisedLine(bodyLine)) {
			firstNonBlankLineNumber = lineNumber
			break
		}

		lineNumber += 1
	}

	if (firstNonBlankLineNumber === null) {
		return null
	}
	if (firstNonBlankLineNumber === 0) {
		return bodyLineConcern(rule, commit.sha, { line: 0, range: [0, 1] })
	}
	if (firstNonBlankLineNumber > 1) {
		return bodyLineConcern(rule, commit.sha, { line: firstNonBlankLineNumber - 1, range: [0, 1] })
	}

	return null
}
