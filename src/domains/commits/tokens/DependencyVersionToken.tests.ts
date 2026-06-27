import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import { dependencyVersion } from "#commits/tokens/DependencyVersionToken.ts"
import { issueLink } from "#commits/tokens/IssueLinkToken.ts"
import { punctuation } from "#commits/tokens/PunctuationToken.ts"
import { revertMarker } from "#commits/tokens/RevertMarkerToken.ts"
import { squashMarker } from "#commits/tokens/SquashMarkerToken.ts"
import { type TokenisedLine, tokenisePlainText } from "#commits/tokens/Token.ts"
import { whitespace } from "#commits/tokens/WhitespaceToken.ts"
import { word } from "#commits/tokens/WordToken.ts"
import { fakeTokenConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeTokenConfiguration()

describe.each`
	subjectLine                                                      | expectedTokens
	${"introduce v1.2.3"}                                            | ${[word("introduce"), whitespace(" ", 9), dependencyVersion("v1.2.3", 10)]}
	${"Install pnpm 10.32.0"}                                        | ${[word("Install"), whitespace(" ", 7), word("pnpm", 8), whitespace(" ", 12), dependencyVersion("10.32.0", 13)]}
	${"Pre-release v10.0.0-beta.1"}                                  | ${[word("Pre-release"), whitespace(" ", 11), dependencyVersion("v10.0.0-beta.1", 12)]}
	${"Bump vite from 4.1.1-beta.0 to 4.3.2"}                        | ${[word("Bump"), whitespace(" ", 4), word("vite", 5), whitespace(" ", 9), word("from", 10), whitespace(" ", 14), dependencyVersion("4.1.1-beta.0", 15), whitespace(" ", 27), word("to", 28), whitespace(" ", 30), dependencyVersion("4.3.2", 31)]}
	${"Upgrade tsgo to 7.0.0-dev.20260131.1"}                        | ${[word("Upgrade"), whitespace(" ", 7), word("tsgo", 8), whitespace(" ", 12), word("to", 13), whitespace(" ", 15), dependencyVersion("7.0.0-dev.20260131.1", 16)]}
	${"Update dependency to v2.0.0-rc.1+4905fa03"}                   | ${[word("Update"), whitespace(" ", 6), word("dependency", 7), whitespace(" ", 17), word("to", 18), whitespace(" ", 20), dependencyVersion("v2.0.0-rc.1+4905fa03", 21)]}
	${"Downgrade the grumpy cat module from 3.1.4 to 3.0.0"}         | ${[word("Downgrade"), whitespace(" ", 9), word("the", 10), whitespace(" ", 13), word("grumpy", 14), whitespace(" ", 20), word("cat", 21), whitespace(" ", 24), word("module", 25), whitespace(" ", 31), word("from", 32), whitespace(" ", 36), dependencyVersion("3.1.4", 37), whitespace(" ", 42), word("to", 43), whitespace(" ", 45), dependencyVersion("3.0.0", 46)]}
	${"Release v0.1.0-next"}                                         | ${[word("Release"), whitespace(" ", 7), dependencyVersion("v0.1.0-next", 8)]}
	${"Pin the Node.js image to 4af617c"}                            | ${[word("Pin"), whitespace(" ", 3), word("the", 4), whitespace(" ", 7), word("Node", 8), punctuation(".", 12), word("js", 13), whitespace(" ", 15), word("image", 16), whitespace(" ", 21), word("to", 22), whitespace(" ", 24), dependencyVersion("4af617c", 25)]}
	${"Upgrade nginx image digest to 9d739ff1ada6"}                  | ${[word("Upgrade"), whitespace(" ", 7), word("nginx", 8), whitespace(" ", 13), word("image", 14), whitespace(" ", 19), word("digest", 20), whitespace(" ", 26), word("to", 27), whitespace(" ", 29), dependencyVersion("9d739ff1ada6", 30)]}
	${'Revert "Upgrade nginx image digest to 9d739ff1ada6"'}         | ${[revertMarker('Revert "', 1), word("Upgrade", 8), whitespace(" ", 15), word("nginx", 16), whitespace(" ", 21), word("image", 22), whitespace(" ", 27), word("digest", 28), whitespace(" ", 34), word("to", 35), whitespace(" ", 37), dependencyVersion("9d739ff1ada6", 38), revertMarker('"', 0, 50)]}
	${"#2: Refresh master to commit dfbc095"}                        | ${[issueLink("#2: "), word("Refresh", 4), whitespace(" ", 11), word("master", 12), whitespace(" ", 18), word("to", 19), whitespace(" ", 21), word("commit", 22), whitespace(" ", 28), dependencyVersion("dfbc095", 29)]}
	${"fixup! Bump @typescript-eslint/parser from 5.52.0 to 5.59.1"} | ${[squashMarker("fixup! "), word("Bump", 7), whitespace(" ", 11), punctuation("@", 12), word("typescript-eslint", 13), punctuation("/", 30), word("parser", 31), whitespace(" ", 37), word("from", 38), whitespace(" ", 42), dependencyVersion("5.52.0", 43), whitespace(" ", 49), word("to", 50), whitespace(" ", 52), dependencyVersion("5.59.1", 53)]}
	${"amend! Upgrade React to 19.2.0 (#52)"}                        | ${[squashMarker("amend! "), word("Upgrade", 7), whitespace(" ", 14), word("React", 15), whitespace(" ", 20), word("to", 21), whitespace(" ", 23), dependencyVersion("19.2.0", 24), issueLink(" (#52)", 30)]}
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
			expect(commit.subjectLine).toEqual(tokenisePlainText(props.subjectLine))
		})
	},
)
