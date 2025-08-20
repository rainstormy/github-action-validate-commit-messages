import process from "node:process"
import { githubActionsProgram } from "#programs/GithubActionsProgram"
import type { ExitCode } from "#types/ExitCode"

const exitCode: ExitCode = await githubActionsProgram()
process.exit(exitCode)
