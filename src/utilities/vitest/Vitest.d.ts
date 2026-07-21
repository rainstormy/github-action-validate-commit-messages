import "vitest"
import type { TokenType } from "#commits/Token.ts"
import type { NonEmptyArray } from "#utilities/Arrays.ts"

declare module "vitest" {
	interface Matchers<T = unknown> {
		toContainToken: (...desiredTypes: NonEmptyArray<TokenType>) => void
	}
}
