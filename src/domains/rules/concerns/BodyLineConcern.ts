import type { RuleKey } from "#rules/Rule.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type BodyLineConcern = {
	location: "body-line"
	rule: RuleKey
	commitSha: CommitSha
	line: number
	range: CharacterRange
}

export function bodyLineConcern(
	rule: RuleKey,
	commitSha: CommitSha,
	props: Pick<BodyLineConcern, "line" | "range">,
): BodyLineConcern {
	return { location: "body-line", rule, commitSha, ...props }
}
