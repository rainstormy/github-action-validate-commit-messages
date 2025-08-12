import { vi } from "vitest"
import type { ModuleMock } from "#types/ModuleMock"

export type LoggerMock = ModuleMock<
	typeof import("#utilities/logging/Logger") // CAUTION: `vi.mock()` below must always refer to the same path as here.
>

export function injectLoggerMock(): LoggerMock {
	const mock = vi.hoisted<LoggerMock>(() => ({
		printMessage: vi.fn(),
	}))

	vi.mock("#utilities/logging/Logger", () => mock)
	return mock
}
