import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type BodyLineConcern = {
	location: "body-line"
	rule: BodyLineConcernRuleKey
	commitSha: CommitSha
	line: number
	range: CharacterRange
}

export type BodyLineConcernRuleKey =
	| "noRestrictedTrailers"
	| "noUnexpectedPunctuation"
	| "noUnexpectedWhitespace"
	| "useEmptyLineBeforeBodyLines"
	| "useLineWrapping"

export function bodyLineConcern(
	rule: BodyLineConcernRuleKey,
	commitSha: CommitSha,
	props: Pick<BodyLineConcern, "line" | "range">,
): BodyLineConcern {
	return { location: "body-line", rule, commitSha, ...props }
}
