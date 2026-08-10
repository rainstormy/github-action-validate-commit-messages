import { program } from "#programs/Program.ts"
import type { ExitCode } from "#types/ExitCode.ts"

export async function githubActionsProgram(): Promise<ExitCode> {
	return program([])
}
