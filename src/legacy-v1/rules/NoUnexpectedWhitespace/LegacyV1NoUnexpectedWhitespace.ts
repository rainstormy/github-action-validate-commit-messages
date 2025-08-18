import type { LegacyV1Commits } from "#legacy-v1/rules/LegacyV1Commit"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule"

const leadingOrTrailingWhitespaceRegex = /^\s|\s$/u
const consecutiveWhitespaceRegex = /\S\s{2,}/u

export function legacyV1NoUnexpectedWhitespace(): LegacyV1Rule {
	return {
		key: "no-unexpected-whitespace",
		getInvalidCommits: (refinedCommits: LegacyV1Commits): LegacyV1Commits =>
			refinedCommits.filter(
				({ originalSubjectLine, bodyLines }) =>
					leadingOrTrailingWhitespaceRegex.test(originalSubjectLine) ||
					consecutiveWhitespaceRegex.test(originalSubjectLine) ||
					bodyLines.some((line) => consecutiveWhitespaceRegex.test(line)),
			),
	}
}
