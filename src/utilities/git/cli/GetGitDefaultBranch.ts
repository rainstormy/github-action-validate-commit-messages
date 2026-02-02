import { getGitRemotes } from "#utilities/git/cli/GetGitRemotes.ts"
import { GitCommandError } from "#utilities/git/cli/GitCommandError.ts"
import { runGitCommand } from "#utilities/git/cli/RunGitCommand.ts"

export async function getGitDefaultBranch(): Promise<string | null> {
	const remote = await getPreferredRemote()

	if (remote !== null) {
		const remoteDefaultBranch = await runGitCommand([
			"rev-parse",
			"--abbrev-ref",
			`${remote}/HEAD`,
		])

		if (remoteDefaultBranch) {
			return remoteDefaultBranch
		}
	}

	return getLocalFallbackBranch()
}

async function getPreferredRemote(): Promise<string | null> {
	const remotes = await getGitRemotes()

	if (remotes.length === 0) {
		return null
	}
	if (remotes.includes("origin")) {
		return "origin"
	}

	return remotes.reduce((firstRemoteInAlphabeticalOrder, remote) =>
		remote.localeCompare(firstRemoteInAlphabeticalOrder) < 0
			? remote
			: firstRemoteInAlphabeticalOrder,
	)
}

async function getLocalFallbackBranch(): Promise<string | null> {
	if (await hasLocalBranch("main")) {
		return "main"
	}
	if (await hasLocalBranch("master")) {
		return "master"
	}
	return null
}

async function hasLocalBranch(branchName: string): Promise<boolean> {
	try {
		await runGitCommand(["rev-parse", "--verify", "--quiet", branchName])
		return true
	} catch (error) {
		if (error instanceof GitCommandError && error.exitCode) {
			return false
		}
		throw error
	}
}
