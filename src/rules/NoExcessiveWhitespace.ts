import type { Commits } from "#commits/Commit.ts"
import { type Tokens, isToken } from "#commits/Token.ts"
import type { RuleKey, RulesetConfiguration } from "#configurations/RulesetConfiguration.ts"
import { bodyLineConcern } from "#rules/concerns/BodyLineConcern.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"

/**
 * Verifies that the subject line does not contain leading, trailing, or consecutive whitespace characters,
 * and that body lines do not contain consecutive whitespace characters except for indentation.
 *
 * Standardising whitespace helps to preserve the readability of the commit history in various Git clients.
 *
 * It disregards whitespace characters in inline code phrases and fenced code blocks.
 */
export function* noExcessiveWhitespace(
	commits: Commits,
	ruleset: RulesetConfiguration,
): Generator<Concern> {
	const rule: RuleKey = "noExcessiveWhitespace"
	const configuration = ruleset[rule]

	if (configuration.level === "off") {
		return
	}

	for (const commit of commits) {
		const firstToken = commit.subjectLine[0]
		const lastToken = commit.subjectLine.at(-1)

		if (firstToken?.type === "whitespace") {
			yield subjectLineConcern(rule, commit.sha, { range: firstToken.range })
		}

		for (const token of getConsecutiveWhitespaceTokens(commit.subjectLine)) {
			yield subjectLineConcern(rule, commit.sha, { range: token.range })
		}

		if (lastToken?.type === "whitespace") {
			yield subjectLineConcern(rule, commit.sha, { range: lastToken.range })
		}

		for (const [lineNumber, bodyLine] of commit.bodyLines.entries()) {
			for (const token of getConsecutiveWhitespaceTokens(bodyLine)) {
				yield bodyLineConcern(rule, commit.sha, { line: lineNumber, range: token.range })
			}
		}
	}
}

function getConsecutiveWhitespaceTokens(tokens: Tokens): Tokens<"whitespace"> {
	const firstToken = tokens[0]
	const lastToken = tokens.at(-1)

	return tokens
		.filter(isToken("whitespace"))
		.filter((token) => token.value.length > 1 && token !== firstToken && token !== lastToken)
}
