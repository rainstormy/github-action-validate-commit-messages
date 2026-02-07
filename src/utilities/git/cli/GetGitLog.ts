import type { CommitSha } from "#types/CommitSha.ts"
import { runGitCommand } from "#utilities/git/cli/RunGitCommand.ts"

export type GitLogCommit = {
	sha: CommitSha
	parents: Array<CommitSha>
	authorName: string | null
	authorEmail: string | null
	committerName: string | null
	committerEmail: string | null
	message: string
}

export type GitLogCommits = Array<GitLogCommit>

export async function getGitLog(baseRef: string): Promise<GitLogCommits> {
	const output = await runGitCommand([
		"--no-pager", // Print all output at once instead of using pagination.
		"log",
		"--format=raw",
		"--no-color",
		`${baseRef}..HEAD`,
	])

	return parseGitLog(output)
}

function parseGitLog(output: string): GitLogCommits {
	if (output === "") {
		return []
	}

	const commits: GitLogCommits = []
	const lines = output.split("\n")

	let currentCommit: Partial<GitLogCommit> | null = null
	let messageLines: Array<string> = []

	for (const line of lines) {
		if (line.startsWith("commit ")) {
			// Save previous commit if exists
			if (currentCommit !== null) {
				commits.push({
					...currentCommit,
					message: messageLines.join("\n").trim(),
				} as GitLogCommit)
				messageLines = []
			}

			// Start new commit
			const sha = line.slice("commit ".length).trim()
			currentCommit = {
				sha: sha as CommitSha,
				parents: [],
				authorName: null,
				authorEmail: null,
				committerName: null,
				committerEmail: null,
			}
		} else if (line.startsWith("tree ")) {
			// Skip tree line
		} else if (line.startsWith("parent ")) {
			const parent = line.slice("parent ".length).trim()
			if (currentCommit) {
				currentCommit.parents = [
					...(currentCommit.parents || []),
					parent as CommitSha,
				]
			}
		} else if (line.startsWith("author ")) {
			const authorInfo = line.slice("author ".length)
			const { name, email } = parseNameEmail(authorInfo)
			if (currentCommit) {
				currentCommit.authorName = name
				currentCommit.authorEmail = email
			}
		} else if (line.startsWith("committer ")) {
			const committerInfo = line.slice("committer ".length)
			const { name, email } = parseNameEmail(committerInfo)
			if (currentCommit) {
				currentCommit.committerName = name
				currentCommit.committerEmail = email
			}
		} else if (line === "") {
			// Empty line may indicate start of message or separation between commits
			if (currentCommit !== null && messageLines.length > 0) {
				messageLines.push("")
			}
		} else if (line.startsWith("    ")) {
			// Message lines are indented with 4 spaces
			messageLines.push(line.slice(4))
		}
	}

	// Save last commit
	if (currentCommit !== null) {
		commits.push({
			...currentCommit,
			message: messageLines.join("\n").trim(),
		} as GitLogCommit)
	}

	return commits
}

function parseNameEmail(line: string): {
	name: string | null
	email: string | null
} {
	// Format: "Name <email> timestamp timezone"
	const match = line.match(/^(.+?)\s+<([^>]*)>\s+\d+\s+[+-]\d{4}$/)

	if (!match) {
		return { name: null, email: null }
	}

	const name = match[1].trim() || null
	const email = match[2].trim() || null

	return { name, email }
}
