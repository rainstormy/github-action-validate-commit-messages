import { beforeEach, describe, expect, it } from "vitest"
import { getGithubPullRequestCommits } from "#commits/github/GetGithubPullRequestCommits"
import type {
	GithubApiBaseUrlString,
	GithubPaginatedResourceString,
} from "#utilities/github/api/FetchPaginatedGithubDto"
import { injectPaginatedGithubDto } from "#utilities/github/api/FetchPaginatedGithubDto.fixtures"
import { injectGithubEnv } from "#utilities/github/env/GithubEnv.fixtures"

describe.each`
	repositoryName                | pullRequestNumber
	${"rainstormy/presets-biome"} | ${127}
	${"spdiswal/coolciv"}         | ${4}
`(
	"given pull request #$pullRequestNumber in $repositoryName",
	(props: { repositoryName: string; pullRequestNumber: number }) => {
		const apiBaseUrl: GithubApiBaseUrlString = `https://api.github.com/repos/${props.repositoryName}`
		const commitsResource: GithubPaginatedResourceString = `${apiBaseUrl}/pulls/${props.pullRequestNumber}/commits?per_page=30&page=1`

		beforeEach(() => {
			injectGithubEnv({ apiBaseUrl })
		})

		describe("when it does not have any commits", () => {
			beforeEach(() => {
				injectPaginatedGithubDto(commitsResource, [])
			})

			it("returns an empty array of commits", async () => {
				const commits = await getGithubPullRequestCommits(
					props.pullRequestNumber,
				)
				expect(commits).toEqual([])
			})
		})
	},
)

// describe("when the pull request has commits", () => {
// 	beforeEach(() => {})
//
// 	it("should return an array of commits", async () => {
// 		const commits = await getGithubPullRequestCommits()
// 		expect(commits).toEqual([
// 			{
// 				sha: generator(),
// 				author: {
// 					name: "John Doe",
// 					emailAddress: "john@example.com",
// 				},
// 				committer: {
// 					name: "John Doe",
// 					emailAddress: "john@example.com",
// 				},
// 				parents: [generator()],
// 				subjectLine: "Add feature",
// 				bodyLines: ["More details about the feature"],
// 			},
// 		])
// 	})
// })
//
// describe("when the pull request has merge commits", () => {
// 	it("should return commits with multiple parents", async () => {
// 		const commits = await getGithubPullRequestCommits()
// 		expect(commits).toEqual([
// 			{
// 				sha: generator(),
// 				author: {
// 					name: "John Doe",
// 					emailAddress: "john@example.com",
// 				},
// 				committer: {
// 					name: "John Doe",
// 					emailAddress: "john@example.com",
// 				},
// 				parents: [generator(), generator()],
// 				subjectLine: "Merge branch 'main'",
// 				bodyLines: [],
// 			},
// 		])
// 	})
// })
//
// describe("when the pull request has commits from multiple authors", () => {
// 	it("should return commits with different authors", async () => {
// 		const commits = await getGithubPullRequestCommits()
// 		expect(commits).toEqual([
// 			{
// 				sha: generator(),
// 				author: {
// 					name: "John Doe",
// 					emailAddress: "john@example.com",
// 				},
// 				committer: {
// 					name: "John Doe",
// 					emailAddress: "john@example.com",
// 				},
// 				parents: [generator()],
// 				subjectLine: "First commit",
// 				bodyLines: [],
// 			},
// 			{
// 				sha: generator(),
// 				author: {
// 					name: "Jane Smith",
// 					emailAddress: "jane@example.com",
// 				},
// 				committer: {
// 					name: "Jane Smith",
// 					emailAddress: "jane@example.com",
// 				},
// 				parents: [generator()],
// 				subjectLine: "Second commit",
// 				bodyLines: [],
// 			},
// 		])
// 	})
// })
//
// describe.each`
// 	repositoryName                                         | pullRequestNumber
// 	${"rainstormy/github-action-validate-commit-messages"} | ${127}
// 	${"spdiswal/coolciv"}                                  | ${4}
// `(
// 	"when pull request #$pullRequestNumber in $repositoryName does not exist",
// 	(props: { repositoryName: string; pullRequestNumber: number }) => {
// 		beforeEach(() => {
// 			const dto = {
// 				message: "Not Found",
// 				documentation_url:
// 					"https://docs.github.com/rest/pulls/pulls#list-commits-on-a-pull-request",
// 				status: "404",
// 			}
//
// 			mockFetch(
// 				`https://api.github.com/repos/${props.repositoryName}/pulls/${props.pullRequestNumber}/commits`,
// 				dto,
// 				HTTP_404_NOT_FOUND,
// 			)
// 		})
//
// 		it("throws an error", async () => {
// 			await expect(getGithubPullRequestCommits(props.pullRequestNumber)).rejects.toThrow(
// 				`Failed to fetch '${nextResource}': ${response.status} ${response.statusText}`,
// 			)
// 		})
// 	},
// )
