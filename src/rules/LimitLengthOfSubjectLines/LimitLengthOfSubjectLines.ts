import { type LimitLengthOfSubjectLinesConfiguration } from "+rules/LimitLengthOfSubjectLines/LimitLengthOfSubjectLinesConfiguration"
import { type Rule } from "+rules/Rule"
import { countOccurrences } from "+utilities/IterableUtilities"

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
						!endsWithSemanticVersionNumber(refinedSubjectLine) &&
						countOccurrences(refinedSubjectLine, "`") <= 1,
				),
	}
}

function endsWithSemanticVersionNumber(subjectLine: string): boolean {
	const semanticVersionNumberRegex = /to\s\d+\.\d+\.\d+$/u
	return semanticVersionNumberRegex.test(subjectLine)
}
