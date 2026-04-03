import { type Commit, mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { type CrudeCommitTemplate, fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import type { Configuration } from "#configurations/Configuration.ts"

export function fakeCommitFactory(
	configuration: Configuration,
): (overrides?: CrudeCommitTemplate) => Commit {
	return (overrides?: CrudeCommitTemplate): Commit =>
		mapCrudeCommitToCommit(fakeCrudeCommit(overrides), configuration)
}
