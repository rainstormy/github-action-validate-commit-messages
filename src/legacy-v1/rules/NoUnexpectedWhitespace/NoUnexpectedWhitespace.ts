import type { Commit } from "#legacy-v1/rules/Commit"
import type { Rule } from "#legacy-v1/rules/Rule"

const leadingOrTrailingWhitespaceRegex = /^\s|\s$/u
const consecutiveWhitespaceRegex = /\S\s{2,}/u

export function noUnexpectedWhitespace(): Rule {
	return {
		key: "no-unexpected-whitespace",
		getInvalidCommits: (refinedCommits): ReadonlyArray<Commit> =>
			refinedCommits.filter(
				({ originalSubjectLine, bodyLines }) =>
					leadingOrTrailingWhitespaceRegex.test(originalSubjectLine) ||
					consecutiveWhitespaceRegex.test(originalSubjectLine) ||
					bodyLines.some((line) => consecutiveWhitespaceRegex.test(line)),
			),
	}
}
