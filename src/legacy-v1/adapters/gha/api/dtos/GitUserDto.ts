import { type InferOutput, object, optional, string } from "valibot"

export type GitUserDto = InferOutput<typeof gitUserDtoSchema>

export const gitUserDtoSchema = object({
	name: optional(string()),
	email: optional(string()),
})
