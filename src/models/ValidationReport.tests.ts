import {
	rejectFixupCommits,
	rejectMergeCommits,
	rejectSquashCommits,
} from "../validation-rules"
import { dummyCommits } from "./Commit.dummies"
import { validationReportFrom } from "./ValidationReport"

const { regularCommits, fixupCommits, squashCommits, mergeCommits } =
	dummyCommits

const rules = [rejectFixupCommits, rejectSquashCommits, rejectMergeCommits]

describe("a validation report generated from no commits", () => {
	const report = validationReportFrom({
		rules,
		commits: [],
	})

	it("reports no violated rules", () => {
		expect(Object.keys(report)).toHaveLength(0)
	})
})

describe("a validation report generated from a mix of two regular commits, two fixup commits, and one squash commit", () => {
	const report = validationReportFrom({
		rules,
		commits: [
			regularCommits[0],
			regularCommits[1],
			fixupCommits[0],
			fixupCommits[1],
			squashCommits[0],
		],
	})

	it("reports two violated rules", () => {
		expect(Object.keys(report)).toHaveLength(2)
	})

	it("reports the fixup commits", () => {
		expect(report).toHaveProperty(rejectFixupCommits.key)
		expect(report[rejectFixupCommits.key]).toStrictEqual([
			fixupCommits[0],
			fixupCommits[1],
		])
	})

	it("reports the squash commit", () => {
		expect(report).toHaveProperty(rejectSquashCommits.key)
		expect(report[rejectSquashCommits.key]).toStrictEqual([squashCommits[0]])
	})
})

describe("a validation report generated from a mix of a merge commit and a regular commit", () => {
	const report = validationReportFrom({
		rules,
		commits: [mergeCommits[0], regularCommits[0]],
	})

	it("reports one violated rule", () => {
		expect(Object.keys(report)).toHaveLength(1)
	})

	it("reports the merge commit", () => {
		expect(report).toHaveProperty(rejectMergeCommits.key)
		expect(report[rejectMergeCommits.key]).toStrictEqual([mergeCommits[0]])
	})
})
