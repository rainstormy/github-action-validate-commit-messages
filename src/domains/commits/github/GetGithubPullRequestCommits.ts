import type { Commit, Commits } from "#commits/Commit"
import type { GithubCommitDto } from "#utilities/github/api/dtos/GithubCommitDto"
import { fetchGithubPullRequestCommitDtos } from "#utilities/github/api/FetchGithubPullRequestCommitDtos"

export async function getGithubPullRequestCommits(
	pullRequestNumber: number,
): Promise<Commits> {
	const dtos = await fetchGithubPullRequestCommitDtos(pullRequestNumber)
	return dtos.map((dto: GithubCommitDto): Commit => {
		const [subjectLine = "", ...bodyLines] = dto.commit.message.split("\n")

		return {
			sha: dto.sha,
			author: {
				name: dto.commit.author?.name ?? null,
				emailAddress: dto.commit.author?.email ?? null,
			},
			committer: {
				name: dto.commit.committer?.name ?? null,
				emailAddress: dto.commit.committer?.email ?? null,
			},
			parents: dto.parents.map((parentDto) => parentDto.sha),
			subjectLine,
			bodyLines,
		}
	})
}
