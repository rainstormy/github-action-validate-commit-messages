import type {
	LegacyV1Commit,
	LegacyV1Commits,
} from "#legacy-v1/rules/LegacyV1Commit"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule"
import type { LegacyV1NoSquashCommitsConfiguration } from "#legacy-v1/rules/NoSquashCommits/LegacyV1NoSquashCommitsConfiguration"

export function legacyV1NoSquashCommits({
	disallowedPrefixes,
}: LegacyV1NoSquashCommitsConfiguration): LegacyV1Rule {
	function findFirstMatchingPrefix(subjectLine: string): string | undefined {
		return disallowedPrefixes.find((prefix) => subjectLine.startsWith(prefix))
	}

	return {
		key: "no-squash-commits",
		refine: (commit: LegacyV1Commit): LegacyV1Commit => {
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
		getInvalidCommits: (refinedCommits: LegacyV1Commits): LegacyV1Commits =>
			refinedCommits.filter(({ squashPrefixes }) => squashPrefixes.length > 0),
	}
}
