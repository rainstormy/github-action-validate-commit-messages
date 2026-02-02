import { beforeEach, vi } from "vitest"
import type { ModuleMock } from "#types/ModuleMock.ts"
import { GitCommandError } from "#utilities/git/cli/GitCommandError.ts"

const resultsByCommand: Map<string, GitCommandResult> = vi.hoisted(
	() => new Map<string, GitCommandResult>(),
)

type GitCommandResult =
	| { output: string; exitCode?: 0 }
	| { output?: string; exitCode: number }

const mock: RunGitCommandMock = vi.hoisted(
	(): RunGitCommandMock => ({
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

			return result.output?.trim() ?? ""
		}),
	}),
)

const indent = "  "

function getExpectedCommands(): string {
	return Array.from(resultsByCommand.keys())
		.filter(Boolean)
		.map((key) => `${indent}${key}`)
		.join("\n")
}

export type RunGitCommandMock = ModuleMock<
	typeof import("#utilities/git/cli/RunGitCommand.ts") // CAUTION: `vi.mock()` below must always refer to the same path as here.
>

vi.mock("#utilities/git/cli/RunGitCommand.ts", () => mock)

export function mockGitCli(): void {
	beforeEach(() => {
		resultsByCommand.clear()
	})
}

export function mockGitCommand(
	command: string,
	result: GitCommandResult,
): void {
	resultsByCommand.set(command, result)
}
