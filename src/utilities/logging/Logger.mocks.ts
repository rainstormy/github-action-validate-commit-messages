import { vi } from "vitest"
import type { ModuleMock } from "#types/ModuleMock.ts"

const mock: LoggerMock = vi.hoisted(
	(): LoggerMock => ({
		printMessage: vi.fn(),
		printError: vi.fn(),
	}),
)

export type LoggerMock = ModuleMock<
	typeof import("#utilities/logging/Logger.ts") // CAUTION: `vi.mock()` below must always refer to the same path as here.
>

vi.mock("#utilities/logging/Logger.ts", () => mock)

export function mockLogger(): LoggerMock {
	return mock
}
