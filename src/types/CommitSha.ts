import {
	type ErrorMessage,
	type HexadecimalAction,
	type HexadecimalIssue,
	hexadecimal,
	pipe,
	type SchemaWithPipe,
	type StringIssue,
	type StringSchema,
	string,
} from "valibot"
import type { HexDigit } from "#types/HexDigit"
import {
	type NarrowToAction,
	narrowTo,
} from "#utilities/valibot/NarrowToAction"

export type CommitSha = `${HexDigit}${HexDigit}${string}`

export function commitSha(
	errorMessage?: ErrorMessage<CommitShaIssue>,
): CommitShaSchema {
	return pipe(
		string(errorMessage),
		hexadecimal(errorMessage),
		narrowTo<CommitSha>(),
	)
}

export type CommitShaSchema = SchemaWithPipe<
	readonly [
		StringSchema<ErrorMessage<CommitShaIssue> | undefined>,
		HexadecimalAction<string, ErrorMessage<CommitShaIssue> | undefined>,
		NarrowToAction<CommitSha>,
	]
>

export type CommitShaIssue = StringIssue | HexadecimalIssue<string>
