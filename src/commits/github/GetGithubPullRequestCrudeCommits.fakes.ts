import { vi } from "vitest"
import type { CrudeCommits } from "#commits/CrudeCommit.ts"

vi.mock(import("#commits/github/GetGithubPullRequestCrudeCommits.ts"), async (importOriginal) => ({
	getGithubPullRequestCrudeCommits: vi.fn(async () => {
		if (mockedCrudeCommits) {
			return mockedCrudeCommits
		}

		const original = await importOriginal()
		return original.getGithubPullRequestCrudeCommits()
	}),
}))

let mockedCrudeCommits: CrudeCommits | undefined

export function mockGithubPullRequestCrudeCommits(crudeCommits?: CrudeCommits): void {
	mockedCrudeCommits = crudeCommits
}
