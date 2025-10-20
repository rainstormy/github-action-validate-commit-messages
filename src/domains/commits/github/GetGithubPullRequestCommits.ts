import type { Commit, Commits, CommitUser } from "#commits/Commit.ts"
import type { GithubCommitDto } from "#utilities/github/api/dtos/GithubCommitDto.ts"
import type { GithubCommitUserDto } from "#utilities/github/api/dtos/GithubCommitUserDto.ts"
import { fetchGithubPullRequestCommitDtos } from "#utilities/github/api/FetchGithubPullRequestCommitDtos.ts"
import { getGithubPullRequestNumber } from "#utilities/github/event/GetGithubPullRequestNumber.ts"

export async function getGithubPullRequestCommits(): Promise<Commits> {
	const pullRequestNumber = await getGithubPullRequestNumber()

	if (pullRequestNumber === null) {
		throw new Error(
			"The 'rainstormy/comet' action expects the workflow trigger to be a 'pull_request' event.",
		)
	}

	const dtos = await fetchGithubPullRequestCommitDtos(pullRequestNumber)
	return dtos.map(mapDtoToCommit)
}

function mapDtoToCommit(dto: GithubCommitDto): Commit {
	const [subjectLine = "", ...bodyLines] = dto.commit.message.split("\n")

	return {
		sha: dto.sha,
		author: mapDtoToCommitUser(dto.commit.author),
		committer: mapDtoToCommitUser(dto.commit.committer),
		parents: dto.parents.map((parentDto) => parentDto.sha),
		subjectLine,
		bodyLines,
	}
}

function mapDtoToCommitUser(userDto: GithubCommitUserDto | null): CommitUser {
	return {
		name: userDto?.name ?? null,
		email: userDto?.email ?? null,
	}
}
