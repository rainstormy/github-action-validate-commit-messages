import type { Commits } from "#commits/Commit.ts"
import { isNotToken, isToken, tokenOverflowRange } from "#commits/Token.ts"
import type { RuleKey, RulesetConfiguration } from "#configurations/RulesetConfiguration.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"

/**
 * Verifies that the subject line does not exceed a given number of characters (default: 50 characters).
 *
 * Keeping the subject line short helps to preserve the readability of the commit history in various Git clients.
 *
 * It ignores merge commits, revert commits, squash commits, and dependency upgrade commits.
 * Hyperlinks, issue links, and inline code phrases do not count towards the limit.
 */
export function* useConciseSubjectLines(
	commits: Commits,
	ruleset: RulesetConfiguration,
): Generator<Concern> {
	const rule: RuleKey = "useConciseSubjectLines"
	const configuration = ruleset[rule]

	if (configuration.level === "off") {
		return
	}

	const maxLength = configuration.options.maxLength

	for (const commit of commits) {
		if (commit.isMergeCommit || commit.subjectLine.some(isToken("revert", "semver", "squash"))) {
			continue
		}
		const overflowRange = tokenOverflowRange(
			commit.subjectLine.filter(isNotToken("code", "hyperlink", "issuelink")),
			maxLength,
		)

		if (overflowRange !== null) {
			yield subjectLineConcern(rule, commit.sha, { range: overflowRange })
		}
	}
}
