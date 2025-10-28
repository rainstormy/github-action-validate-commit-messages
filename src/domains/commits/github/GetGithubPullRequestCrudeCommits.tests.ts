import { mockGithubPullRequestCommitDtos } from "#utilities/github/api/FetchGithubPullRequestCommitDtos.mocks.ts"
import { mockNonexistingGithubResourceDto } from "#utilities/github/api/FetchGithubResourceDto.mocks.ts"
import { mockGithubPullRequestEventDto } from "#utilities/github/event/FetchGithubEventDto.mocks.ts"
import { beforeEach, describe, expect, it } from "vitest"
import type { CrudeCommit } from "#commits/CrudeCommit.ts"
import { getGithubPullRequestCrudeCommits } from "#commits/github/GetGithubPullRequestCrudeCommits.ts"
import type { GithubPullRequestReference } from "#commits/github/GithubPullRequestReference.fixtures.ts"
import { fakeCommitSha } from "#types/CommitSha.fixtures.ts"
import type { CommitSha } from "#types/CommitSha.ts"
import { fakeGithubCommitDtos } from "#utilities/github/api/dtos/GithubCommitDto.fixtures.ts"
import type { GithubCommitUserDto } from "#utilities/github/api/dtos/GithubCommitUserDto.ts"
import type { GithubParentCommitDto } from "#utilities/github/api/dtos/GithubParentCommitDto.ts"
import type { GithubUrlString } from "#utilities/github/api/GithubUrlString.ts"

describe.each`
	sha
	${fakeCommitSha()}
	${fakeCommitSha()}
`("when the commit SHA is $sha", (props: { sha: CommitSha }) => {
	beforeEach(() => {
		mockGithubPullRequestCommitDtos([{ sha: props.sha }])
	})

	it("preserves the commit SHA", async () => {
		const [commit] = await getGithubPullRequestCrudeCommits()
		expect(commit?.sha).toBe(props.sha)
	})
})

describe("when the commit does not have a parent", () => {
	const parents = [] as const satisfies Array<GithubParentCommitDto>

	beforeEach(() => {
		mockGithubPullRequestCommitDtos([{ parents }])
	})

	it("has no parent SHAs", async () => {
		const [commit] = await getGithubPullRequestCrudeCommits()
		expect(commit?.parents).toEqual([])
	})
})

describe.each`
	parentSha
	${fakeCommitSha()}
	${fakeCommitSha()}
`(
	"when the commit has 1 parent with a SHA of $parentSha",
	(props: { parentSha: CommitSha }) => {
		const parents = [
			{ sha: props.parentSha },
		] as const satisfies Array<GithubParentCommitDto>

		beforeEach(() => {
			mockGithubPullRequestCommitDtos([{ parents }])
		})

		it("preserves the parent SHA", async () => {
			const [commit] = await getGithubPullRequestCrudeCommits()
			expect(commit?.parents).toEqual([props.parentSha])
		})
	},
)

describe("when the commit has 2 parents", () => {
	const parents = [
		{ sha: fakeCommitSha() },
		{ sha: fakeCommitSha() },
	] as const satisfies Array<GithubParentCommitDto>

	beforeEach(() => {
		mockGithubPullRequestCommitDtos([{ parents }])
	})

	it("preserves both parent SHAs", async () => {
		const [commit] = await getGithubPullRequestCrudeCommits()
		expect(commit?.parents).toEqual([parents[0].sha, parents[1].sha])
	})
})

describe("when the commit has 3 parents", () => {
	const parents = [
		{ sha: fakeCommitSha() },
		{ sha: fakeCommitSha() },
		{ sha: fakeCommitSha() },
	] as const satisfies Array<GithubParentCommitDto>

	beforeEach(() => {
		mockGithubPullRequestCommitDtos([{ parents }])
	})

	it("preserves all parent SHAs", async () => {
		const [commit] = await getGithubPullRequestCrudeCommits()
		expect(commit?.parents).toEqual([
			parents[0].sha,
			parents[1].sha,
			parents[2].sha,
		])
	})
})

