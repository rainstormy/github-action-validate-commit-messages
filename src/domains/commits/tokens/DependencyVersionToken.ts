import { type Token, type TokenisedLine, splitPlainTokens, tokenOf } from "#commits/tokens/Token.ts"

export function dependencyVersion(value: string, rangeStart = 0): Token {
	return tokenOf("dependency-version", value, rangeStart)
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
const regex =
	/(?<=\s)([0-9a-f]{7,}|v?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(?:\+[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*)?)(?=\s|"|$)/gu

export function tokeniseDependencyVersions(initialTokens: TokenisedLine): TokenisedLine {
	return splitPlainTokens(initialTokens, regex, dependencyVersion)
}
