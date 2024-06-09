import type { Rule } from "+rules/Rule"

const leadingOrTrailingWhitespaceRegex = /^\s|\s$/u
const consecutiveWhitespaceRegex = /\S\s{2,}/u

export function noUnexpectedWhitespace(): Rule {
	return {
		key: "no-unexpected-whitespace",
		getInvalidCommits: (refinedCommits) =>
			refinedCommits.filter(
				({ originalSubjectLine, bodyLines }) =>
					leadingOrTrailingWhitespaceRegex.test(originalSubjectLine) ||
					consecutiveWhitespaceRegex.test(originalSubjectLine) ||
					bodyLines.some((line) => consecutiveWhitespaceRegex.test(line)),
			),
	}
}