describe.each`
	message
	${"Release the robot butler"}
	${"some refactoring"}
`(
	"when the commit message of $message has a single line",
	(props: { message: string }) => {
		const message = props.message

		beforeEach(() => {
			mockGithubPullRequestCommitDtos([{ commit: { message } }])
		})

		it("preserves the commit message as is", async () => {
			const [commit] = await getGithubPullRequestCrudeCommits()
			expect(commit?.message).toBe(props.message)
		})
	},
)

describe.each`
	message
	${"  Make more spaghetti to feed the ever-growing code monster "}
	${" bugfixes  "}
`(
	"when the commit message of $message has a single line with leading and trailing whitespace",
	(props: { message: string }) => {
		const message = props.message

		beforeEach(() => {
			mockGithubPullRequestCommitDtos([{ commit: { message } }])
		})

		it("preserves the commit message as is", async () => {
			const [commit] = await getGithubPullRequestCrudeCommits()
			expect(commit?.message).toBe(props.message)
		})
	},
)

describe.each`
	message
	${""}
	${"   "}
`(
	"when the commit message of $message is blank",
	(props: { message: string }) => {
		const message = props.message

		beforeEach(() => {
			mockGithubPullRequestCommitDtos([{ commit: { message } }])
		})

		it("preserves the commit message as is", async () => {
			const [commit] = await getGithubPullRequestCrudeCommits()
			expect(commit?.message).toBe(props.message)
		})
	},
)

describe.each`
	message
	${"Apply strawberry jam to make the code sweeter\nSweetness went to a 8 out of 10, as we held back a bit to avoid turning the code diabetic."}
	${"fixup!  added some extra love to the code\n\nSome improvements that we made:\n  - The code is more readable now.\n  - The function is much faster now.\n  - The architecture is much more flexible now."}
`(
	"when the commit message of $message has multiple lines",
	(props: { message: string }) => {
		const message = props.message

		beforeEach(() => {
			mockGithubPullRequestCommitDtos([{ commit: { message } }])
		})

		it("preserves the commit message as is", async () => {
			const [commit] = await getGithubPullRequestCrudeCommits()
			expect(commit?.message).toBe(props.message)
		})
	},
)

describe.each`
	message
	${"Fix typo: survice -> service\n  I'm a survivor! \n  I'm not gon' give up! "}
	${"more bugfixes\n the customer has asked for these bugfixes and we deliver  \nanother line"}
`(
	"when the commit message of $message has a body line with leading and trailing whitespace",
	(props: { message: string }) => {
		const message = props.message

		beforeEach(() => {
			mockGithubPullRequestCommitDtos([{ commit: { message } }])
		})

		it("preserves the commit message as is", async () => {
			const [commit] = await getGithubPullRequestCrudeCommits()
			expect(commit?.message).toBe(props.message)
		})
	},
)

describe.each`
	message
	${"Test\n\nIt works now."}
	${"Test\n    \nIt works now."}
`(
	"when the commit message of $message has a blank body line",
	(props: { message: string }) => {
		const message = props.message

		beforeEach(() => {
			mockGithubPullRequestCommitDtos([{ commit: { message } }])
		})

		it("preserves the commit message as is", async () => {
			const [commit] = await getGithubPullRequestCrudeCommits()
			expect(commit?.message).toBe(props.message)
		})
	},
)

describe.each`
	authorName         | authorEmail
	${"tmnt"}          | ${"tmnt@fastforward.com"}
	${"renovate[bot]"} | ${"29139614+renovate[bot]@users.noreply.github.com"}
	${"Nimbus (Bot)"}  | ${"146315497+rainstormybot-nimbus@users.noreply.github.com"}
`(
	"when the author's name is $authorName and the author's email address is $authorEmail",
	(props: { authorName: string; authorEmail: string }) => {
		const author: GithubCommitUserDto = {
			name: props.authorName,
			email: props.authorEmail,
		}

		beforeEach(() => {
			mockGithubPullRequestCommitDtos([{ commit: { author } }])
		})

		it("preserves the author's name", async () => {
			const [commit] = await getGithubPullRequestCrudeCommits()
			expect(commit?.authorName).toBe(props.authorName)
		})

		it("preserves the author's email address", async () => {
			const [commit] = await getGithubPullRequestCrudeCommits()
			expect(commit?.authorEmail).toBe(props.authorEmail)
		})
	},
)

