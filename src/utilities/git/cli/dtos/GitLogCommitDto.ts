export type GitLogCommitDto = {
	author: Array<string>
	commit: [string]
	committer: Array<string>
	message: [string]
	parent: Array<string>
	[key: string]: Array<string>
}
