import { defineValidationRule } from "../models"

export const rejectMergeCommits = defineValidationRule({
	key: "reject-merge-commits",
	validate: (commit) => (commit.isMerge ? "invalid" : "valid"),
})
