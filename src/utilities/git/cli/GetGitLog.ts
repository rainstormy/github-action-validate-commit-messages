import { runGitCommand } from "#utilities/git/cli/RunGitCommand.ts"

export type GitLogCommitDto = {
	commit: [string]
	message: Array<string>
	[key: string]: Array<string>
}

export async function getGitLog(
	fromRef: string,
	toRef: string,
): Promise<Array<GitLogCommitDto>> {
	const range = `${fromRef}..${toRef}`
	const output = await runGitCommand([
		"--no-pager", // Print all output at once instead of using pagination.
		"log",
		"--format=raw",
		"--no-color",
		range,
	])

	if (output === "") {
		return []
	}

	const lines = output.split("\n")
	const [firstLine, ...remainingLines] = lines

	assertCommitLine(firstLine, range)
	return mapLogLinesToCommitDtos(firstLine, remainingLines)
}

function mapLogLinesToCommitDtos(
	firstLine: `commit ${string}`,
	remainingLines: Array<string>,
): Array<GitLogCommitDto> {
	const commitDtos: Array<GitLogCommitDto> = []

	function addCommitDto(dto: GitLogCommitDto): void {
		commitDtos.push(dropTrailingEmptyLines(dto))
	}

	let currentCommitDto = gitLogCommitDto(firstLine.slice("commit ".length))
	let currentKey = ""

	for (const line of remainingLines) {
		if (line.startsWith("commit ")) {
			addCommitDto(currentCommitDto)
			currentCommitDto = gitLogCommitDto(line.slice("commit ".length))

			// A commit message.
		} else if (line.startsWith("    ")) {
			currentKey = "message"
			currentCommitDto.message.push(line.slice("    ".length))

			// A blank line.
		} else if (line === "") {
			currentCommitDto[currentKey]?.push("")

			// A multiline value.
		} else if (line.startsWith(" ")) {
			currentCommitDto[currentKey]?.push(line.slice(" ".length))

			// A key-value field.
		} else if (line.includes(" ")) {
			const valueIndex = line.indexOf(" ")

			const value = line.slice(valueIndex + " ".length)
			currentKey = line.slice(0, valueIndex)

			if (currentCommitDto[currentKey] === undefined) {
				currentCommitDto[currentKey] = []
			}

			currentCommitDto[currentKey]?.push(value)
		}
	}

	addCommitDto(currentCommitDto)
	return commitDtos
}

function gitLogCommitDto(commitSha: string): GitLogCommitDto {
	return { commit: [commitSha], message: [] }
}

function dropTrailingEmptyLines(dto: GitLogCommitDto): GitLogCommitDto {
	return Object.fromEntries(
		Object.entries(dto).map(([key, value]) => [
			key,
			value.at(-1) === "" ? value.slice(0, -1) : value,
		]),
	) as GitLogCommitDto
}

function assertCommitLine(
	line: string | undefined,
	logRange: string,
): asserts line is `commit ${string}` {
	if (!line?.startsWith("commit ")) {
		throw new Error(`Unexpected line in the Git log of ${logRange}: ${line}`)
	}
}