describe.each`
	authorName
	${"  bmo "}
	${" Kgl. Hofnar  "}
`(
	"when the author's name of $authorName has leading and trailing whitespace",
	(props: { authorName: string }) => {
		const author: GithubCommitUserDto = {
			name: props.authorName,
			email: "25199993+noname@users.noreply.github.com",
		}

		beforeEach(() => {
			mockGithubPullRequestCommitDtos([{ commit: { author } }])
		})

		it("preserves the author's name as is", async () => {
			const [commit] = await getGithubPullRequestCrudeCommits()
			expect(commit?.authorName).toBe(props.authorName)
		})
	},
)

describe.each`
	authorName
	${""}
	${"   "}
`(
	"when the author's name of $authorName is blank",
	(props: { authorName: string }) => {
		const author: GithubCommitUserDto = {
			name: props.authorName,
			email: "25199993+noname@users.noreply.github.com",
		}

		beforeEach(() => {
			mockGithubPullRequestCommitDtos([{ commit: { author } }])
		})

		it("preserves the author's name as is", async () => {
			const [commit] = await getGithubPullRequestCrudeCommits()
			expect(commit?.authorName).toBe(props.authorName)
		})
	},
)

describe("when the author's name is absent", () => {
	const author: GithubCommitUserDto = {
		email: "25199993+noname@users.noreply.github.com",
	}

	beforeEach(() => {
		mockGithubPullRequestCommitDtos([{ commit: { author } }])
	})

	it("omits the author's name", async () => {
		const [commit] = await getGithubPullRequestCrudeCommits()
		expect(commit?.authorName).toBeNull()
	})

	it("preserves the author's email address", async () => {
		const [commit] = await getGithubPullRequestCrudeCommits()
		expect(commit?.authorEmail).toBe(author.email)
	})
})

describe.each`
	authorEmail
	${"  tmnt@fastforward.com "}
	${" 25199993+noname@users.noreply.github.com  "}
`(
	"when the author's email address of $authorEmail has leading and trailing whitespace",
	(props: { authorEmail: string }) => {
		const author: GithubCommitUserDto = {
			name: "Unnamed 1",
			email: props.authorEmail,
		}

		beforeEach(() => {
			mockGithubPullRequestCommitDtos([{ commit: { author } }])
		})

		it("preserves the author's email address as is", async () => {
			const [commit] = await getGithubPullRequestCrudeCommits()
			expect(commit?.authorEmail).toBe(props.authorEmail)
		})
	},
)

describe.each`
	authorEmail
	${""}
	${"   "}
`(
	"when the author's email address of $authorEmail is blank",
	(props: { authorEmail: string }) => {
		const author: GithubCommitUserDto = {
			name: "Unnamed 1",
			email: props.authorEmail,
		}

		beforeEach(() => {
			mockGithubPullRequestCommitDtos([{ commit: { author } }])
		})

		it("preserves the author's email address as is", async () => {
			const [commit] = await getGithubPullRequestCrudeCommits()
			expect(commit?.authorEmail).toBe(props.authorEmail)
		})
	},
)

describe("when the author's email address is absent", () => {
	const author: GithubCommitUserDto = {
		name: "Unnamed 1",
	}

	beforeEach(() => {
		mockGithubPullRequestCommitDtos([{ commit: { author } }])
	})

	it("preserves the author's name", async () => {
		const [commit] = await getGithubPullRequestCrudeCommits()
		expect(commit?.authorName).toBe(author.name)
	})

	it("omits the author's email address", async () => {
		const [commit] = await getGithubPullRequestCrudeCommits()
		expect(commit?.authorEmail).toBeNull()
	})
})

