import { vi } from "vitest"
import type { CrudeCommits } from "#commits/CrudeCommit.ts"

vi.mock(import("#commits/git/GetGitBranchCrudeCommits.ts"), async (importOriginal) => ({
	getGitBranchCrudeCommits: vi.fn(async () => {
		if (mockedCrudeCommits) {
			return mockedCrudeCommits
		}

		const original = await importOriginal()
		return original.getGitBranchCrudeCommits()
	}),
}))

let mockedCrudeCommits: CrudeCommits | undefined

export function mockGitBranchCrudeCommits(crudeCommits?: CrudeCommits): void {
	mockedCrudeCommits = crudeCommits
}
