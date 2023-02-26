import type { Commit } from "+core"
import { commitOf } from "+core"
import github from "@actions/github"
import type { Endpoints } from "@octokit/types"

export type PullRequest = {
	readonly commits: ReadonlyArray<Commit>
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

	const commitsInPullRequest = await octokit.paginate(
		octokit.rest.pulls.listCommits,
		{
			owner,
			repo,
			pull_number: pullRequestNumber,
		},
		(response) => response.data.map((commit) => commitFromDto(commit)),
	)

	return { commits: commitsInPullRequest }
}

const shaLengthToDisplay = 7

function commitFromDto({ commit, parents, sha }: CommitDto): Commit {
	return commitOf({
		sha: sha.slice(0, shaLengthToDisplay),
		commitMessage: commit.message,
		parents: parents.map((parent) => ({ sha: parent.sha })),
	})
}

type CommitDto =
	Endpoints["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"]["response"]["data"][number]
