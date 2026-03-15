import { hexadecimal, pipe, string } from "valibot"
import type { HexDigit } from "#types/HexDigit.ts"
import { narrowTo } from "#utilities/valibot/NarrowToAction.ts"

// TypeScript has a limit on the expanded set of string types derived from a template string type.
// Use two hex digits to catch the most obvious type errors.
export type CommitSha = `${HexDigit}${HexDigit}${string}`

// oxlint-disable-next-line typescript/explicit-function-return-type: Rely on type inference for Valibot schemas.
export function commitSha() {
	return pipe(string(), hexadecimal(), narrowTo<CommitSha>())
}
