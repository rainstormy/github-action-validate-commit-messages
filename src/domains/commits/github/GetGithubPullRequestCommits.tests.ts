import { injectGithubPullRequestCommitDtos } from "#utilities/github/api/FetchGithubPullRequestCommitDtos.mocks.ts"
import { injectNonexistingGithubResourceDto } from "#utilities/github/api/FetchPaginatedGithubResourceDto.mocks.ts"
import { injectGithubPullRequestEventDto } from "#utilities/github/event/FetchGithubEventDto.mocks.ts"
import { beforeEach, describe, expect, it } from "vitest"
import type { Commit } from "#commits/Commit.ts"
import { getGithubPullRequestCommits } from "#commits/github/GetGithubPullRequestCommits.ts"
import type { GithubPullRequestReference } from "#commits/github/GithubPullRequestReference.fixtures.ts"
import { nextDummyCommitSha } from "#types/CommitSha.fixtures.ts"
import type { CommitSha } from "#types/CommitSha.ts"
import { dummyGithubCommitDtoVector } from "#utilities/github/api/dtos/GithubCommitDto.fixtures.ts"
import type { GithubCommitUserDto } from "#utilities/github/api/dtos/GithubCommitUserDto.ts"
import type { GithubParentCommitDto } from "#utilities/github/api/dtos/GithubParentCommitDto.ts"
import type { GithubUrlString } from "#utilities/github/api/GithubUrlString.ts"

describe.each`
	sha
	${nextDummyCommitSha()}
	${nextDummyCommitSha()}
`("when the commit SHA is $sha", (props: { sha: CommitSha }) => {
	beforeEach(() => {
		injectGithubPullRequestCommitDtos([{ sha: props.sha }])
	})

	it("preserves the commit SHA", async () => {
		const [commit] = await getGithubPullRequestCommits()
		expect(commit?.sha).toBe(props.sha)
	})
})

describe("when the commit does not have a parent", () => {
	const parents = [] as const satisfies Array<GithubParentCommitDto>

	beforeEach(() => {
		injectGithubPullRequestCommitDtos([{ parents }])
	})

	it("has no parent SHAs", async () => {
		const [commit] = await getGithubPullRequestCommits()
		expect(commit?.parents).toEqual([])
	})
})

describe.each`
	parentSha
	${nextDummyCommitSha()}
	${nextDummyCommitSha()}
`(
	"when the commit has 1 parent with a SHA of $parentSha",
	(props: { parentSha: CommitSha }) => {
		const parents = [
			{ sha: props.parentSha },
		] as const satisfies Array<GithubParentCommitDto>

		beforeEach(() => {
			injectGithubPullRequestCommitDtos([{ parents }])
		})

		it("preserves the parent SHA", async () => {
			const [commit] = await getGithubPullRequestCommits()
			expect(commit?.parents).toEqual([props.parentSha])
		})
	},
)

describe("when the commit has 2 parents", () => {
	const parents = [
		{ sha: nextDummyCommitSha() },
		{ sha: nextDummyCommitSha() },
	] as const satisfies Array<GithubParentCommitDto>

	beforeEach(() => {
		injectGithubPullRequestCommitDtos([{ parents }])
	})

	it("preserves both parent SHAs", async () => {
		const [commit] = await getGithubPullRequestCommits()
		expect(commit?.parents).toEqual([parents[0].sha, parents[1].sha])
	})
})

describe("when the commit has 3 parents", () => {
	const parents = [
		{ sha: nextDummyCommitSha() },
		{ sha: nextDummyCommitSha() },
		{ sha: nextDummyCommitSha() },
	] as const satisfies Array<GithubParentCommitDto>

	beforeEach(() => {
		injectGithubPullRequestCommitDtos([{ parents }])
	})

	it("preserves all parent SHAs", async () => {
		const [commit] = await getGithubPullRequestCommits()
		expect(commit?.parents).toEqual([
			parents[0].sha,
			parents[1].sha,
			parents[2].sha,
		])
	})
})

