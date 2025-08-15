import type { Commit } from "#legacy-v1/rules/Commit"
import type { NoSquashCommitsConfiguration } from "#legacy-v1/rules/NoSquashCommits/NoSquashCommitsConfiguration"
import type { Rule } from "#legacy-v1/rules/Rule"

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
