import process from "node:process"
import { githubActionsProgram } from "#programs/GithubActionsProgram.ts"
import type { ExitCode } from "#types/ExitCode.ts"

const exitCode: ExitCode = await githubActionsProgram()
process.exit(exitCode)
