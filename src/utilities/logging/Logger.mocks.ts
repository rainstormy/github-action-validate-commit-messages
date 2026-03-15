import { vi } from "vitest"

vi.mock(import("#utilities/logging/Logger.ts"), () => ({
	printMessage: vi.fn(),
	printError: vi.fn(),
}))

export function mockLogger(): void {
	// Do nothing, but importing this file triggers `vi.mock()` above as a side effect.
}
