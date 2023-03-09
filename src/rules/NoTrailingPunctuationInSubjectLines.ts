import type { Configuration, Rule } from "+core"
import { defineRule } from "+core"

const key = "no-trailing-punctuation-in-subject-lines"
export type NoTrailingPunctuationInSubjectLines = Rule<typeof key>

export function noTrailingPunctuationInSubjectLines(
	configuration: Configuration,
): NoTrailingPunctuationInSubjectLines {
	const lastCharacterIsLetterOrNumberOrAllowedPunctuationRegex =
		/(?:\p{L}|\p{N}|\(.+\)|\[.+\]|'.+'|".+"|`.+`|«.+»|».+«|\d+[%"+!]|:\w+:|[:=;]-?[()/\\|]|\^_?\^)$/u

	function hasTrailingPunctuation(value: string): boolean {
		return !lastCharacterIsLetterOrNumberOrAllowedPunctuationRegex.test(value)
	}

	const builtInSuffixWhitelist = ["C++", "C#", "F#", "F*", "VDM++"]
	const whitelist = [
		...configuration["no-trailing-punctuation-in-subject-lines"].whitelist,
		...builtInSuffixWhitelist,
	]

	function hasWhitelistedSuffix(value: string): boolean {
		return whitelist.some((whitelistedSuffix) =>
			value.endsWith(whitelistedSuffix),
		)
	}

	return defineRule({
		key,
		validate: ({ refinedSubjectLine }) =>
			hasTrailingPunctuation(refinedSubjectLine) &&
			!hasWhitelistedSuffix(refinedSubjectLine)
				? "invalid"
				: "valid",
	})
}