describe("when the author is absent", () => {
	beforeEach(() => {
		mockGithubPullRequestCommitDtos([{ commit: { author: null } }])
	})

	it("omits the author's name", async () => {
		const [commit] = await getGithubPullRequestCrudeCommits()
		expect(commit?.authorName).toBeNull()
	})

	it("omits the author's email address", async () => {
		const [commit] = await getGithubPullRequestCrudeCommits()
		expect(commit?.authorEmail).toBeNull()
	})
})

describe.each`
	committerName                                   | committerEmail
	${"baxter.stockman"}                            | ${"baxter.stockman@fastforward.com"}
	${"GitHub"}                                     | ${"noreply@github.com"}
	${"Michelangelo di Lodovico Buonarroti Simoni"} | ${"28317649+cowabunga@users.noreply.github.com"}
`(
	"when the committer name is $committerName and the committer email address is $committerEmail",
	(props: { committerName: string; committerEmail: string }) => {
		const committer: GithubCommitUserDto = {
			name: props.committerName,
			email: props.committerEmail,
		}

		beforeEach(() => {
			mockGithubPullRequestCommitDtos([{ commit: { committer } }])
		})

		it("preserves the committer's name", async () => {
			const [commit] = await getGithubPullRequestCrudeCommits()
			expect(commit?.committerName).toBe(props.committerName)
		})

		it("preserves the committer's email address", async () => {
			const [commit] = await getGithubPullRequestCrudeCommits()
			expect(commit?.committerEmail).toBe(props.committerEmail)
		})
	},
)

describe("when the committer's name is absent", () => {
	const committer: GithubCommitUserDto = {
		email: "25199993+noname@users.noreply.github.com",
	}

	beforeEach(() => {
		mockGithubPullRequestCommitDtos([{ commit: { committer } }])
	})

	it("omits the committer's name", async () => {
		const [commit] = await getGithubPullRequestCrudeCommits()
		expect(commit?.committerName).toBeNull()
	})

	it("preserves the committer's email address", async () => {
		const [commit] = await getGithubPullRequestCrudeCommits()
		expect(commit?.committerEmail).toBe(committer.email)
	})
})

describe.each`
	committerEmail
	${"  baxter.stockman@fastforward.com "}
	${" 25199993+noname@users.noreply.github.com  "}
`(
	"when the committer's email address of $committerEmail has leading and trailing whitespace",
	(props: { committerEmail: string }) => {
		const committer: GithubCommitUserDto = {
			name: "Unnamed 2",
			email: props.committerEmail,
		}

		beforeEach(() => {
			mockGithubPullRequestCommitDtos([{ commit: { committer } }])
		})

		it("preserves the committer's email address as is", async () => {
			const [commit] = await getGithubPullRequestCrudeCommits()
			expect(commit?.committerEmail).toBe(props.committerEmail)
		})
	},
)

describe.each`
	committerEmail
	${""}
	${"   "}
`(
	"when the committer's email address of $committerEmail is blank",
	(props: { committerEmail: string }) => {
		const committer: GithubCommitUserDto = {
			name: "Unnamed 2",
			email: props.committerEmail,
		}

		beforeEach(() => {
			mockGithubPullRequestCommitDtos([{ commit: { committer } }])
		})

		it("preserves the committer's email address as is", async () => {
			const [commit] = await getGithubPullRequestCrudeCommits()
			expect(commit?.committerEmail).toBe(props.committerEmail)
		})
	},
)

describe("when the committer's email address is absent", () => {
	const committer: GithubCommitUserDto = {
		name: "Unnamed 2",
	}

	beforeEach(() => {
		mockGithubPullRequestCommitDtos([{ commit: { committer } }])
	})

	it("preserves the committer's name", async () => {
		const [commit] = await getGithubPullRequestCrudeCommits()
		expect(commit?.committerName).toBe(committer.name)
	})

	it("omits the committer's email address", async () => {
		const [commit] = await getGithubPullRequestCrudeCommits()
		expect(commit?.committerEmail).toBeNull()
	})
})

