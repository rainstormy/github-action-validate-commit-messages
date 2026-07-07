import { type TokenType, type Tokens, codeblock, tokenOf } from "#commits/tokens/Token.ts"
import type { TokenConfiguration } from "#configurations/Configuration.ts"
import { regexEnum, regexUnion } from "#utilities/Regexes.ts"

/**
 * Matches an inline code phrase enclosed in a pair of backticks (e.g. Markdown inline code) spanning all characters in-between, including whitespace.
 */
// language=jsunicoderegexp
const CODE = `(?<code>\`[^\`]*\`)`

// language=jsunicoderegexp
const PUNCTUATION = String.raw`(?<punctuation>[\p{P}\p{S}])`

// language=jsunicoderegexp
const REVERT = String.raw`(?<revert>(?i:revert))(?=\s+")`

/**
 * Matches a leading squash marker with leading or trailing exclamation marks, optionally preceded by whitespace.
 * There is at most one squash marker per line. Subsequent squash markers are treated as regular words.
 */
// language=jsunicoderegexp
const SQUASH = String.raw`(?<=^\s*)(?<squash>(?i:amend!+|fixup!+|squash!+|!amend\b|!fixup\b|!squash\b))`

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
// language=jsunicoderegexp
const SEMVER = String.raw`(?<=\s)(?<semver>[0-9a-f]{7,}|v?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(?:\+[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*)?)(?=\s|"|$)`

/**
 * Matches the key of a colon-separated key-value pair, optionally preceded and/or separated by whitespace, in one of the following formats:
 *
 * - Git-style trailers (e.g. `Co-authored-by: Ada <ada@example.com>`).
 * - Conventional Commits breaking change (e.g. `BREAKING CHANGE: Removed the old API`).
 *
 * There is at most one trailer key per line.
 *
 * @see https://git-scm.com/docs/git-interpret-trailers
 * @see https://www.conventionalcommits.org
 */
// language=jsunicoderegexp
const TRAILERKEY = String.raw`(?<=^\s*)(?<trailerkey>(?i:[a-z0-9-]+|breaking change))(?=\s*:)`

// language=jsunicoderegexp
const WHITESPACE = String.raw`(?<whitespace>\s+)`

/**
 * Matches alphanumeric words, optionally with non-consecutive hyphens (e.g. `quick-freeze` and `x-ray`), apostrophes (e.g. `I'd` and `O'Neil`), or a mix of both (e.g. `mother-in-law's` and `jack-o'-lantern`).
 */
// language=jsunicoderegexp
const WORD = String.raw`(?<word>[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*(?:'[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*)?)` // TODO: Recognise certain names like Vite+, C++, F#, etc.

const TRAILERKEY_REGEX = new RegExp(TRAILERKEY, "u")
const TRAILERLINE_REGEX = new RegExp(
	regexUnion([TRAILERKEY, WORD, WHITESPACE, PUNCTUATION], { preserveCapturingGroups: true }),
	"gu",
)

export type TokeniserPatterns = {
	issueLink: string
}

export function issueLinkPattern(configuration: TokenConfiguration): string {
	if (configuration.issueLinks === null) {
		return ""
	}

	const prefixes = regexEnum(configuration.issueLinks.prefixes)
	const wildcards = regexEnum(configuration.issueLinks.wildcards)

	// Assume all issue links to have a numeric key after the string prefix.
	// They can be surrounded by whitespace, enclosed in brackets (bracket pair consistency not enforced for simplicity), or followed by a colon.
	// language=jsregexp
	const numericIssueLinks = prefixes ? String.raw`[([{<]*(?:${prefixes})\d+[)\]}>]*:?` : ""

	// language=jsunicoderegexp
	return String.raw`(?<issuelink>${regexUnion([numericIssueLinks, wildcards])})`
}

export function tokeniseSubjectLine(crudeSubjectLine: string, patterns: TokeniserPatterns): Tokens {
	const prioritisedPatterns: Array<string> = [
		SQUASH,
		REVERT,
		CODE,
		SEMVER,
		patterns.issueLink,
		WORD,
		WHITESPACE,
		PUNCTUATION,
	]
	const regex = new RegExp(regexUnion(prioritisedPatterns, { preserveCapturingGroups: true }), "gu")

	return tokenise(crudeSubjectLine, regex)
}

export function tokeniseBodyLines(
	crudeBodyLines: Array<string>,
	patterns: TokeniserPatterns,
): Array<Tokens> {
	const prioritisedPatterns: Array<string> = [
		CODE,
		patterns.issueLink,
		WORD,
		WHITESPACE,
		PUNCTUATION,
	]
	const regex = new RegExp(regexUnion(prioritisedPatterns, { preserveCapturingGroups: true }), "gu")

	const firstTrailerLineNumber = getFirstTrailerLineNumber(crudeBodyLines)

	const lines: Array<Tokens> = []
	let currentFence: "```" | "````" | null = null

	for (const [index, line] of Object.entries(crudeBodyLines)) {
		if (currentFence !== null) {
			lines.push([codeblock(line)])

			const isClosingFence = line === currentFence

			if (isClosingFence) {
				currentFence = null
			}
		} else if (line.startsWith("````")) {
			lines.push([codeblock(line)])
			currentFence = "````"
		} else if (line.startsWith("```")) {
			lines.push([codeblock(line)])
			currentFence = "```"
		} else {
			const lineNumber = Number.parseInt(index, 10)
			lines.push(tokenise(line, lineNumber < firstTrailerLineNumber ? regex : TRAILERLINE_REGEX))
		}
	}

	return lines
}

function getFirstTrailerLineNumber(crudeBodyLines: Array<string>): number {
	for (let i = crudeBodyLines.length - 1; i >= 0; i -= 1) {
		const line = crudeBodyLines[i] ?? ""

		if (line.trim() !== "" && !TRAILERKEY_REGEX.test(line)) {
			return i + 1
		}
	}

	return 0
}

function tokenise(rawText: string, regex: RegExp): Tokens {
	const segments = rawText.matchAll(regex)

	const tokens: Tokens = []

	for (const segment of segments) {
		const groups = (segment.groups ?? {}) as Partial<Record<TokenType, string | undefined>>
		const group = Object.entries(groups).find(([, value]) => value !== undefined)

		if (group !== undefined) {
			const [tokenType, value] = group
			tokens.push(tokenOf(tokenType as TokenType, value as string, segment.index))
		}
	}

	return tokens
}
