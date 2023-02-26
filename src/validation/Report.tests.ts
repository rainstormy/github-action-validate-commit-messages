import { dummyCommits } from "+core/dummies"
import { getAllApplicableRules, reportFrom } from "+validation"

const allApplicableRules = getAllApplicableRules()

const {
	commitsWithLowercaseSubjectLines,
	fixupCommits,
	mergeCommits,
	squashCommits,
	regularCommits,
} = dummyCommits

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
		expect(report).toHaveProperty("no-fixup-commits")
		expect(report["no-fixup-commits"]).toStrictEqual([
			fixupCommits[0],
			fixupCommits[1],
		])
	})

	it("reports the squash commit", () => {
		expect(report).toHaveProperty("no-squash-commits")
		expect(report["no-squash-commits"]).toStrictEqual([squashCommits[0]])
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
		expect(report).toHaveProperty("no-merge-commits")
		expect(report["no-merge-commits"]).toStrictEqual([mergeCommits[0]])
	})
})

describe("an exhaustive report generated from a mix of two regular commits, two commits with lowercase subject lines, and a fixup commit", () => {
	const report = reportFrom({
		ruleset: allApplicableRules,
		commitsToValidate: [
			regularCommits[0],
			commitsWithLowercaseSubjectLines[0],
			fixupCommits[0],
			commitsWithLowercaseSubjectLines[1],
			regularCommits[1],
		],
	})

	it("reports two violated rules", () => {
		expect(Object.keys(report)).toHaveLength(2)
	})

	it("reports the fixup commit", () => {
		expect(report).toHaveProperty("no-fixup-commits")
		expect(report["no-fixup-commits"]).toStrictEqual([fixupCommits[0]])
	})

	it("reports the commits with lowercase subject lines", () => {
		expect(report).toHaveProperty("capitalised-subject-lines")
		expect(report["capitalised-subject-lines"]).toStrictEqual([
			commitsWithLowercaseSubjectLines[0],
			commitsWithLowercaseSubjectLines[1],
		])
	})
})
