import type { Rule } from "+rules"

export function noUnexpectedWhitespace(): Rule {
	const leadingOrTrailingWhitespaceRegex = /^\s|\s$/u
	const consecutiveWhitespaceRegex = /\S\s{2,}/u

	return {
		key: "no-unexpected-whitespace",
		validate: ({ originalSubjectLine, bodyLines }) =>
			leadingOrTrailingWhitespaceRegex.test(originalSubjectLine) ||
			consecutiveWhitespaceRegex.test(originalSubjectLine) ||
			bodyLines.some((line) => consecutiveWhitespaceRegex.test(line))
				? "invalid"
				: "valid",
	}
}