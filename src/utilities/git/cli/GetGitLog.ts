import type { CommitSha } from "#types/CommitSha.ts"
import { notEmptyString } from "#utilities/Arrays.ts"
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

const delimiter = "<<<COMMIT_DELIMITER>>>"
const fieldSeparator = "<<<FIELD_SEPARATOR>>>"

export async function getGitLog(
	from: string,
	to: string,
): Promise<Array<GitLogCommit>> {
	const format = [
		"%H", // commit hash
		"%P", // parent hashes
		"%an", // author name
		"%ae", // author email
		"%cn", // committer name
		"%ce", // committer email
		"%B", // commit message (body)
	].join(fieldSeparator)

	const output = await runGitCommand([
		"log",
		`--format=${delimiter}${format}`,
		`${from}..${to}`,
	])

	return parseGitLog(output)
}

function parseGitLog(output: string): Array<GitLogCommit> {
	if (output.trim() === "") {
		return []
	}

	return output.split(delimiter).filter(notEmptyString).map(parseCommit)
}

function parseCommit(commitBlock: string): GitLogCommit {
	const fields = commitBlock.split(fieldSeparator)

	const [
		sha,
		parentsRaw,
		authorName,
		authorEmail,
		committerName,
		committerEmail,
		...messageLines
	] = fields

	const parents = parentsRaw
		.trim()
		.split(" ")
		.filter(notEmptyString) as Array<CommitSha>
	const message = messageLines.join(fieldSeparator).trim()

	return {
		sha: sha as CommitSha,
		parents,
		authorName: authorName || null,
		authorEmail: authorEmail || null,
		committerName: committerName || null,
		committerEmail: committerEmail || null,
		message,
	}
}
