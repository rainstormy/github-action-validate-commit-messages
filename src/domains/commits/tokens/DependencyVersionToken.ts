import { type TokenisedLine, splitTextTokens } from "#commits/tokens/Token.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"

export type DependencyVersionToken = {
	type: "dependency-version"
	value: string
	range: CharacterRange
}

export function dependencyVersion(value: string, range: CharacterRange): DependencyVersionToken {
	return { type: "dependency-version", value, range }
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
	return splitTextTokens(initialTokens, regex, dependencyVersion)
}
