import type { Commits } from "#commits/Commit.ts"
import { isNotToken, isToken, tokenOverflowRange } from "#commits/Token.ts"
import type { RuleKey, RulesetConfiguration } from "#configurations/RulesetConfiguration.ts"
import { bodyLineConcern } from "#rules/concerns/BodyLineConcern.ts"
import type { Concern } from "#rules/concerns/Concern.ts"

/**
 * Verifies that the body lines do not exceed a given number of characters (default: 72 characters).
 *
 * Keeping the body lines short helps to preserve the readability of the commit history in various Git clients.
 *
 * It ignores merge commits and the lines of fenced code blocks and trailers.
 * Hyperlinks, issue links, inline code phrases do not count towards the limit.
 */
export function* useLineWrapping(
	commits: Commits,
	ruleset: RulesetConfiguration,
): Generator<Concern> {
	const rule: RuleKey = "useLineWrapping"
	const configuration = ruleset[rule]

	if (configuration.level === "off") {
		return
	}

	const maxLength = configuration.options.maxLength

	for (const commit of commits) {
		if (commit.isMergeCommit) {
			continue
		}

		for (const [lineNumber, bodyLine] of commit.bodyLines.entries()) {
			if (bodyLine.some(isToken("codeblock", "trailerkey"))) {
				continue
			}

			const overflowRange = tokenOverflowRange(
				bodyLine.filter(isNotToken("code", "hyperlink", "issuelink")),
				maxLength,
			)

			if (overflowRange !== null) {
				yield bodyLineConcern(rule, commit.sha, { line: lineNumber, range: overflowRange })
			}
		}
	}
}