describe.each`
	subjectLine
	${"Release the robot butler"}
	${"some refactoring"}
`(
	"when the subject line is $subjectLine and there are no body lines",
	(props: { subjectLine: string }) => {
		const message = props.subjectLine

		beforeEach(() => {
			injectGithubPullRequestCommitDtos([{ commit: { message } }])
		})

		it("preserves the subject line", async () => {
			const [commit] = await getGithubPullRequestCommits()
			expect(commit?.subjectLine).toBe(props.subjectLine)
		})
	},
)

describe.each`
	subjectLine
	${"  Make more spaghetti to feed the ever-growing code monster "}
	${" bugfixes  "}
`(
	"when the subject line of $subjectLine has leading and trailing whitespace",
	(props: { subjectLine: string }) => {
		const message = props.subjectLine

		beforeEach(() => {
			injectGithubPullRequestCommitDtos([{ commit: { message } }])
		})

		it("preserves the subject line as is", async () => {
			const [commit] = await getGithubPullRequestCommits()
			expect(commit?.subjectLine).toBe(props.subjectLine)
		})
	},
)

describe.each`
	subjectLine
	${""}
	${"   "}
`(
	"when the subject line of $subjectLine is blank",
	(props: { subjectLine: string }) => {
		const message = props.subjectLine

		beforeEach(() => {
			injectGithubPullRequestCommitDtos([{ commit: { message } }])
		})

		it("preserves the subject line as is", async () => {
			const [commit] = await getGithubPullRequestCommits()
			expect(commit?.subjectLine).toBe(props.subjectLine)
		})
	},
)

describe.each`
	subjectLine                                        | bodyLines
	${"Apply strawberry jam to make the code sweeter"} | ${["Sweetness went to a 8 out of 10, as we held back a bit to avoid turning the code diabetic."]}
	${"fixup!  added some extra love to the code"}     | ${["", "Some improvements that we made:", "  - The code is more readable now.", "  - The function is much faster now.", "  - The architecture is much more flexible now."]}
`(
	"when the subject line is $subjectLine and the body lines are $bodyLines",
	(props: { subjectLine: string; bodyLines: Array<string> }) => {
		const message = [props.subjectLine, ...props.bodyLines].join("\n")

		beforeEach(() => {
			injectGithubPullRequestCommitDtos([{ commit: { message } }])
		})

		it("preserves the subject line", async () => {
			const [commit] = await getGithubPullRequestCommits()
			expect(commit?.subjectLine).toBe(props.subjectLine)
		})

		it("preserves all body lines", async () => {
			const [commit] = await getGithubPullRequestCommits()
			expect(commit?.bodyLines).toEqual(props.bodyLines)
		})
	},
)

describe.each`
	bodyLine
	${"  I'm a survivor! I'm not gon' give up! "}
	${" the customer has asked for these bugfixes and we deliver  "}
`(
	"when a body line of $bodyLine has leading and trailing whitespace",
	(props: { bodyLine: string }) => {
		const subjectLine = "more bugfixes"
		const message = [subjectLine, props.bodyLine, "another line"].join("\n")

		beforeEach(() => {
			injectGithubPullRequestCommitDtos([{ commit: { message } }])
		})

		it("preserves the body line as is", async () => {
			const [commit] = await getGithubPullRequestCommits()
			expect(commit?.bodyLines[0]).toBe(props.bodyLine)
		})
	},
)

