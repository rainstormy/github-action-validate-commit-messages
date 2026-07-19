import type { Commits } from "#commits/Commit.ts"
import { isToken } from "#commits/tokens/Token.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

const rule = "noSingleWordSubjectLines" satisfies RuleKey

/**
 * Verifies that the subject line contains at least two words.
 *
 * Providing more context in the commit message (such as a thorough description) helps to preserve
 * the traceability of the commit history.
 *
 * It ignores commits with revert markers.
 * Issue links and squash markers do not count as words. An inline code phrase counts as one word.
 */
export function* noSingleWordSubjectLines(
	commits: Commits,
	options: EmptyObject | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	for (const commit of commits) {
		if (commit.subjectLine.some(isToken("revert"))) {
			continue
		}

		const wordLikeTokens = commit.subjectLine.filter(isToken("code", "semver", "word"))
		const soloWord = wordLikeTokens.length === 1 ? wordLikeTokens[0] : null

		if (soloWord) {
			yield subjectLineConcern(rule, commit.sha, { range: soloWord.range })
		}
	}
}
