import type { Rule } from "+core"
import { defineRule } from "+core"
import type { Configuration } from "+validation"

const key = "no-trailing-punctuation-in-subject-lines"
export type NoTrailingPunctuationInSubjectLines = Rule<typeof key>

export function noTrailingPunctuationInSubjectLines({
	suffixWhitelist,
}: Configuration): NoTrailingPunctuationInSubjectLines {
	const lastCharacterIsLetterOrNumberOrAllowedPunctuationRegex =
		/(?:\p{L}|\p{N}|\(.+\)|\[.+\]|'.+'|".+"|`.+`|«.+»|».+«|\d+[%"+!]|:\w+:|[:=;]-?[()/\\|]|\^_?\^)$/u

	function hasTrailingPunctuation(value: string): boolean {
		return !lastCharacterIsLetterOrNumberOrAllowedPunctuationRegex.test(value)
	}

	const builtInSuffixWhitelist = ["C++", "C#", "F#", "F*", "VDM++"]

	function hasWhitelistedSuffix(value: string): boolean {
		return [...suffixWhitelist, ...builtInSuffixWhitelist].some(
			(whitelistedSuffix) => value.endsWith(whitelistedSuffix),
		)
	}

	return defineRule({
		key,
		validate: (commit) =>
			hasTrailingPunctuation(commit.naturalSubjectLine) &&
			!hasWhitelistedSuffix(commit.naturalSubjectLine)
				? "invalid"
				: "valid",
	})
}
