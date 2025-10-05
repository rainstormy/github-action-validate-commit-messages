import { DUMMY_COMMIT_SHAS } from "#types/CommitSha.fixtures"
import type { GithubCommitDto } from "#utilities/github/api/dtos/GithubCommitDto"

export function dummyGithubCommitDto(
	overrides: Partial<Pick<GithubCommitDto, "sha" | "parents">> & {
		commit?: Partial<GithubCommitDto["commit"]>
	} = {},
): GithubCommitDto {
	const {
		sha = DUMMY_COMMIT_SHAS[0],
		parents = [{ sha: DUMMY_COMMIT_SHAS[19] }],
		commit: commitOverrides,
	} = overrides

	return {
		sha,
		parents,
		commit: {
			message: "",
			author: {
				name: "",
				email: "",
			},
			committer: {
				name: "",
				email: "",
			},
			...commitOverrides,
		},
	}
}
