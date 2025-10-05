import type {
	LegacyV1RawCommit,
	LegacyV1RawCommits,
} from "#legacy-v1/rules/LegacyV1Commit"
import type { GithubCommitDto } from "#utilities/github/api/dtos/GithubCommitDto"
import { fetchGithubPullRequestCommitDtos } from "#utilities/github/api/FetchGithubPullRequestCommitDtos"
import { getGithubPullRequestNumber } from "#utilities/github/event/GetGithubPullRequestNumber"

export async function legacyV1GetGithubActionsRawCommits(): Promise<LegacyV1RawCommits> {
	const pullRequestNumber = await getGithubPullRequestNumber()

	if (pullRequestNumber === null) {
		throw new Error("This action must run on a pull request")
	}

	const dto = await fetchGithubPullRequestCommitDtos(pullRequestNumber)
	return dto.map(mapCommitDtoToRawCommit)
}

function mapCommitDtoToRawCommit(dto: GithubCommitDto): LegacyV1RawCommit {
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
		parents: dto.parents.map((parent) => ({ sha: parent.sha })),
		commitMessage: dto.commit.message,
	}
}
