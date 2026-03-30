import type { Token, TokenisedLine } from "#commits/tokens/Token.ts"

export type DependencyVersionToken = {
	type: "dependency-version"
	value: string
}

export function dependencyVersion(value: string): DependencyVersionToken {
	return { type: "dependency-version", value }
}

export function isDependencyVersion(token: Token): token is DependencyVersionToken {
	return typeof token === "object" && token.type === "dependency-version"
}

/**
 * Matches a dependency version string in one of the following formats:
 *
 * - SHA code of 7 or more lowercase hexadecimal characters (e.g. a Docker image digest or a Git commit).
 * - Semantic version number (SemVer): `<major.minor.patch[-prerelease][+buildinfo]>` with an optional `v` prefix.
 *
 * It must be surrounded by whitespace or appear at the end of the subject line.
 *
 * @see https://semver.org
 */
const dependencyVersionRegex =
	/(?<=\s)([0-9a-f]{7,}|v?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(?:\+[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*)?)(?=\s|$)/gu

export function tokeniseDependencyVersions(initialTokens: TokenisedLine): TokenisedLine {
	const result: TokenisedLine = []

	for (const token of initialTokens) {
		if (typeof token === "string") {
			result.push(
				...token
					.split(dependencyVersionRegex)
					// `split()` with a regex preserves the string delimiter (i.e. the substrings that match the regex).
					// Every other item in the array is a match.
					.map((part, index) => (index % 2 === 1 ? dependencyVersion(part) : part)),
			)
		} else {
			result.push(token)
		}
	}

	return result
}
