import { mockGitCommand } from "#utilities/git/cli/RunGitCommand.mocks.ts"
import { beforeEach, describe, expect, it } from "vitest"
import { getGitDefaultBranch } from "#utilities/git/cli/GetGitDefaultBranch.ts"

describe.each`
	remote        | defaultBranch
	${"github"}   | ${"main"}
	${"origin"}   | ${"develop"}
	${"origin"}   | ${"master"}
	${"upstream"} | ${"next"}
`(
	"when there is 1 remote with HEAD pointing to $defaultBranch",
	(props: { remote: string; defaultBranch: string }) => {
		beforeEach(() => {
			mockGitCommand("remote", { output: props.remote })
			mockGitCommand(`rev-parse --abbrev-ref ${props.remote}/HEAD`, {
				output: `${props.remote}/${props.defaultBranch}`,
			})
		})

		it("returns the default branch of the remote", async () => {
			const actualBranch = await getGitDefaultBranch()
			expect(actualBranch).toBe(props.defaultBranch)
		})
	},
)

describe("when there are 2 remotes including one named 'origin'", () => {
	beforeEach(() => {
		mockGitCommand("remote", { output: "github\norigin" })
		mockGitCommand("rev-parse --abbrev-ref origin/HEAD", {
			output: "origin/main",
		})
	})

	it("returns the default branch of the 'origin' remote", async () => {
		const actualBranch = await getGitDefaultBranch()
		expect(actualBranch).toBe("main")
	})
})

describe("when there are 2 remotes and none named 'origin'", () => {
	beforeEach(() => {
		mockGitCommand("remote", { output: "gitlab\nupstream" })
		mockGitCommand("rev-parse --abbrev-ref gitlab/HEAD", {
			output: "gitlab/next",
		})
	})

	it("returns the default branch of the first remote in alphabetical order", async () => {
		const actualBranch = await getGitDefaultBranch()
		expect(actualBranch).toBe("next")
	})
})

describe("when there are 3 remotes including one named 'origin'", () => {
	beforeEach(() => {
		mockGitCommand("remote", { output: "github\norigin\nupstream" })
		mockGitCommand("rev-parse --abbrev-ref origin/HEAD", {
			output: "origin/develop",
		})
	})

	it("returns the default branch of the 'origin' remote", async () => {
		const actualBranch = await getGitDefaultBranch()
		expect(actualBranch).toBe("develop")
	})
})

describe("when there are 3 remotes and none named 'origin'", () => {
	beforeEach(() => {
		mockGitCommand("remote", { output: "github\nupstream\ngitlab" })
		mockGitCommand("rev-parse --abbrev-ref github/HEAD", {
			output: "github/main",
		})
	})

	it("returns the default branch of the first remote in alphabetical order", async () => {
		const actualBranch = await getGitDefaultBranch()
		expect(actualBranch).toBe("main")
	})
})

describe.each`
	remote        | defaultBranch
	${"github"}   | ${"main"}
	${"origin"}   | ${"develop"}
	${"upstream"} | ${""}
`(
	"when the remote HEAD is not prefixed by the remote name $remote",
	(props: { remote: string; defaultBranch: string }) => {
		beforeEach(() => {
			mockGitCommand("remote", { output: props.remote })
			mockGitCommand(`rev-parse --abbrev-ref ${props.remote}/HEAD`, {
				output: props.defaultBranch,
			})
		})

		itAttemptsToFallBackToMainOrMaster()
	},
)

describe("when there are no remotes", () => {
	beforeEach(() => {
		mockGitCommand("remote", { output: "" })
	})

	itAttemptsToFallBackToMainOrMaster()
})

describe("when the Git remote command fails", () => {
	beforeEach(() => {
		mockGitCommand("remote", { exitCode: 1 })
	})

	it("throws an error", async () => {
		await expect(getGitDefaultBranch()).rejects.toThrow(
			"Command 'git remote' failed with exit code 1",
		)
	})
})

describe("when the Git rev-parse command fails", () => {
	beforeEach(() => {
		mockGitCommand("remote", { output: "origin" })
		mockGitCommand("rev-parse --abbrev-ref origin/HEAD", { exitCode: 128 })
	})

	it("throws an error", async () => {
		await expect(getGitDefaultBranch()).rejects.toThrow(
			"Command 'git rev-parse --abbrev-ref origin/HEAD' failed with exit code 128",
		)
	})
})

function itAttemptsToFallBackToMainOrMaster(): void {
	describe("and a branch named 'main' exists locally", () => {
		beforeEach(() => {
			mockGitCommand("rev-parse --verify --quiet main", {
				output: "d799201951a348548eb063b548289b1ad58d61fd",
			})
		})

		it("falls back to 'main'", async () => {
			const actualBranch = await getGitDefaultBranch()
			expect(actualBranch).toBe("main")
		})
	})

	describe("and a branch named 'main' does not exist locally", () => {
		beforeEach(() => {
			mockGitCommand("rev-parse --verify --quiet main", { exitCode: 1 })
		})

		describe("and a branch named 'master' exists locally", () => {
			beforeEach(() => {
				mockGitCommand("rev-parse --verify --quiet master", {
					output: "bc26eb14f7314ece80f0a28d33d59535288dbad1",
				})
			})

			it("falls back to 'master'", async () => {
				const actualBranch = await getGitDefaultBranch()
				expect(actualBranch).toBe("master")
			})
		})

		describe("and a branch named 'master' does not exist locally", () => {
			beforeEach(() => {
				mockGitCommand("rev-parse --verify --quiet master", { exitCode: 1 })
			})

			it("returns null", async () => {
				const actualBranch = await getGitDefaultBranch()
				expect(actualBranch).toBeNull()
			})
		})
	})
}
