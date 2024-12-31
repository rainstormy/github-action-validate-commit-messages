import type { Commit } from "+rules/Commit"
import type { NoSquashCommitsConfiguration } from "+rules/NoSquashCommits/NoSquashCommitsConfiguration"
import type { Rule } from "+rules/Rule"

export function noSquashCommits({
	disallowedPrefixes,
}: NoSquashCommitsConfiguration): Rule {
	function findFirstMatchingPrefix(subjectLine: string): string | undefined {
		return disallowedPrefixes.find((prefix) => subjectLine.startsWith(prefix))
	}

	return {
		key: "no-squash-commits",
		refine: (commit): Commit => {
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
		getInvalidCommits: (refinedCommits): ReadonlyArray<Commit> =>
			refinedCommits.filter(({ squashPrefixes }) => squashPrefixes.length > 0),
	}
}
