import type { Commits } from "#commits/Commit.ts"
import { isToken } from "#commits/Token.ts"
import type { RuleKey, RulesetConfiguration } from "#configurations/RulesetConfiguration.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"

/**
 * Verifies that the subject line contains at least two words.
 *
 * Providing more context in the commit message (such as a thorough description) helps to preserve
 * the traceability of the commit history.
 *
 * It ignores commits with revert markers.
 * Issue links and squash markers do not count as words. Hyperlinks and inline code phrases count as one word each.
 */
export function* noSingleWordSubjectLines(
	commits: Commits,
	ruleset: RulesetConfiguration,
): Generator<Concern> {
	const rule: RuleKey = "noSingleWordSubjectLines"
	const configuration = ruleset[rule]

	if (configuration.level === "off") {
		return
	}

	for (const commit of commits) {
		if (commit.subjectLine.some(isToken("revert"))) {
			continue
		}

		const wordLikeTokens = commit.subjectLine.filter(isToken("code", "hyperlink", "semver", "word"))
		const soloWord = wordLikeTokens.length === 1 ? wordLikeTokens[0] : null

		if (soloWord) {
			yield subjectLineConcern(rule, commit.sha, { range: soloWord.range })
		}
	}
}
