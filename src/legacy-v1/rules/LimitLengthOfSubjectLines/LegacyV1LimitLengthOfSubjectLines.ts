import type { LegacyV1Commit } from "#legacy-v1/rules/LegacyV1Commit"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule"
import type { LegacyV1LimitLengthOfSubjectLinesConfiguration } from "#legacy-v1/rules/LimitLengthOfSubjectLines/LegacyV1LimitLengthOfSubjectLinesConfiguration"
import { countOccurrences } from "#legacy-v1/utilities/IterableUtilities"

export function legacyV1LimitLengthOfSubjectLines({
	maximumCharacters,
}: LegacyV1LimitLengthOfSubjectLinesConfiguration): LegacyV1Rule {
	return {
		key: "limit-length-of-subject-lines",
		getInvalidCommits: (refinedCommits): ReadonlyArray<LegacyV1Commit> =>
			refinedCommits
				.filter(
					({ refinedSubjectLine }) => !refinedSubjectLine.startsWith("Revert "),
				)
				.filter(
					({ parents, refinedSubjectLine }) =>
						parents.length === 1 || !refinedSubjectLine.startsWith("Merge "),
				)
				.filter(
					({ refinedSubjectLine }) =>
						refinedSubjectLine.length > maximumCharacters &&
						!endsWithVersionNumber(refinedSubjectLine) &&
						countOccurrences(refinedSubjectLine, "`") <= 1,
				),
	}
}

const versionNumberRegex =
	/(?:from|to) (?:[0-9A-Fa-f]{7,}|(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?<prerelease>-(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(?<build>\+[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*)?)$/

function endsWithVersionNumber(subjectLine: string): boolean {
	return versionNumberRegex.test(subjectLine)
}
