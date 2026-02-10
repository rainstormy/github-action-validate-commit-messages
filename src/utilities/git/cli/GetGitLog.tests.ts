import { mockGitCommand } from "#utilities/git/cli/RunGitCommand.mocks.ts"
import { beforeEach, describe, expect, it } from "vitest"
import {
	type GitLogCommitDto,
	getGitLog,
} from "#utilities/git/cli/GetGitLog.ts"

describe.each`
	fromRef                                        | toRef
	${"github/main"}                               | ${"HEAD"}
	${"19b5b1b71002186c0b02d4d852cc65d358b70141a"} | ${"origin/develop"}
`(
	"when there are no commits between $fromRef and $toRef",
	(props: { fromRef: string; toRef: string }) => {
		beforeEach(() => {
			mockGitCommand(
				`--no-pager log --format=raw --no-color ${props.fromRef}..${props.toRef}`,
				{ output: "" },
			)
		})

		it("returns an empty list", async () => {
			const actualCommits = await getGitLog(props.fromRef, props.toRef)
			expect(actualCommits).toEqual<Array<GitLogCommitDto>>([])
		})
	},
)

describe("when there is 1 commit with no parents", () => {
	beforeEach(() => {
		mockGitCommand("--no-pager log --format=raw --no-color origin/main..HEAD", {
			output: `
commit d13efe7d13084bf4a026f74349478d40a713949e
tree 6feccc6788c0ef8667a9aaf6386d72b6b5deba17
author Leonardo da Vinci <71091436+katanaturtle@users.noreply.github.com> 1766222736 -0500
committer Leonardo da Vinci <71091436+katanaturtle@users.noreply.github.com> 1766222736 -0500

    init
`,
		})
	})

	it("returns 1 commit", async () => {
		const actualCommits = await getGitLog("origin/main", "HEAD")
		expect(actualCommits).toEqual<Array<GitLogCommitDto>>([
			{
				commit: ["d13efe7d13084bf4a026f74349478d40a713949e"],
				tree: ["6feccc6788c0ef8667a9aaf6386d72b6b5deba17"],
				author: [
					"Leonardo da Vinci <71091436+katanaturtle@users.noreply.github.com> 1766222736 -0500",
				],
				committer: [
					"Leonardo da Vinci <71091436+katanaturtle@users.noreply.github.com> 1766222736 -0500",
				],
				message: ["init"],
			},
		])
	})
})

describe("when there is 1 commit with a single parent", () => {
	beforeEach(() => {
		mockGitCommand("--no-pager log --format=raw --no-color origin/main..HEAD", {
			output: `
commit 3ed87c9813318c942b8729d52b84027b584b5
tree d8242af2d280a7805e8d481a8ac36b7224edde6d
parent b34f54dae2045478f57846dfdd5762f4afb721
author Raph <97126801+theraffaelloexperience@users.noreply.github.com> 1769800893 -0500
committer Master Splinter <58390854+sensei@users.noreply.github.com> 1769801867 -0500

    Fight the Foot Clan
`,
		})
	})

	it("returns a list with 1 commit", async () => {
		const actualCommits = await getGitLog("origin/main", "HEAD")
		expect(actualCommits).toEqual<Array<GitLogCommitDto>>([
			{
				commit: ["3ed87c9813318c942b8729d52b84027b584b5"],
				tree: ["d8242af2d280a7805e8d481a8ac36b7224edde6d"],
				parent: ["b34f54dae2045478f57846dfdd5762f4afb721"],
				author: [
					"Raph <97126801+theraffaelloexperience@users.noreply.github.com> 1769800893 -0500",
				],
				committer: [
					"Master Splinter <58390854+sensei@users.noreply.github.com> 1769801867 -0500",
				],
				message: ["Fight the Foot Clan"],
			},
		])
	})
})

