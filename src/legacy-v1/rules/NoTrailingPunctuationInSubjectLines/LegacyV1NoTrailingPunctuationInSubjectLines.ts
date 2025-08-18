import type { LegacyV1Commits } from "#legacy-v1/rules/LegacyV1Commit"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule"
import type { LegacyV1NoTrailingPunctuationInSubjectLinesConfiguration } from "#legacy-v1/rules/NoTrailingPunctuationInSubjectLines/LegacyV1NoTrailingPunctuationInSubjectLinesConfiguration"

export function legacyV1NoTrailingPunctuationInSubjectLines({
	whitelist: customWhitelist,
}: LegacyV1NoTrailingPunctuationInSubjectLinesConfiguration): LegacyV1Rule {
	const builtInWhitelist = ["C++", "C#", "F#", "F*", "VDM++"]
	const whitelist = [...customWhitelist, ...builtInWhitelist]

	function hasWhitelistedSuffix(value: string): boolean {
		return whitelist.some((whitelistedSuffix) =>
			value.endsWith(whitelistedSuffix),
		)
	}

	return {
		key: "no-trailing-punctuation-in-subject-lines",
		getInvalidCommits: (refinedCommits: LegacyV1Commits): LegacyV1Commits =>
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
