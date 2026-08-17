import type { Commits } from "#commits/Commit.ts"
import { isNotToken } from "#commits/Token.ts"
import type { RuleKey, RulesetConfiguration } from "#configurations/RulesetConfiguration.ts"
import { bodyLineConcern } from "#rules/concerns/BodyLineConcern.ts"
import type { Concern } from "#rules/concerns/Concern.ts"

/**
 * Verifies that the subject line and message body is separated by exactly one empty line.
 *
 * Standardising the commit message format helps to preserve the readability of the commit history in various Git clients.
 */
export function* useEmptyLineBeforeBodyLines(
	commits: Commits,
	ruleset: RulesetConfiguration,
): Generator<Concern> {
	const rule: RuleKey = "useEmptyLineBeforeBodyLines"
	const configuration = ruleset[rule]

	if (configuration.level === "off") {
		return
	}

	for (const commit of commits) {
		for (const [lineNumber, bodyLine] of commit.bodyLines.entries()) {
			if (bodyLine.some(isNotToken("whitespace"))) {
				if (lineNumber === 0) {
					yield bodyLineConcern(rule, commit.sha, { line: 0, range: [0, 1] })
				}
				if (lineNumber > 1) {
					yield bodyLineConcern(rule, commit.sha, { line: lineNumber - 1, range: [0, 1] })
				}
				break
			}
		}
	}
}
