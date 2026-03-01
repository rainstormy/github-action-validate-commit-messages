import { mockGitCommand } from "#utilities/git/cli/RunGitCommand.mocks.ts"
import {
	fakeGitLogCommitDto,
	type GitLogCommitDtoTemplate,
} from "#utilities/git/cli/dtos/GitLogCommitDto.fixtures.ts"
import type { GitLogCommitDto } from "#utilities/git/cli/dtos/GitLogCommitDto.ts"

export function mockGitLog(dtos: Array<GitLogCommitDtoTemplate>): void {
	mockGitCommand("remote", { output: "origin" })
	mockGitCommand("rev-parse --abbrev-ref origin/HEAD", {
		output: "origin/main",
	})
	mockGitCommand("--no-pager log --format=raw --no-color origin/main..HEAD", {
		output: dtos
			.map(fakeGitLogCommitDto)
			.map(formatCommitDto)
			.reverse()
			.join("\n\n"),
	})
}

export function mockSabotagedGitLog(): void {
	mockGitCommand("remote", { output: "origin" })
	mockGitCommand("rev-parse --abbrev-ref origin/HEAD", {
		output: "origin/main",
	})
	mockGitCommand("--no-pager log --format=raw --no-color origin/main..HEAD", {
		exitCode: 128,
	})
}

function formatCommitDto(dto: GitLogCommitDto): string {
	const {
		commit: [sha],
		message,
		...otherFields
	} = dto

	const formattedFields = Object.entries(otherFields)
		.flatMap(([key, lines]) => lines.map((line) => [key, line] as const))
		.map(([key, line]) => `${key} ${line.split("\n").join("\n ")}`)
		.join("\n")

	const formattedMessage = message[0]
		.split("\n")
		.map((line) => (line !== "" ? `    ${line}` : ""))
		.join("\n")

	return `commit ${sha}\n${formattedFields}\n\n${formattedMessage}`
}
