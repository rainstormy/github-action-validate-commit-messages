import type { RawCommit } from "+core"
import github from "@actions/github"
import type { Endpoints } from "@octokit/types"

type OctokitCommitDto =
	Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"]["response"]["data"][number]

export type PullRequest = {
	readonly rawCommits: ReadonlyArray<RawCommit>
}

type PullRequestFromApiProps = {
	readonly githubToken: string
	readonly pullRequestNumber: number
}

export async function pullRequestFromApi({
	githubToken,
	pullRequestNumber,
}: PullRequestFromApiProps): Promise<PullRequest> {
	const { owner, repo } = github.context.repo
	const octokit = github.getOctokit(githubToken)

	const commitDtos = await octokit.paginate(
		octokit.rest.pulls.listCommits,
		{
			owner,
			repo,
			pull_number: pullRequestNumber,
		},
		(response) => response.data,
	)

	return {
		rawCommits: commitDtos.map((commit) => rawCommitFromDto(commit)),
	}
}

const shaLengthToDisplay = 7

function rawCommitFromDto({
	commit,
	parents,
	sha,
}: OctokitCommitDto): RawCommit {
	return {
		sha: sha.slice(0, shaLengthToDisplay),
		parents: parents.map((parent) => ({ sha: parent.sha })),
		commitMessage: commit.message,
	}
}
