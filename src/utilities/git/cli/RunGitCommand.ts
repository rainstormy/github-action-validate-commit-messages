// biome-ignore lint/correctness/noNodejsModules: This file needs access to spawning Git processes.
import { spawn } from "node:child_process"
import { GitCommandError } from "#utilities/git/cli/GitCommandError.ts"

export async function runGitCommand(
	args: [command: "remote" | "rev-parse", ...Array<string>],
): Promise<string> {
	return new Promise((resolve, reject) => {
		let stdout = ""
		let stderr = ""

		const git = spawn("git", args)

		git.stdout.on("data", (data) => {
			stdout += data.toString()
		})

		git.stderr.on("data", (data) => {
			stderr += data.toString()
		})

		git.on("close", (exitCode) => {
			if (exitCode === 0) {
				resolve(stdout.trim())
			} else {
				// This case occurs when Git raises an error with a non-zero exit code.
				reject(new GitCommandError({ args, exitCode, stderr }))
			}
		})

		git.on("error", (error) =>
			// This case occurs when the Git process cannot be spawned, e.g. if Git is not installed.
			reject(new GitCommandError({ args, cause: error })),
		)
	})
}
