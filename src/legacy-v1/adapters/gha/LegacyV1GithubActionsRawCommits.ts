import { ValiError } from "valibot"
import { fetchGithubPullRequestCommitsDto } from "#legacy-v1/adapters/gha/api/FetchGithubPullRequestCommitsDto"
import type { GitUserDto } from "#legacy-v1/adapters/gha/api/dtos/GitUserDto"
import type { GithubCommitDto } from "#legacy-v1/adapters/gha/api/dtos/GithubCommitDto"
import { fetchGithubActionsPullRequestEventDto } from "#legacy-v1/adapters/gha/event/FetchGithubActionsPullRequestEventDto"
import type {
	LegacyV1RawCommit,
	LegacyV1RawCommits,
	LegacyV1UserIdentity,
} from "#legacy-v1/rules/LegacyV1Commit"

export async function legacyV1GetGithubActionsRawCommits(): Promise<LegacyV1RawCommits> {
	const pullRequestNumber = await getPullRequestNumber()
	const dto = await fetchGithubPullRequestCommitsDto(pullRequestNumber)

	return dto.map(mapCommitDtoToRawCommit)
}

async function getPullRequestNumber(): Promise<number> {
	try {
		const dto = await fetchGithubActionsPullRequestEventDto()
		return dto.pull_request.number
	} catch (error) {
		if (error instanceof ValiError) {
			throw new Error("This action must run on a pull request", {
				cause: error,
			})
		}
		throw error
	}
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
