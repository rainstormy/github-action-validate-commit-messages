import type { RawCommit } from "+rules"
import core from "@actions/core"
import github from "@actions/github"
import type { Endpoints } from "@octokit/types"

type OctokitCommitDto =
	Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"]["response"]["data"][number]

export type PullRequest = {
	readonly rawCommits: ReadonlyArray<RawCommit>
}

export async function getPullRequestFromApi(
	pullRequestNumber: number,
): Promise<PullRequest> {
	const { owner, repo } = github.context.repo
	const octokit = getOctokit()

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

function getOctokit(): ReturnType<typeof github.getOctokit> {
	// The lexical scope of the GitHub token should be as small as possible to prevent leaks.
	const githubToken = core.getInput("github-token", { required: true })
	return github.getOctokit(githubToken)
}

const shaLengthToDisplay = 7

function rawCommitFromDto({
	commit,
	parents,
	sha,
}: OctokitCommitDto): RawCommit {
	return {
		sha: sha.slice(0, shaLengthToDisplay),
		author: {
			name: commit.author?.name ?? null,
			emailAddress: commit.author?.email ?? null,
		},
		committer: {
			name: commit.committer?.name ?? null,
			emailAddress: commit.committer?.email ?? null,
		},
		parents: parents.map((parent) => ({ sha: parent.sha })),
		commitMessage: commit.message,
	}
}
