import type { Commit } from "#legacy-v1/rules/Commit"
import type { NoTrailingPunctuationInSubjectLinesConfiguration } from "#legacy-v1/rules/NoTrailingPunctuationInSubjectLines/NoTrailingPunctuationInSubjectLinesConfiguration"
import type { Rule } from "#legacy-v1/rules/Rule"

export function noTrailingPunctuationInSubjectLines({
	whitelist: customWhitelist,
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
		getInvalidCommits: (refinedCommits): ReadonlyArray<Commit> =>
			refinedCommits
				.filter(({ refinedSubjectLine }) => refinedSubjectLine.length > 0)
				.filter(({ refinedSubjectLine }) =>
					hasTrailingPunctuation(refinedSubjectLine),
				)
				.filter(
					({ refinedSubjectLine }) => !hasWhitelistedSuffix(refinedSubjectLine),
				),
	}
}

const lastCharacterIsLetterOrNumberOrAllowedPunctuationRegex =
	/(?:\p{L}|\p{N}|\(.+\)|\[.+\]|'.+'|".+"|`.+`|«.+»|».+«|\d+[%"+!]|:\w+:|[:=;]-?[()/\\|]|\^_?\^)$/u

function hasTrailingPunctuation(value: string): boolean {
	return !lastCharacterIsLetterOrNumberOrAllowedPunctuationRegex.test(value)
}
