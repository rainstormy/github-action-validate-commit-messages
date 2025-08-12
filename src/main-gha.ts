import process from "node:process"
import { githubActionsProgram } from "#programs/GithubActionsProgram"

const exitCode = await githubActionsProgram()
process.exit(exitCode)
