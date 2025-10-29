import { hexadecimal, pipe, string } from "valibot"
import type { HexDigit } from "#types/HexDigit.ts"
import { narrowTo } from "#utilities/valibot/NarrowToAction.ts"

// TypeScript has a limit on the expanded set of string types derived from a template string type.
// Use two hex digits to catch the most obvious type errors.
export type CommitSha = `${HexDigit}${HexDigit}${string}`

export function commitSha() {
	return pipe(string(), hexadecimal(), narrowTo<CommitSha>())
}