describe("when the committer is absent", () => {
	beforeEach(() => {
		mockGithubPullRequestCommitDtos([{ commit: { committer: null } }])
	})

	it("omits the committer's name", async () => {
		const [commit] = await getGithubPullRequestCrudeCommits()
		expect(commit?.committerName).toBeNull()
	})

	it("omits the committer's email address", async () => {
		const [commit] = await getGithubPullRequestCrudeCommits()
		expect(commit?.committerEmail).toBeNull()
	})
})

describe("when the pull request does not have any commits", () => {
	const commitDtos = fakeGithubCommitDtos(0)

	beforeEach(() => {
		mockGithubPullRequestCommitDtos(commitDtos, { pageSize: 5 })
	})

	it("returns an empty array of commits", async () => {
		const commits = await getGithubPullRequestCrudeCommits()
		expect(commits).toEqual([])
	})
})

describe("when the pull request has 1 commit", () => {
	const commitDtos = fakeGithubCommitDtos(1)

	beforeEach(() => {
		mockGithubPullRequestCommitDtos(commitDtos, { pageSize: 5 })
	})

	it("returns an array of 1 commit", async () => {
		const commits = await getGithubPullRequestCrudeCommits()
		expect(commits).toHaveLength(1)
		expect(commits).toMatchObject<[Partial<CrudeCommit>]>([
			{ sha: commitDtos[0].sha, message: "Commit 1\n\nMore lines of text." },
		])
	})
})

describe.each`
	count
	${2}
	${3}
	${4}
	${5}
	${6}
	${7}
	${8}
	${9}
	${10}
	${11}
	${12}
	${15}
	${18}
	${21}
	${30}
`(
	"when the pull request has $count commits with an API page size of 5",
	(props: { count: number }) => {
		const commitDtos = fakeGithubCommitDtos(props.count)

		beforeEach(() => {
			mockGithubPullRequestCommitDtos(commitDtos, { pageSize: 5 })
		})

		it(`returns an array of ${props.count} commits`, async () => {
			const commits = await getGithubPullRequestCrudeCommits()
			expect(commits).toHaveLength(props.count)
			expect(commits).toMatchObject(
				commitDtos.map(
					(dto, index): Partial<CrudeCommit> => ({
						sha: dto.sha,
						message: `Commit ${index + 1}\n\nMore lines of text.`,
					}),
				),
			)
		})
	},
)

describe.each`
	count
	${3}
	${30}
	${31}
	${60}
	${61}
`(
	"when the pull request has $count commits with an API page size of 30",
	(props: { count: number }) => {
		const commitDtos = fakeGithubCommitDtos(props.count)

		beforeEach(() => {
			mockGithubPullRequestCommitDtos(commitDtos, { pageSize: 30 })
		})

		it(`returns an array of ${props.count} commits`, async () => {
			const commits = await getGithubPullRequestCrudeCommits()
			expect(commits).toHaveLength(props.count)
			expect(commits).toMatchObject(
				commitDtos.map(
					(dto, index): Partial<CrudeCommit> => ({
						sha: dto.sha,
						message: `Commit ${index + 1}\n\nMore lines of text.`,
					}),
				),
			)
		})
	},
)

describe.each`
	reference
	${"rainstormy/comet#5629"}
	${"spdiswal/vitus#239"}
`(
	"when the pull request $reference does not exist",
	(props: { reference: GithubPullRequestReference }) => {
		let resourceUrl: `${GithubUrlString}/${string}`

		beforeEach(() => {
			resourceUrl = mockGithubPullRequestEventDto(props.reference)
			mockNonexistingGithubResourceDto(resourceUrl, {
				documentationUrl:
					"https://docs.github.com/rest/pulls/pulls#list-commits-on-a-pull-request",
			})
		})

		it("throws an error", async () => {
			await expect(getGithubPullRequestCrudeCommits()).rejects.toThrow(
				`Failed to fetch '${resourceUrl}': 404 Not Found`,
			)
		})
	},
)
