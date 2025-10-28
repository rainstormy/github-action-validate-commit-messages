import { fakeCommitSha } from "#types/CommitSha.fixtures.ts"
import { type Vector, vectorOf } from "#types/Vector.ts"
import type { GithubCommitDto } from "#utilities/github/api/dtos/GithubCommitDto.ts"

export type GithubCommitDtoTemplate = Partial<
	Pick<GithubCommitDto, "sha" | "parents">
> & { commit?: Partial<GithubCommitDto["commit"]> }

export function fakeGithubCommitDto(
	overrides: GithubCommitDtoTemplate = {},
): GithubCommitDto {
	return {
		parents: overrides.parents ?? [{ sha: fakeCommitSha() }],
		sha: overrides.sha ?? fakeCommitSha(),
		commit: {
			message: "Introduce a cool feature\n\nIt is really awesome!",
			author: {
				name: "Master Splinter",
				email: "58390854+sensei@users.noreply.github.com",
			},
			committer: {
				name: "Leonardo da Vinci",
				email: "71091436+katanaturtle@users.noreply.github.com",
			},
			...overrides.commit,
		},
	}
}

export function fakeGithubCommitDtos<Count extends number>(
	count: Count,
): Vector<GithubCommitDto, Count> {
	return vectorOf(count, (index) =>
		fakeGithubCommitDto({
			commit: { message: `Commit ${index + 1}\n\nMore lines of text.` },
		}),
	)
}
