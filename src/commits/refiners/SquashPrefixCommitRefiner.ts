import type { CommitRefiner } from "+commits"
import type { NoSquashCommitsConfiguration } from "+configuration"

export function squashPrefixCommitRefiner(
	configuration: NoSquashCommitsConfiguration,
): CommitRefiner {
	const squashPrefixesRegex = new RegExp(
		`^(?<squashPrefix>${configuration.disallowedPrefixes
			.map((prefix) => `(${prefix})`)
			.join("|")})`,
		"u",
	)

	return {
		refineCommit: (commit) => {
			const { squashPrefixes, refinedSubjectLine: currentSubjectLine } = commit

			const squashPrefix =
				squashPrefixesRegex.exec(currentSubjectLine)?.groups?.squashPrefix ??
				null

			if (squashPrefix === null) {
				return commit
			}

			return {
				...commit,
				squashPrefixes: [...squashPrefixes, squashPrefix],
				refinedSubjectLine: currentSubjectLine
					.slice(squashPrefix.length)
					.trim(),
			}
		},
	}
}