describe.each`
	bodyLine
	${""}
	${"   "}
`("when a body line of $bodyLine is blank", (props: { bodyLine: string }) => {
	const subjectLine = "Test"
	const message = [subjectLine, props.bodyLine, "It works now."].join("\n")

	beforeEach(() => {
		injectGithubPullRequestCommitDtos([{ commit: { message } }])
	})

	it("preserves the body line as is", async () => {
		const [commit] = await getGithubPullRequestCommits()
		expect(commit?.bodyLines[0]).toBe(props.bodyLine)
	})
})

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
			injectGithubPullRequestCommitDtos([{ commit: { author } }])
		})

		it("preserves the author's name", async () => {
			const [commit] = await getGithubPullRequestCommits()
			expect(commit?.author.name).toBe(props.authorName)
		})

		it("preserves the author's email address", async () => {
			const [commit] = await getGithubPullRequestCommits()
			expect(commit?.author.email).toBe(props.authorEmail)
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
			injectGithubPullRequestCommitDtos([{ commit: { author } }])
		})

		it("preserves the author's name as is", async () => {
			const [commit] = await getGithubPullRequestCommits()
			expect(commit?.author.name).toBe(props.authorName)
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
			injectGithubPullRequestCommitDtos([{ commit: { author } }])
		})

		it("preserves the author's name as is", async () => {
			const [commit] = await getGithubPullRequestCommits()
			expect(commit?.author.name).toBe(props.authorName)
		})
	},
)

describe("when the author's name is absent", () => {
	const author: GithubCommitUserDto = {
		email: "25199993+noname@users.noreply.github.com",
	}

	beforeEach(() => {
		injectGithubPullRequestCommitDtos([{ commit: { author } }])
	})

	it("omits the author's name", async () => {
		const [commit] = await getGithubPullRequestCommits()
		expect(commit?.author.name).toBeNull()
	})

	it("preserves the author's email address", async () => {
		const [commit] = await getGithubPullRequestCommits()
		expect(commit?.author.email).toBe(author.email)
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
			injectGithubPullRequestCommitDtos([{ commit: { author } }])
		})

		it("preserves the author's email address as is", async () => {
			const [commit] = await getGithubPullRequestCommits()
			expect(commit?.author.email).toBe(props.authorEmail)
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
			injectGithubPullRequestCommitDtos([{ commit: { author } }])
		})

		it("preserves the author's email address as is", async () => {
			const [commit] = await getGithubPullRequestCommits()
			expect(commit?.author.email).toBe(props.authorEmail)
		})
	},
)

describe("when the author's email address is absent", () => {
	const author: GithubCommitUserDto = {
		name: "Unnamed 1",
	}

	beforeEach(() => {
		injectGithubPullRequestCommitDtos([{ commit: { author } }])
	})

	it("preserves the author's name", async () => {
		const [commit] = await getGithubPullRequestCommits()
		expect(commit?.author.name).toBe(author.name)
	})

	it("omits the author's email address", async () => {
		const [commit] = await getGithubPullRequestCommits()
		expect(commit?.author.email).toBeNull()
	})
})

describe("when the author is absent", () => {
	beforeEach(() => {
		injectGithubPullRequestCommitDtos([{ commit: { author: null } }])
	})

	it("omits the author's name", async () => {
		const [commit] = await getGithubPullRequestCommits()
		expect(commit?.author.name).toBeNull()
	})

	it("omits the author's email address", async () => {
		const [commit] = await getGithubPullRequestCommits()
		expect(commit?.author.email).toBeNull()
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
			injectGithubPullRequestCommitDtos([{ commit: { committer } }])
		})

		it("preserves the committer's name", async () => {
			const [commit] = await getGithubPullRequestCommits()
			expect(commit?.committer.name).toBe(props.committerName)
		})

		it("preserves the committer's email address", async () => {
			const [commit] = await getGithubPullRequestCommits()
			expect(commit?.committer.email).toBe(props.committerEmail)
		})
	},
)

describe("when the committer's name is absent", () => {
	const committer: GithubCommitUserDto = {
		email: "25199993+noname@users.noreply.github.com",
	}

	beforeEach(() => {
		injectGithubPullRequestCommitDtos([{ commit: { committer } }])
	})

	it("omits the committer's name", async () => {
		const [commit] = await getGithubPullRequestCommits()
		expect(commit?.committer.name).toBeNull()
	})

	it("preserves the committer's email address", async () => {
		const [commit] = await getGithubPullRequestCommits()
		expect(commit?.committer.email).toBe(committer.email)
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
			injectGithubPullRequestCommitDtos([{ commit: { committer } }])
		})

		it("preserves the committer's email address as is", async () => {
			const [commit] = await getGithubPullRequestCommits()
			expect(commit?.committer.email).toBe(props.committerEmail)
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
			injectGithubPullRequestCommitDtos([{ commit: { committer } }])
		})

		it("preserves the committer's email address as is", async () => {
			const [commit] = await getGithubPullRequestCommits()
			expect(commit?.committer.email).toBe(props.committerEmail)
		})
	},
)

