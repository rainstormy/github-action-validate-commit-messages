import type { Commit, Commits } from "#commits/Commit.ts"
import type { GithubCommitDto } from "#utilities/github/api/dtos/GithubCommitDto.ts"
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
		authorName: dto.commit.author?.name ?? null,
		authorEmail: dto.commit.author?.email ?? null,
		committerName: dto.commit.committer?.name ?? null,
		committerEmail: dto.commit.committer?.email ?? null,
		parents: dto.parents.map((parentDto) => parentDto.sha),
		subjectLine,
		bodyLines,
	}
}
