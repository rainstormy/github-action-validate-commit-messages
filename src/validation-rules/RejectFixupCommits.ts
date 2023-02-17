import { defineValidationRule } from "../models"

export const rejectFixupCommits = defineValidationRule({
	key: "reject-fixup-commits",
	validate: (commit) => (commit.isFixup ? "invalid" : "valid"),
})
