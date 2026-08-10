import { vi } from "vitest"
import type { CrudeCommits } from "#commits/CrudeCommit.ts"

vi.mock(import("#commits/GetCrudeCommits.ts"), async (importOriginal) => ({
	getCrudeCommits: vi.fn(async () => {
		if (mockedCrudeCommits) {
			return mockedCrudeCommits
		}

		const original = await importOriginal()
		return original.getCrudeCommits()
	}),
}))

let mockedCrudeCommits: CrudeCommits | undefined

export function mockCrudeCommits(crudeCommits?: CrudeCommits): void {
	mockedCrudeCommits = crudeCommits
}
