import { type Commit, mapCrudeCommitToCommit } from "#commits/Commit.ts"
import {
	type CrudeCommitTemplate,
	fakeCrudeCommit,
} from "#commits/CrudeCommit.fixtures.ts"
import type { Configuration } from "#configurations/Configuration.ts"
import { getDefaultConfiguration } from "#configurations/GetDefaultConfiguration.ts"

export function fakeCommit(
	overrides: CrudeCommitTemplate = {},
	configuration: Configuration = getDefaultConfiguration(),
): Commit {
	return mapCrudeCommitToCommit(fakeCrudeCommit(overrides), configuration)
}
