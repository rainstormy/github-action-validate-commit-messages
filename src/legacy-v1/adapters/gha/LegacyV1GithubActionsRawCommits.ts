import type { GithubCommitDto } from "#legacy-v1/adapters/gha/api/dtos/GithubCommitDto.ts"
import type { GitUserDto } from "#legacy-v1/adapters/gha/api/dtos/GitUserDto.ts"
import { fetchGithubPullRequestCommitsDto } from "#legacy-v1/adapters/gha/api/FetchGithubPullRequestCommitsDto.ts"
import type {
	LegacyV1RawCommit,
	LegacyV1RawCommits,
	LegacyV1UserIdentity,
} from "#legacy-v1/rules/LegacyV1Commit.ts"
import { getGithubPullRequestNumber } from "#utilities/github/event/GetGithubPullRequestNumber.ts"

export async function legacyV1GetGithubActionsRawCommits(): Promise<LegacyV1RawCommits> {
	const pullRequestNumber = await getGithubPullRequestNumber()

	if (pullRequestNumber === null) {
		throw new Error("This action must run on a pull request")
	}

	const dto = await fetchGithubPullRequestCommitsDto(pullRequestNumber)
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
	dto: GitUserDto | null,
): LegacyV1UserIdentity {
	return {
		name: dto?.name ?? null,
		emailAddress: dto?.email ?? null,
	}
}
