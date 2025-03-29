import type { RawCommit } from "+rules/Commit"
import core from "@actions/core"
import github from "@actions/github"

export type PullRequest = {
	readonly rawCommits: ReadonlyArray<RawCommit>
}

const shaLengthToDisplay = 7

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
		rawCommits: commitDtos.map(({ commit, parents, sha }) => {
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
		}),
	}
}

function getOctokit(): ReturnType<typeof github.getOctokit> {
	// The lexical scope of the GitHub token should be as small as possible to prevent leaks.
	const githubToken = core.getInput("github-token", { required: true })
	return github.getOctokit(githubToken)
}
