import type { NoSquashCommitsConfiguration, Rule } from "+rules"

export function noSquashCommits({
	disallowedPrefixes,
}: NoSquashCommitsConfiguration): Rule {
	function findFirstMatchingPrefix(subjectLine: string): string | undefined {
		return disallowedPrefixes.find((prefix) => subjectLine.startsWith(prefix))
	}

	return {
		key: "no-squash-commits",
		refine: (commit) => {
			const { squashPrefixes, refinedSubjectLine: currentSubjectLine } = commit
			const matchingPrefix = findFirstMatchingPrefix(currentSubjectLine)

			if (matchingPrefix === undefined) {
				return commit
			}

			return {
				...commit,
				squashPrefixes: [...squashPrefixes, matchingPrefix],
				refinedSubjectLine: currentSubjectLine
					.slice(matchingPrefix.length)
					.trim(),
			}
		},
		validate: ({ squashPrefixes }) => {
			const isSquashCommit = squashPrefixes.length > 0
			return isSquashCommit ? "invalid" : "valid"
		},
	}
}
