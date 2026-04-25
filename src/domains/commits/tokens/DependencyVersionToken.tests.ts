import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { dependencyVersion } from "#commits/tokens/DependencyVersionToken.ts"
import { issueLink } from "#commits/tokens/IssueLinkToken.ts"
import { revertMarker } from "#commits/tokens/RevertMarkerToken.ts"
import { squashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import { text } from "#commits/tokens/TextToken.ts"
import type { TokenisedLine } from "#commits/tokens/Token.ts"
import { fakeConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeConfiguration()

describe.each`
	subjectLine                                                      | expectedTokens
	${"introduce v1.2.3"}                                            | ${[text("introduce ", [0, 10]), dependencyVersion("v1.2.3", [10, 16])]}
	${"Install pnpm 10.32.0"}                                        | ${[text("Install pnpm ", [0, 13]), dependencyVersion("10.32.0", [13, 20])]}
	${"Pre-release v10.0.0-beta.1"}                                  | ${[text("Pre-release ", [0, 12]), dependencyVersion("v10.0.0-beta.1", [12, 26])]}
	${"Bump vite from 4.1.1-beta.0 to 4.3.2"}                        | ${[text("Bump vite from ", [0, 15]), dependencyVersion("4.1.1-beta.0", [15, 27]), text(" to ", [27, 31]), dependencyVersion("4.3.2", [31, 36])]}
	${"Upgrade tsgo to 7.0.0-dev.20260131.1"}                        | ${[text("Upgrade tsgo to ", [0, 16]), dependencyVersion("7.0.0-dev.20260131.1", [16, 36])]}
	${"Update dependency to v2.0.0-rc.1+4905fa03"}                   | ${[text("Update dependency to ", [0, 21]), dependencyVersion("v2.0.0-rc.1+4905fa03", [21, 41])]}
	${"Downgrade the grumpy cat module from 3.1.4 to 3.0.0"}         | ${[text("Downgrade the grumpy cat module from ", [0, 37]), dependencyVersion("3.1.4", [37, 42]), text(" to ", [42, 46]), dependencyVersion("3.0.0", [46, 51])]}
	${"Release v0.1.0-next"}                                         | ${[text("Release ", [0, 8]), dependencyVersion("v0.1.0-next", [8, 19])]}
	${"Pin the Node.js image to 4af617c"}                            | ${[text("Pin the Node.js image to ", [0, 25]), dependencyVersion("4af617c", [25, 32])]}
	${"Upgrade nginx image digest to 9d739ff1ada6"}                  | ${[text("Upgrade nginx image digest to ", [0, 30]), dependencyVersion("9d739ff1ada6", [30, 42])]}
	${'Revert "Upgrade nginx image digest to 9d739ff1ada6"'}         | ${[revertMarker('Revert "', 1, [0, 8]), text("Upgrade nginx image digest to ", [8, 38]), dependencyVersion("9d739ff1ada6", [38, 50]), revertMarker('"', 0, [50, 51])]}
	${"#2: Refresh master to commit dfbc095"}                        | ${[issueLink("#2: ", [0, 4]), text("Refresh master to commit ", [4, 29]), dependencyVersion("dfbc095", [29, 36])]}
	${"fixup! Bump @typescript-eslint/parser from 5.52.0 to 5.59.1"} | ${[squashMarker("fixup! ", [0, 7]), text("Bump @typescript-eslint/parser from ", [7, 43]), dependencyVersion("5.52.0", [43, 49]), text(" to ", [49, 53]), dependencyVersion("5.59.1", [53, 59])]}
	${"amend! Upgrade React to 19.2.0 (#52)"}                        | ${[squashMarker("amend! ", [0, 7]), text("Upgrade React to ", [7, 24]), dependencyVersion("19.2.0", [24, 30]), issueLink(" (#52)", [30, 36])]}
`(
	"when the subject line of $subjectLine contains dependency versions",
	(props: { subjectLine: string; expectedTokens: TokenisedLine }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("extracts dependency version tokens", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual(props.expectedTokens)
		})
	},
)

describe.each`
	subjectLine
	${"there's no dependency to be found here"}
	${"1 more time"}
	${"Enforce TLS 1.3 for all connections"}
	${"Change IP address to 11.37.118.232"}
	${"Route all traffic through the gateway at 10.0.0.1"}
	${"Redirect requests to /api/v2.5.1/endpoint"}
	${"Relocate the files (sector 2.3.4)"}
	${"0.2.0"}
	${"badf00d not found"}
	${" Codename 0ff1ce"}
`(
	"when the subject line of $subjectLine does not contain any dependency versions",
	(props: { subjectLine: string }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("leaves the subject line unchanged", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).toEqual([text(props.subjectLine, [0, props.subjectLine.length])])
		})
	},
)