// describe("when there is 1 commit with 2 parents (merge commit)", () => {
// 	beforeEach(() => {
// 		mockGitCommand("--no-pager log --format=raw --no-color origin/main..HEAD", {
// 			output: `
// commit 13441212913598c08d18d15ccc3aed86ab24a1b
// tree b03e611c6d8ff9c63932ef5868253fc52c65cc
// parent fd2d1de72b1ac59bfb375a0e1e946926ceb99d
// parent 7ea6b181df3b6cac8989a46cc6623f74d686dd1
// author Donatello <donatello@tmnt.com> 1234567890 +0000
// committer Donatello <donatello@tmnt.com> 1234567890 +0000
//
//     Merge turtle power with technological genius
// `,
// 		})
// 	})
//
// 	it("returns a list with 1 commit with 2 parents", async () => {
// 		const actualCommits = await getGitLog("origin/main")
// 		expect(actualCommits).toEqual([
// 			{
// 				sha: "merge123456789012345678901234567890abcdef",
// 				parents: [
// 					"2222222222222222222222222222222222222222",
// 					"3333333333333333333333333333333333333333",
// 				],
// 				authorName: "Donatello",
// 				authorEmail: "donatello@tmnt.com",
// 				committerName: "Donatello",
// 				committerEmail: "donatello@tmnt.com",
// 				message: "Merge turtle power with technological genius",
// 			},
// 		])
// 	})
// })
//
// describe("when there is 1 commit with 3 parents", () => {
// 	beforeEach(() => {
// 		mockGitCommand("--no-pager log --format=raw --no-color origin/main..HEAD", {
// 			output: `
// commit 6bbee9b37a298f5e9140127d6363ed1d69d44f
// tree 10205843deec3d2f71d4c1cc52a898467f246a7b
// parent 5d5a4a61a0ac31c52c8f24412fa4732dfae48a9
// parent 67c7cf2a57f70ab31eb375337b4ff5db31b6829
// parent 6eb0d577bc0dd5b35949dc16f95882c75d9c7dd
// author Leonardo <leonardo@tmnt.com> 1234567890 +0000
// committer Leonardo <leonardo@tmnt.com> 1234567890 +0000
//
//     Unite all turtle branches
// `,
// 		})
// 	})
//
// 	it("returns a list with 1 commit with 3 parents", async () => {
// 		const actualCommits = await getGitLog("origin/main")
// 		expect(actualCommits).toEqual([
// 			{
// 				sha: "octopusmerge12345678901234567890abcdef12",
// 				parents: [
// 					"4444444444444444444444444444444444444444",
// 					"5555555555555555555555555555555555555555",
// 					"6666666666666666666666666666666666666666",
// 				],
// 				authorName: "Leonardo",
// 				authorEmail: "leonardo@tmnt.com",
// 				committerName: "Leonardo",
// 				committerEmail: "leonardo@tmnt.com",
// 				message: "Unite all turtle branches",
// 			},
// 		])
// 	})
// })
//
// describe("when there is 1 commit with a signature", () => {
// 	beforeEach(() => {
// 		mockGitCommand("--no-pager log --format=raw --no-color origin/main..HEAD", {
// 			output: `¨¨
// commit 76c79cc7bd33295c2c53aff2d1a25c9e698ab10
// tree f36f404d67ee425b1e8e3374222eeb8cecff54
// parent b8f2e2cca67d1e1866a58848c259d11b9c8f1
// author Master Splinter <splinter@sewers.nyc> 1675536219 +0100
// committer Master Splinter <splinter@sewers.nyc> 1675536219 +0100
// gpgsig -----BEGIN SSH SIGNATURE-----
//  k1MWQyOTVmM2UzY2E0YjFhNWRkN2UyZjY3ODk5MzJlZDM1NTRlZmY3NWY5OTg1OWFjMzdj
//  OWQ4MjI3OWFhMGIzYTE2N2U/YWNmMTVkMzVhNzE0NmI4ZmZiODFkNzk1ZWVhM2QxOWMwNT
//  YzFmMDExZWZiZGQ1NzAxNTQxYWY1YTQ0MTI4YzE4N2UzNTc3ZjNiMjg+3NzVmNjBkNmIyM
//  jQkODBmOWFlNmNlOTU4GU=
//  -----END SSH SIGNATURE-----
//
//     Teach the ancient art of ninjutsu
// `,
// 		})
// 	})
//
// 	it("returns a list with 1 commit, ignoring the signature", async () => {
// 		const actualCommits = await getGitLog("origin/main")
// 		expect(actualCommits).toEqual([
// 			{
// 				sha: "signedcommit78901234567890abcdef1234567",
// 				parents: ["7777777777777777777777777777777777777777"],
// 				authorName: "Master Splinter",
// 				authorEmail: "splinter@sewers.nyc",
// 				committerName: "Master Splinter",
// 				committerEmail: "splinter@sewers.nyc",
// 				message: "Teach the ancient art of ninjutsu",
// 			},
// 		])
// 	})
// })
//
// describe("when there is 1 commit with no parents", () => {
// 	beforeEach(() => {
// 		mockGitCommand("--no-pager log --format=raw --no-color origin/main..HEAD", {
// 			output: `
// commit 26ecb332bc4787332cc9bb5fff90c8100225a69ff
// tree bd30f04235483f8c8732e5858259e019a3c3f
// author Leonardo <leonardo@tmnt.com> 1675536219 +0100
// committer Leonardo <leonardo@tmnt.com> 1675536219 +0100
// gpgsig -----BEGIN SSH SIGNATURE-----
//  k1MWQyOTVmM2UzY2E0YjFhNWRkN2UyZjY3ODk5MzJlZDM1NTRlZmY3NWY5OTg1OWFjMzdj
//  OWQ4MjI3OWFhMGIzYTE2N2U/YWNmMTVkMzVhNzE0NmI4ZmZiODFkNzk1ZWVhM2QxOWMwNT
//  YzFmMDExZWZiZGQ1NzAxNTQxYWY1YTQ0MTI4YzE4N2UzNTc3ZjNiMjg+3NzVmNjBkNmIyM
//  jQkODBmOWFlNmNlOTU4GU=
//  -----END SSH SIGNATURE-----
//
//     Master the art of ninjutsu
// `,
// 		})
// 	})
//
// 	it("returns an empty list", async () => {
// 		const actualCommits = await getGitLog("origin/main")
// 		expect(actualCommits).toEqual([])
// 	})
// })
//
// describe("TODO", () => {
// 	beforeEach(() => {
// 		mockGitCommand("--no-pager log --format=raw --no-color origin/main..HEAD", {
// 			output: `
// commit 9b909f1212ab8f1673225c4eb59253090991419
// tree f379bf889f7b3d44afccd6e41de5e9fa29a29cf
// parent 4e8634e063ffebb4328cf4ef712a12c5fbcab42
// author Shredder <shredder@footclan.org> 1234567890 +0000
// committer Bebop <bebop@footclan.org> 1234567890 +0000
//
//     feat: Construct the Technodrome
//
//     A mobile fortress equipped with the latest
//     alien technology from Dimension X.
// `,
// 		})
// 	})
//
// 	it("returns a list with 1 commit preserving the multiline message", async () => {
// 		const actualCommits = await getGitLog("origin/main")
// 		expect(actualCommits).toEqual([
// 			{
// 				sha: "multiline1234567890abcdef1234567890abcd",
// 				parents: ["8888888888888888888888888888888888888888"],
// 				authorName: "Shredder",
// 				authorEmail: "shredder@footclan.org",
// 				committerName: "Bebop",
// 				committerEmail: "bebop@footclan.org",
// 				message:
// 					"feat: Construct the Technodrome\n\nA mobile fortress equipped with the latest\nalien technology from Dimension X.",
// 			},
// 		])
// 	})
// })
//
// describe("when there is 1 commit with an empty author name", () => {
// 	beforeEach(() => {
// 		mockGitCommand("--no-pager log --format=raw --no-color origin/main..HEAD", {
// 			output: `
// commit d58aadcb3c9631eee32d576575b52fb2ecc056ab
// tree f35ee9ab738e76424433ef9bd8f16f368596d5
// parent dd866b504fae907031448935ffea284fd2d8ea8e
// author <mysterious@tmnt.com> 1234567890 +0000
// committer Master Splinter <splinter@sewers.nyc> 1234567890 +0000
//
//     Train in the shadows
// `,
// 		})
// 	})
//
// 	it("returns a list with 1 commit with null author name", async () => {
// 		const actualCommits = await getGitLog("origin/main")
// 		expect(actualCommits).toEqual([
// 			{
// 				sha: "noauthor567890abcdef1234567890abcdef123",
// 				parents: ["9999999999999999999999999999999999999999"],
// 				authorName: null,
// 				authorEmail: "mysterious@tmnt.com",
// 				committerName: "Master Splinter",
// 				committerEmail: "splinter@sewers.nyc",
// 				message: "Train in the shadows",
// 			},
// 		])
// 	})
// })
//
// describe("when there is 1 commit with an empty committer name", () => {
// 	beforeEach(() => {
// 		mockGitCommand("--no-pager log --format=raw --no-color origin/main..HEAD", {
// 			output: `
// commit 2cf194ae36822fc769df1299bb664a711293
// tree 7d1be1bcf095402c9ec557aed58a28afcb42ead
// parent d89b1a2bae10037d51e0b8e1909d334a41a05f
// author Michelangelo <michelangelo@tmnt.com> 1234567890 +0000
// committer <casey@vigilante.nyc> 1234567890 +0000
//
//     Cowabunga! Pizza time!
// `,
// 		})
// 	})
//
// 	it("returns a list with 1 commit with null committer name", async () => {
// 		const actualCommits = await getGitLog("origin/main")
// 		expect(actualCommits).toEqual([
// 			{
// 				sha: "nocommitter890abcdef1234567890abcdef123",
// 				parents: ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"],
// 				authorName: "Michelangelo",
// 				authorEmail: "michelangelo@tmnt.com",
// 				committerName: null,
// 				committerEmail: "casey@vigilante.nyc",
// 				message: "Cowabunga! Pizza time!",
// 			},
// 		])
// 	})
// })
//
// describe("when there are 2 commits", () => {
// 	beforeEach(() => {
// 		mockGitCommand("--no-pager log --format=raw --no-color origin/main..HEAD", {
// 			output: `
// commit f319eba917534964b83177abaa3de4bee24ee0fd
// tree e5aeef82441e9041529c2d36c462cc9d5520e3
// parent 3fe0d6bd8da08bb238d2102ebfcb4d1257d40d5
// author Krang <krang@dimensionx.com> 1234567890 +0000
// committer Krang <krang@dimensionx.com> 1234567890 +0000
//
//     Deploy mutagen to the streets
//
// commit 9cd55379ae9a5107dcfd4dc8637b597112947be
// tree 3b4568b7e333c17d5777bdfc919832ace2e0ae56
// parent 7510ce207c15627da956d49da26f2726c36270
// author Rocksteady <rocksteady@footclan.org> 1234567890 +0000
// committer Rocksteady <rocksteady@footclan.org> 1234567890 +0000
//
//     Locate the turtle lair
// `,
// 		})
// 	})
//
// 	it("returns a list with 2 commits in chronological order", async () => {
// 		const actualCommits = await getGitLog("origin/main")
// 		expect(actualCommits).toEqual([
// 			{
// 				sha: "twocommit2890abcdef1234567890abcdef1234",
// 				parents: ["twocommit1890abcdef1234567890abcdef1234"],
// 				authorName: "Krang",
// 				authorEmail: "krang@dimensionx.com",
// 				committerName: "Krang",
// 				committerEmail: "krang@dimensionx.com",
// 				message: "Deploy mutagen to the streets",
// 			},
// 			{
// 				sha: "twocommit1890abcdef1234567890abcdef1234",
// 				parents: ["bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"],
// 				authorName: "Rocksteady",
// 				authorEmail: "rocksteady@footclan.org",
// 				committerName: "Rocksteady",
// 				committerEmail: "rocksteady@footclan.org",
// 				message: "Locate the turtle lair",
// 			},
// 		])
// 	})
// })

describe("when the 'git log' command fails", () => {
	beforeEach(() => {
		mockGitCommand(
			"--no-pager log --format=raw --no-color upstream/next..HEAD",
			{ exitCode: 128 },
		)
	})

	it("throws an error", async () => {
		await expect(getGitLog("upstream/next", "HEAD")).rejects.toThrow(
			"Command 'git --no-pager log --format=raw --no-color upstream/next..HEAD' failed with exit code 128",
		)
	})
})
