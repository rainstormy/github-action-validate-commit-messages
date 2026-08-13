import type { Commits } from "#commits/Commit.ts"
import { isNotToken, isToken } from "#commits/Token.ts"
import type { RuleKey, RulesetConfiguration } from "#configurations/RulesetConfiguration.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import { isNotEmptyString } from "#utilities/Arrays.ts"
import { isImperativeVerb } from "#utilities/Verbs.ts"

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
	ruleset: RulesetConfiguration,
): Generator<Concern> {
	const rule: RuleKey = "useImperativeSubjectLines"
	const configuration = ruleset[rule]

	if (configuration.level === "off") {
		return
	}

	const whitelist = new Set(
		configuration.options.whitelist
			.map((word) => word.trim().toLowerCase())
			.filter(isNotEmptyString),
	)

	for (const commit of commits) {
		if (commit.subjectLine.some(isToken("revert"))) {
			continue
		}

		const firstToken =
			commit.subjectLine.find(isNotToken("issuelink", "squash", "whitespace")) ?? null

		if (firstToken !== null) {
			const canonicalFirstWord = firstToken.value.toLowerCase()

			if (
				firstToken.type !== "word" ||
				!(whitelist.has(canonicalFirstWord) || isImperativeVerb(canonicalFirstWord))
			) {
				yield subjectLineConcern(rule, commit.sha, { range: firstToken.range })
			}
		}
	}
}
