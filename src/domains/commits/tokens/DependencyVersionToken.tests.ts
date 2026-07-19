import { describe, expect, it } from "vitest"
import { mapCrudeCommitToCommit } from "#commits/Commit.ts"
import { fakeCrudeCommit } from "#commits/CrudeCommit.fixtures.ts"
import {
	type Tokens,
	issuelink,
	punctuation,
	revert,
	semver,
	space,
	squash,
	word,
} from "#commits/tokens/Token.ts"
import { fakeTokenConfiguration } from "#configurations/Configuration.fixtures.ts"

const configuration = fakeTokenConfiguration()

describe.each`
	subjectLine                                                      | expectedTokens
	${"introduce v1.2.3"}                                            | ${[word("introduce"), space(9), semver("v1.2.3", 10)]}
	${"Install pnpm 10.32.0"}                                        | ${[word("Install"), space(7), word("pnpm", 8), space(12), semver("10.32.0", 13)]}
	${"Pre-release v10.0.0-beta.1"}                                  | ${[word("Pre-release"), space(11), semver("v10.0.0-beta.1", 12)]}
	${"Bump vite from 4.1.1-beta.0 to 4.3.2"}                        | ${[word("Bump"), space(4), word("vite", 5), space(9), word("from", 10), space(14), semver("4.1.1-beta.0", 15), space(27), word("to", 28), space(30), semver("4.3.2", 31)]}
	${"Upgrade tsgo to 7.0.0-dev.20260131.1"}                        | ${[word("Upgrade"), space(7), word("tsgo", 8), space(12), word("to", 13), space(15), semver("7.0.0-dev.20260131.1", 16)]}
	${"Update dependency to v2.0.0-rc.1+4905fa03"}                   | ${[word("Update"), space(6), word("dependency", 7), space(17), word("to", 18), space(20), semver("v2.0.0-rc.1+4905fa03", 21)]}
	${"Downgrade the grumpy cat module from 3.1.4 to 3.0.0"}         | ${[word("Downgrade"), space(9), word("the", 10), space(13), word("grumpy", 14), space(20), word("cat", 21), space(24), word("module", 25), space(31), word("from", 32), space(36), semver("3.1.4", 37), space(42), word("to", 43), space(45), semver("3.0.0", 46)]}
	${"Release v0.1.0-next"}                                         | ${[word("Release"), space(7), semver("v0.1.0-next", 8)]}
	${"Pin the Node.js image to 4af617c"}                            | ${[word("Pin"), space(3), word("the", 4), space(7), word("Node", 8), punctuation(".", 12), word("js", 13), space(15), word("image", 16), space(21), word("to", 22), space(24), semver("4af617c", 25)]}
	${"Upgrade nginx image digest to 9d739ff1ada6"}                  | ${[word("Upgrade"), space(7), word("nginx", 8), space(13), word("image", 14), space(19), word("digest", 20), space(26), word("to", 27), space(29), semver("9d739ff1ada6", 30)]}
	${'Revert "Upgrade nginx image digest to 9d739ff1ada6"'}         | ${[revert("Revert"), space(6), punctuation('"', 7), word("Upgrade", 8), space(15), word("nginx", 16), space(21), word("image", 22), space(27), word("digest", 28), space(34), word("to", 35), space(37), semver("9d739ff1ada6", 38), punctuation('"', 50)]}
	${"#2: Refresh master to commit dfbc095"}                        | ${[issuelink("#2:"), space(3), word("Refresh", 4), space(11), word("master", 12), space(18), word("to", 19), space(21), word("commit", 22), space(28), semver("dfbc095", 29)]}
	${"fixup! Bump @typescript-eslint/parser from 5.52.0 to 5.59.1"} | ${[squash("fixup!"), space(6), word("Bump", 7), space(11), punctuation("@", 12), word("typescript-eslint", 13), punctuation("/", 30), word("parser", 31), space(37), word("from", 38), space(42), semver("5.52.0", 43), space(49), word("to", 50), space(52), semver("5.59.1", 53)]}
	${"amend! Upgrade React to 19.2.0 (#52)"}                        | ${[squash("amend!"), space(6), word("Upgrade", 7), space(14), word("React", 15), space(20), word("to", 21), space(23), semver("19.2.0", 24), space(30), issuelink("(#52)", 31)]}
`(
	"when the subject line of $subjectLine contains semantic dependency versions",
	(props: { subjectLine: string; expectedTokens: Tokens }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("extracts semver tokens", () => {
			expect(props.expectedTokens).toContainToken("semver")

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
	"when the subject line of $subjectLine does not contain any semantic dependency versions",
	(props: { subjectLine: string }) => {
		const crudeCommit = fakeCrudeCommit({ message: props.subjectLine })

		it("does not extract any semver tokens", () => {
			const commit = mapCrudeCommitToCommit(crudeCommit, configuration)
			expect(commit.subjectLine).not.toContainToken("semver")
		})
	},
)
