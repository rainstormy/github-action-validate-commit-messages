import type { AuthorEmailAddressConcern } from "#rules/concerns/AuthorEmailAddressConcern.ts"
import type { AuthorNameConcern } from "#rules/concerns/AuthorNameConcern.ts"
import type { BodyLineConcern } from "#rules/concerns/BodyLineConcern.ts"
import type { CommitterEmailAddressConcern } from "#rules/concerns/CommitterEmailAddressConcern.ts"
import type { CommitterNameConcern } from "#rules/concerns/CommitterNameConcern.ts"
import type { SubjectLineConcern } from "#rules/concerns/SubjectLineConcern.ts"

export type Concern =
	| AuthorEmailAddressConcern
	| AuthorNameConcern
	| BodyLineConcern
	| CommitterEmailAddressConcern
	| CommitterNameConcern
	| SubjectLineConcern

export type Concerns = Array<Concern>
