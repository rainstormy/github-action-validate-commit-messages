import type { NoTrailingPunctuationInSubjectLinesConfiguration } from "+configuration"
import type { Rule } from "+rules"

export function noTrailingPunctuationInSubjectLines({
	customWhitelist,
}: NoTrailingPunctuationInSubjectLinesConfiguration): Rule {
	const builtInWhitelist = ["C++", "C#", "F#", "F*", "VDM++"]
	const whitelist = [...customWhitelist, ...builtInWhitelist]

	return {
		key: "no-trailing-punctuation-in-subject-lines",
		validate: ({ refinedSubjectLine }) =>
			hasTrailingPunctuation(refinedSubjectLine) &&
			!hasWhitelistedSuffix(whitelist, refinedSubjectLine)
				? "invalid"
				: "valid",
	}
}

const lastCharacterIsLetterOrNumberOrAllowedPunctuationRegex =
	/(?:\p{L}|\p{N}|\(.+\)|\[.+\]|'.+'|".+"|`.+`|«.+»|».+«|\d+[%"+!]|:\w+:|[:=;]-?[()/\\|]|\^_?\^)$/u

function hasTrailingPunctuation(value: string): boolean {
	return !lastCharacterIsLetterOrNumberOrAllowedPunctuationRegex.test(value)
}

function hasWhitelistedSuffix(
	whitelist: ReadonlyArray<string>,
	value: string,
): boolean {
	return whitelist.some((whitelistedSuffix) =>
		value.endsWith(whitelistedSuffix),
	)
}
