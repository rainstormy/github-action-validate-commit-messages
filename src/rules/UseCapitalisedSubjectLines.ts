import type { Commits } from "#commits/Commit.ts"
import { type Token, isToken } from "#commits/Token.ts"
import type { RuleKey, RulesetConfiguration } from "#configurations/RulesetConfiguration.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"

/**
 * Verifies that the subject line starts with an uppercase letter.
 *
 * Standardising the commit message format helps to preserve the readability of the commit history.
 *
 * It ignores commits that do not start with a letter and commits that start with a hyperlink.
 * It disregards issue links, inline code phrases, and squash markers.
 */
export function* useCapitalisedSubjectLines(
	commits: Commits,
	ruleset: RulesetConfiguration,
): Generator<Concern> {
	const rule: RuleKey = "useCapitalisedSubjectLines"
	const configuration = ruleset[rule]

	if (configuration.level === "off") {
		return
	}

	for (const commit of commits) {
		const firstToken = commit.subjectLine.find(
			isToken("hyperlink", "punctuation", "revert", "word"),
		)

		if (firstToken && firstToken.type !== "hyperlink" && startsWithLowercaseLetter(firstToken)) {
			const rangeStart = firstToken.range[0]
			yield subjectLineConcern(rule, commit.sha, { range: [rangeStart, rangeStart + 1] })
		}
	}
}

function startsWithLowercaseLetter(token: Token): boolean {
	const firstCharacter = token.value.trimStart()[0] ?? ""
	return firstCharacter !== firstCharacter.toUpperCase()
}
