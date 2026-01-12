import type { RuleKey } from "#configurations/Configuration.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { CommitSha } from "#types/CommitSha.ts"

export type Concern =
	| AuthorEmailAddressConcern
	| AuthorNameConcern
	| BodyLineConcern
	| CommitterEmailAddressConcern
	| CommitterNameConcern
	| SubjectLineConcern

export type Concerns = Array<Concern>

export type AuthorEmailAddressConcern = {
	location: "author-email-address"
	violatedRule: RuleKey
	commitSha: CommitSha
	characterRange: CharacterRange
}

export type AuthorNameConcern = {
	location: "author-name"
	violatedRule: RuleKey
	commitSha: CommitSha
	characterRange: CharacterRange
}

export type BodyLineConcern = {
	location: "body-line"
	violatedRule: RuleKey
	commitSha: CommitSha
	lineNumber: number
	characterRange: CharacterRange
}

export type CommitterEmailAddressConcern = {
	location: "committer-email-address"
	violatedRule: RuleKey
	commitSha: CommitSha
	characterRange: CharacterRange
}

export type CommitterNameConcern = {
	location: "committer-name"
	violatedRule: RuleKey
	commitSha: CommitSha
	characterRange: CharacterRange
}

export type SubjectLineConcern = {
	location: "subject-line"
	violatedRule: RuleKey
	commitSha: CommitSha
	characterRange: CharacterRange
}
