import type { Commits } from "#commits/Commit.ts"
import { isNotToken } from "#commits/Token.ts"
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
		let lineNumber = 0

		for (const bodyLine of commit.bodyLines) {
			if (bodyLine.some(isNotToken("whitespace"))) {
				if (lineNumber === 0) {
					yield bodyLineConcern(rule, commit.sha, { line: 0, range: [0, 1] })
				}
				if (lineNumber > 1) {
					yield bodyLineConcern(rule, commit.sha, { line: lineNumber - 1, range: [0, 1] })
				}
				break
			}

			lineNumber += 1
		}
	}
}
