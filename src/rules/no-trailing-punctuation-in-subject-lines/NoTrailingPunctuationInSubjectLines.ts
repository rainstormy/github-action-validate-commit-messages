import type {
	NoTrailingPunctuationInSubjectLinesConfiguration,
	Rule,
} from "+rules"

export function noTrailingPunctuationInSubjectLines({
	customWhitelist,
}: NoTrailingPunctuationInSubjectLinesConfiguration): Rule {
	const builtInWhitelist = ["C++", "C#", "F#", "F*", "VDM++"]
	const whitelist = [...customWhitelist, ...builtInWhitelist]

	function hasWhitelistedSuffix(value: string): boolean {
		return whitelist.some((whitelistedSuffix) =>
			value.endsWith(whitelistedSuffix),
		)
	}

	return {
		key: "no-trailing-punctuation-in-subject-lines",
		validate: ({ refinedSubjectLine }) =>
			hasTrailingPunctuation(refinedSubjectLine) &&
			!hasWhitelistedSuffix(refinedSubjectLine)
				? "invalid"
				: "valid",
	}
}

const lastCharacterIsLetterOrNumberOrAllowedPunctuationRegex =
	/(?:\p{L}|\p{N}|\(.+\)|\[.+\]|'.+'|".+"|`.+`|«.+»|».+«|\d+[%"+!]|:\w+:|[:=;]-?[()/\\|]|\^_?\^)$/u

function hasTrailingPunctuation(value: string): boolean {
	return !lastCharacterIsLetterOrNumberOrAllowedPunctuationRegex.test(value)
}
