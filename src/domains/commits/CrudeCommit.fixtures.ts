import type { CrudeCommit } from "#commits/CrudeCommit.ts"
import { fakeCommitSha } from "#types/CommitSha.fixtures.ts"

export type CrudeCommitTemplate = Partial<CrudeCommit>

export function fakeCrudeCommit(
	overrides: CrudeCommitTemplate = {},
): CrudeCommit {
	return {
		parents: overrides.parents ?? [fakeCommitSha()],
		sha: overrides.sha ?? fakeCommitSha(),
		authorName: "Master Splinter",
		authorEmail: "58390854+sensei@users.noreply.github.com",
		committerName: "Leonardo da Vinci",
		committerEmail: "71091436+katanaturtle@users.noreply.github.com",
		message: "Introduce a cool feature\n\nIt is really awesome!",
		...overrides,
	}
}
