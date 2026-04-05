import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { dependencyVersion } from "#commits/tokens/DependencyVersionToken.ts"
import { issueLink } from "#commits/tokens/IssueLinkToken.ts"
import { squashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import type { TokenisedLine } from "#commits/tokens/Token.ts"
import { fakeConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeConfiguration()

describe.each`
	subjectLine                                                      | expectedTokens
	${"introduce v1.2.3"}                                            | ${["introduce ", dependencyVersion("v1.2.3")]}
	${"Install pnpm 10.32.0"}                                        | ${["Install pnpm ", dependencyVersion("10.32.0")]}
	${"Pre-release v10.0.0-beta.1"}                                  | ${["Pre-release ", dependencyVersion("v10.0.0-beta.1")]}
	${"Bump vite from 4.1.1-beta.0 to 4.3.2"}                        | ${["Bump vite from ", dependencyVersion("4.1.1-beta.0"), " to ", dependencyVersion("4.3.2")]}
	${"Upgrade tsgo to 7.0.0-dev.20260131.1"}                        | ${["Upgrade tsgo to ", dependencyVersion("7.0.0-dev.20260131.1")]}
	${"Update dependency to v2.0.0-rc.1+4905fa03"}                   | ${["Update dependency to ", dependencyVersion("v2.0.0-rc.1+4905fa03")]}
	${"Downgrade the grumpy cat module from 3.1.4 to 3.0.0"}         | ${["Downgrade the grumpy cat module from ", dependencyVersion("3.1.4"), " to ", dependencyVersion("3.0.0")]}
	${"Release v0.1.0-next"}                                         | ${["Release ", dependencyVersion("v0.1.0-next")]}
	${"Pin the Node.js image to 4af617c"}                            | ${["Pin the Node.js image to ", dependencyVersion("4af617c")]}
	${"Upgrade nginx image digest to 9d739ff1ada6"}                  | ${["Upgrade nginx image digest to ", dependencyVersion("9d739ff1ada6")]}
	${"#2: Refresh master to commit dfbc095"}                        | ${[issueLink("#2: "), "Refresh master to commit ", dependencyVersion("dfbc095")]}
	${"fixup! Bump @typescript-eslint/parser from 5.52.0 to 5.59.1"} | ${[squashMarker("fixup! "), "Bump @typescript-eslint/parser from ", dependencyVersion("5.52.0"), " to ", dependencyVersion("5.59.1")]}
	${"amend! Upgrade React to 19.2.0 (#52)"}                        | ${[squashMarker("amend! "), "Upgrade React to ", dependencyVersion("19.2.0"), issueLink(" (#52)")]}
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
			expect(commit.subjectLine).toEqual([props.subjectLine])
		})
	},
)
