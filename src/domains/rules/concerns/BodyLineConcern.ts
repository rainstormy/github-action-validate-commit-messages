import type { RuleKey } from "#configurations/Configuration.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type BodyLineConcern = {
	location: "body-line"
	rule: RuleKey
	commit: CommitSha
	line: number
	range: CharacterRange
}

export function bodyLineConcern(props: Omit<BodyLineConcern, "location">): BodyLineConcern {
	return { ...props, location: "body-line" }
}
