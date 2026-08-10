import type { Commits } from "#commits/Commit.ts"
import { isNotToken, isToken } from "#commits/Token.ts"
import type { Concern } from "#rules/concerns/Concern.ts"
import { subjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"
import type { RuleKey } from "#rules/Rule.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { EmptyObject } from "#types/EmptyObject.ts"

const rule = "noUnexpectedPunctuation" satisfies RuleKey

const ALLOWED_PUNCTUATION_REGEX =
	/(?:\(.+\)|\[.+\]|\{.+\}|<.+>|'.+'|".+"|`.+`|«.+»|».+«|\d+[%"+!])$/u
const TRAILING_EMOJI_SHORTCODE_REGEX = /:\w+:$/u

/**
 * Verifies that the subject line does not contain trailing punctuation.
 *
 * Standardising the commit message format helps to preserve the readability of the commit history.
 *
 * It ignores revert commits.
 * It disregards issue links, closing brackets, paired quotes, and symbols associated with numbers.
 */
export function* noUnexpectedPunctuation(
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

		const lastTokenIndex = commit.subjectLine.findLastIndex(isNotToken("issuelink", "whitespace"))
		const lastToken = commit.subjectLine[lastTokenIndex]

		if (lastToken?.type === "punctuation") {
			const formattedSubjectLine = commit.subjectLine
				.slice(0, lastTokenIndex + 1)
				.map((token) => token.value)
				.join("")

			if (!ALLOWED_PUNCTUATION_REGEX.test(formattedSubjectLine)) {
				const emojiShortcodeMatch = TRAILING_EMOJI_SHORTCODE_REGEX.exec(formattedSubjectLine)
				const concernRange: CharacterRange =
					emojiShortcodeMatch === null
						? lastToken.range
						: [emojiShortcodeMatch.index, emojiShortcodeMatch.index + emojiShortcodeMatch[0].length]

				yield subjectLineConcern(rule, commit.sha, { range: concernRange })
			}
		}
	}
}
