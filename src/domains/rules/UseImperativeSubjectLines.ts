import type { Commits } from "#commits/Commit.ts"
import { isNotToken, isToken } from "#commits/Token.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import { notEmptyString } from "#utilities/Arrays.ts"
import { isImperativeVerb } from "#utilities/Verbs.ts"

const rule = "useImperativeSubjectLines" satisfies RuleKey

/**
 * Verifies that the subject line starts with a verb in the imperative mood.
 *
 * Standardising the commit message format helps to preserve the readability of the commit history.
 *
 * It ignores revert commits.
 * It disregards issue links and squash markers.
 */
export function* useImperativeSubjectLines(
	commits: Commits,
	options: { whitelist: Array<string> } | null,
): Generator<Concern> {
	if (options === null) {
		return
	}

	const whitelist = new Set(
		options.whitelist.map((word) => word.trim().toLowerCase()).filter(notEmptyString),
	)

	for (const commit of commits) {
		if (commit.subjectLine.some(isToken("revert"))) {
			continue
		}

		const firstToken =
			commit.subjectLine.find(isNotToken("issuelink", "squash", "whitespace")) ?? null

		if (firstToken !== null) {
			const canonicalFirstWord = firstToken.value.toLowerCase()

			if (!whitelist.has(canonicalFirstWord) && !isImperativeVerb(canonicalFirstWord)) {
				yield subjectLineConcern(rule, commit.sha, { range: firstToken.range })
			}
		}
	}
}
