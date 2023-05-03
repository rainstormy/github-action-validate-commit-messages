import type { LimitLengthOfSubjectLinesConfiguration, Rule } from "+rules"
import { countOccurrences } from "+utilities"

export function limitLengthOfSubjectLines({
	maximumCharacters,
}: LimitLengthOfSubjectLinesConfiguration): Rule {
	return {
		key: "limit-length-of-subject-lines",
		getInvalidCommits: (refinedCommits) =>
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
						countOccurrences(refinedSubjectLine, "`") <= 1,
				),
	}
}