describe("when the committer's email address is absent", () => {
	const committer: GithubCommitUserDto = {
		name: "Unnamed 2",
	}

	beforeEach(() => {
		injectGithubPullRequestCommitDtos([{ commit: { committer } }])
	})

	it("preserves the committer's name", async () => {
		const [commit] = await getGithubPullRequestCommits()
		expect(commit?.committer.name).toBe(committer.name)
	})

	it("omits the committer's email address", async () => {
		const [commit] = await getGithubPullRequestCommits()
		expect(commit?.committer.email).toBeNull()
	})
})

describe("when the committer is absent", () => {
	beforeEach(() => {
		injectGithubPullRequestCommitDtos([{ commit: { committer: null } }])
	})

	it("omits the committer's name", async () => {
		const [commit] = await getGithubPullRequestCommits()
		expect(commit?.committer.name).toBeNull()
	})

	it("omits the committer's email address", async () => {
		const [commit] = await getGithubPullRequestCommits()
		expect(commit?.committer.email).toBeNull()
	})
})

describe("when the pull request does not have any commits", () => {
	const commitDtos = dummyGithubCommitDtoVector(0)

	beforeEach(() => {
		injectGithubPullRequestCommitDtos(commitDtos, { pageSize: 5 })
	})

	it("returns an empty array of commits", async () => {
		const commits = await getGithubPullRequestCommits()
		expect(commits).toEqual([])
	})
})

describe("when the pull request has 1 commit", () => {
	const commitDtos = dummyGithubCommitDtoVector(1)

	beforeEach(() => {
		injectGithubPullRequestCommitDtos(commitDtos, { pageSize: 5 })
	})

	it("returns an array of 1 commit", async () => {
		const commits = await getGithubPullRequestCommits()
		expect(commits).toHaveLength(1)
		expect(commits).toMatchObject<[Partial<Commit>]>([
			{ sha: commitDtos[0].sha, subjectLine: "Commit 1" },
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
		const commitDtos = dummyGithubCommitDtoVector(props.count)

		beforeEach(() => {
			injectGithubPullRequestCommitDtos(commitDtos, { pageSize: 5 })
		})

		it(`returns an array of ${props.count} commits`, async () => {
			const commits = await getGithubPullRequestCommits()
			expect(commits).toHaveLength(props.count)
			expect(commits).toMatchObject(
				commitDtos.map<Partial<Commit>>((dto, index) => ({
					sha: dto.sha,
					subjectLine: `Commit ${index + 1}`,
				})),
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
		const commitDtos = dummyGithubCommitDtoVector(props.count)

		beforeEach(() => {
			injectGithubPullRequestCommitDtos(commitDtos, { pageSize: 30 })
		})

		it(`returns an array of ${props.count} commits`, async () => {
			const commits = await getGithubPullRequestCommits()
			expect(commits).toHaveLength(props.count)
			expect(commits).toMatchObject(
				commitDtos.map<Partial<Commit>>((dto, index) => ({
					sha: dto.sha,
					subjectLine: `Commit ${index + 1}`,
				})),
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
			resourceUrl = injectGithubPullRequestEventDto(props.reference)
			injectNonexistingGithubResourceDto(resourceUrl, {
				documentationUrl:
					"https://docs.github.com/rest/pulls/pulls#list-commits-on-a-pull-request",
			})
		})

		it("throws an error", async () => {
			await expect(getGithubPullRequestCommits()).rejects.toThrow(
				`Failed to fetch '${resourceUrl}': 404 Not Found`,
			)
		})
	},
)
