import type {
	LegacyV1RawCommit,
	LegacyV1RawCommits,
	LegacyV1UserIdentity,
} from "#legacy-v1/rules/LegacyV1Commit.ts"
import type { GithubCommitDto } from "#utilities/github/api/dtos/GithubCommitDto.ts"
import type { GithubCommitUserDto } from "#utilities/github/api/dtos/GithubCommitUserDto.ts"
import { fetchGithubPullRequestCommitDtos } from "#utilities/github/api/FetchGithubPullRequestCommitDtos.ts"
import { getGithubPullRequestNumber } from "#utilities/github/event/GetGithubPullRequestNumber.ts"

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
		author: mapUserDtoToUserIdentity(dto.commit.author),
		committer: mapUserDtoToUserIdentity(dto.commit.committer),
		parents: dto.parents.map((parent) => ({ sha: parent.sha })),
		commitMessage: dto.commit.message,
	}
}

function mapUserDtoToUserIdentity(
	dto: GithubCommitUserDto | null,
): LegacyV1UserIdentity {
	return {
		name: dto?.name ?? null,
		emailAddress: dto?.email ?? null,
	}
}
