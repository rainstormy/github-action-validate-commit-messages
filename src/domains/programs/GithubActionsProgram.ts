import { program } from "#programs/Program"
import type { ExitCode } from "#types/ExitCode"

export async function githubActionsProgram(): Promise<ExitCode> {
	return program([])
}
