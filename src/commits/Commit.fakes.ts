import { type Commit, mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { type CrudeCommitTemplate, fakeCrudeCommit } from "#commits/CrudeCommit.fakes.ts"
import { fakeTokenConfiguration } from "#commits/TokenConfiguration.fakes.ts"
import type { TokenConfiguration } from "#commits/TokenConfiguration.ts"

export function fakeCommitFactory(
	configuration: TokenConfiguration = fakeTokenConfiguration(),
): (overrides?: CrudeCommitTemplate) => Commit {
	return (overrides?: CrudeCommitTemplate): Commit =>
		mapCrudeCommitToCommit(fakeCrudeCommit(overrides), configuration)
}
