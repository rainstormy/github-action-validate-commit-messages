import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type BodyLineConcern = {
	location: "body-line"
	key: `${CommitSha}:L${number}:C${CharacterRange[0]}-${CharacterRange[1]}:${BodyLineConcernRuleKey}`
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
	return {
		location: "body-line",
		key: `${commitSha}:L${props.line}:C${props.range[0]}-${props.range[1]}:${rule}`,
		rule,
		commitSha,
		...props,
	}
}
