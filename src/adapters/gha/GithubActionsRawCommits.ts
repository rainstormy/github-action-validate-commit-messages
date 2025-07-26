import { ValiError } from "valibot"
import { fetchGithubPullRequestCommitsDto } from "#adapters/gha/api/FetchGithubPullRequestCommitsDto"
import type { GitUserDto } from "#adapters/gha/api/dtos/GitUserDto"
import type { GithubCommitDto } from "#adapters/gha/api/dtos/GithubCommitDto"
import { fetchGithubActionsPullRequestEventDto } from "#adapters/gha/event/FetchGithubActionsPullRequestEventDto"
import type { RawCommit, RawCommits, UserIdentity } from "#rules/Commit"

export async function getGithubActionsRawCommits(): Promise<RawCommits> {
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

function mapCommitDtoToRawCommit(dto: GithubCommitDto): RawCommit {
	return {
		sha: dto.sha,
		author: mapUserDtoToUserIdentity(dto.commit.author),
		committer: mapUserDtoToUserIdentity(dto.commit.committer),
		parents: dto.parents.map((parent) => ({ sha: parent.sha })),
		commitMessage: dto.commit.message,
	}
}

function mapUserDtoToUserIdentity(dto: GitUserDto | null): UserIdentity {
	return {
		name: dto?.name ?? null,
		emailAddress: dto?.email ?? null,
	}
}
