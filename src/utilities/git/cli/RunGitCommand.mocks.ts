import { beforeEach, vi } from "vitest"
import { GitCommandError } from "#utilities/git/cli/GitCommandError.ts"

vi.mock(import("#utilities/git/cli/RunGitCommand.ts"), () => ({
	runGitCommand: vi.fn(async (args) => {
		const result = resultsByCommand.get(args.join(" ")) ?? null

		if (result === null) {
			throw new Error(
				`Unexpected Git command: ${args.join(" ")}\n\nExpected Git commands in the scope of this test case:\n${getExpectedCommands()}\n\n`,
			)
		}
		if (result.exitCode) {
			throw new GitCommandError({ args, exitCode: result.exitCode })
		}

		return result.output ?? ""
	}),
}))

const resultsByCommand = new Map<string, GitCommandResult>()

type GitCommandResult = GitCommandSucceeded | GitCommandFailed

type GitCommandSucceeded = { output: string; exitCode?: 0 }

type GitCommandFailed = { output?: string; exitCode: number }

const indent = "  "

function getExpectedCommands(): string {
	return [...resultsByCommand.keys()].map((key) => `${indent}${key}`).join("\n")
}

export function mockGitCli(): void {
	beforeEach(() => {
		resultsByCommand.clear()
	})
}

export function mockGitCommand(command: string, result: GitCommandResult): void {
	resultsByCommand.set(command, result)
}
