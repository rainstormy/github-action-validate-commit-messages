import { dummyCommits } from "+core/dummies"
import { reportOf } from "+github"
import { getAllApplicableRules } from "+validation"

const {
	fixupCommits,
	commitsWithDecapitalisedSubjectLines,
	mergeCommits,
	regularCommits,
	squashCommits,
} = dummyCommits

const allApplicableRules = getAllApplicableRules()

describe("a report generated from no commits", () => {
	const report = reportOf({
		ruleset: allApplicableRules,
		commitsToValidate: [],
	})

	it("is empty", () => {
		expect(report).toBeNull()
	})
})

describe("a report generated from two regular commits", () => {
	const report = reportOf({
		ruleset: allApplicableRules,
		commitsToValidate: [regularCommits[0], regularCommits[1]],
	})

	it("is empty", () => {
		expect(report).toBeNull()
	})
})

describe("a report generated from a squash commit", () => {
	const report = reportOf({
		ruleset: allApplicableRules,
		commitsToValidate: [squashCommits[0]],
	})

	it("reports one violated rule", () => {
		expect(report).toBe(
			`Squash commits detected:
    ${squashCommits[0].sha} ${squashCommits[0].toString()}

    Please rebase interactively to consolidate the squash commits before merging the pull request.`,
		)
	})
})

describe("a report generated from a mix of a merge commit and a regular commit", () => {
	const report = reportOf({
		ruleset: allApplicableRules,
		commitsToValidate: [mergeCommits[0], regularCommits[0]],
	})

	it("reports one violated rule", () => {
		expect(report).toBe(
			`Merge commits detected:
    ${mergeCommits[0].sha} ${mergeCommits[0].toString()}

    They reduce the traceability of the commit history and make it difficult to rebase interactively. Please undo the merge commit and rebase your branch onto the target branch instead.`,
		)
	})
})

describe("a report generated from a mix of two regular commits, two fixup commits, and a merge commit", () => {
	const report = reportOf({
		ruleset: allApplicableRules,
		commitsToValidate: [
			regularCommits[0],
			fixupCommits[0],
			fixupCommits[1],
			regularCommits[1],
			mergeCommits[1],
		],
	})

	it("reports two violated rules", () => {
		expect(report).toBe(
			`Fixup commits detected:
    ${fixupCommits[0].sha} ${fixupCommits[0].toString()}
    ${fixupCommits[1].sha} ${fixupCommits[1].toString()}

    Please rebase interactively to consolidate the fixup commits before merging the pull request.

Merge commits detected:
    ${mergeCommits[1].sha} ${mergeCommits[1].toString()}

    They reduce the traceability of the commit history and make it difficult to rebase interactively. Please undo the merge commit and rebase your branch onto the target branch instead.`,
		)
	})
})

describe("a report generated from a mix of two regular commits, two squash commits, two merge commits, and two fixup commits", () => {
	const report = reportOf({
		ruleset: allApplicableRules,
		commitsToValidate: [
			regularCommits[0],
			squashCommits[0],
			mergeCommits[0],
			mergeCommits[1],
			fixupCommits[0],
			squashCommits[1],
			regularCommits[1],
			fixupCommits[1],
		],
	})

	it("reports three violated rules", () => {
		expect(report).toBe(
			`Fixup commits detected:
    ${fixupCommits[0].sha} ${fixupCommits[0].toString()}
    ${fixupCommits[1].sha} ${fixupCommits[1].toString()}

    Please rebase interactively to consolidate the fixup commits before merging the pull request.

Squash commits detected:
    ${squashCommits[0].sha} ${squashCommits[0].toString()}
    ${squashCommits[1].sha} ${squashCommits[1].toString()}

    Please rebase interactively to consolidate the squash commits before merging the pull request.

Merge commits detected:
    ${mergeCommits[0].sha} ${mergeCommits[0].toString()}
    ${mergeCommits[1].sha} ${mergeCommits[1].toString()}

    They reduce the traceability of the commit history and make it difficult to rebase interactively. Please undo the merge commit and rebase your branch onto the target branch instead.`,
		)
	})
})

describe("a report generated from a mix of two regular commits, two commits with decapitalised subject lines, and a fixup commit", () => {
	const report = reportOf({
		ruleset: allApplicableRules,
		commitsToValidate: [
			regularCommits[0],
			commitsWithDecapitalisedSubjectLines[0],
			fixupCommits[0],
			commitsWithDecapitalisedSubjectLines[1],
			regularCommits[1],
		],
	})

	it("reports two violated rules", () => {
		expect(report).toBe(
			`Non-capitalised subject lines detected:
    ${
			commitsWithDecapitalisedSubjectLines[0].sha
		} ${commitsWithDecapitalisedSubjectLines[0].toString()}
    ${
			commitsWithDecapitalisedSubjectLines[1].sha
		} ${commitsWithDecapitalisedSubjectLines[1].toString()}

    Subject lines (the foremost line in the commit message) must start with an uppercase letter. Please rebase interactively to reword the commits before merging the pull request.

Fixup commits detected:
    ${fixupCommits[0].sha} ${fixupCommits[0].toString()}

    Please rebase interactively to consolidate the fixup commits before merging the pull request.`,
		)
	})
})
