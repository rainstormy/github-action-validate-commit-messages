import { defineValidationRule } from "../models"

export const rejectSquashCommits = defineValidationRule({
	key: "reject-squash-commits",
	validate: (commit) => (commit.isSquash ? "invalid" : "valid"),
})
