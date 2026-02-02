import { notEmptyString } from "#utilities/Arrays.ts"
import { runGitCommand } from "#utilities/git/cli/RunGitCommand.ts"

export async function getGitRemotes(): Promise<Array<string>> {
	const output = await runGitCommand(["remote"])
	return output.split("\n").filter(notEmptyString)
}
