import { dummyCommits } from "+core/dummies"
import {
	requireNonFixupCommits,
	requireNonMergeCommits,
	requireNonSquashCommits,
} from "+rules"
import { allApplicableRules, reportFrom } from "+validation"

const { regularCommits, fixupCommits, squashCommits, mergeCommits } =
	dummyCommits

describe("an exhaustive report generated from no commits", () => {
	const report = reportFrom({
		ruleset: allApplicableRules,
		commitsToValidate: [],
	})

	it("reports no violated rules", () => {
		expect(Object.keys(report)).toHaveLength(0)
	})
})

describe("an exhaustive report generated from a mix of two regular commits, two fixup commits, and one squash commit", () => {
	const report = reportFrom({
		ruleset: allApplicableRules,
		commitsToValidate: [
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
		expect(report).toHaveProperty(requireNonFixupCommits.key)
		expect(report[requireNonFixupCommits.key]).toStrictEqual([
			fixupCommits[0],
			fixupCommits[1],
		])
	})

	it("reports the squash commit", () => {
		expect(report).toHaveProperty(requireNonSquashCommits.key)
		expect(report[requireNonSquashCommits.key]).toStrictEqual([
			squashCommits[0],
		])
	})
})

describe("an exhaustive report generated from a mix of a merge commit and a regular commit", () => {
	const report = reportFrom({
		ruleset: allApplicableRules,
		commitsToValidate: [mergeCommits[0], regularCommits[0]],
	})

	it("reports one violated rule", () => {
		expect(Object.keys(report)).toHaveLength(1)
	})

	it("reports the merge commit", () => {
		expect(report).toHaveProperty(requireNonMergeCommits.key)
		expect(report[requireNonMergeCommits.key]).toStrictEqual([mergeCommits[0]])
	})
})
