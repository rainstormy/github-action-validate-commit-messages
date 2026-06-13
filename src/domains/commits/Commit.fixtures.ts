import { type Commit, mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { type CrudeCommitTemplate, fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { fakeTokenConfiguration } from "#configurations/Configuration.fixtures.ts"
import type { TokenConfiguration } from "#configurations/Configuration.ts"

export function fakeCommitFactory(
	configuration: TokenConfiguration = fakeTokenConfiguration(),
): (overrides?: CrudeCommitTemplate) => Commit {
	return (overrides?: CrudeCommitTemplate): Commit =>
		mapCrudeCommitToCommit(fakeCrudeCommit(overrides), configuration)
}
