import { dummyCommits } from "+core/dummies"
import { allApplicableRules, reportFrom } from "+validation"
import { formattedReportFrom } from "./FormattedReport"

const {
	fixupCommits,
	commitsWithDecapitalisedSubjectLines,
	mergeCommits,
	regularCommits,
	squashCommits,
} = dummyCommits

describe("a formatted report generated from regular commits", () => {
	const report = reportFrom({
		ruleset: allApplicableRules,
		commitsToValidate: regularCommits,
	})
	const formattedReport = formattedReportFrom(report)

	it("is empty", () => {
		expect(formattedReport).toBeNull()
	})
})

describe("a formatted report generated from a squash commit", () => {
	const report = reportFrom({
		ruleset: allApplicableRules,
		commitsToValidate: [squashCommits[0]],
	})
	const formattedReport = formattedReportFrom(report)

	it("reports one violated rule", () => {
		expect(formattedReport).toBe(
			`Squash commits detected:
    ${squashCommits[0].sha} ${squashCommits[0].toString()}

    Please rebase interactively to consolidate the squash commits before merging the pull request.`,
		)
	})
})

describe("a formatted report generated from a mix of a merge commit and a regular commit", () => {
	const report = reportFrom({
		ruleset: allApplicableRules,
		commitsToValidate: [mergeCommits[0], regularCommits[0]],
	})
	const formattedReport = formattedReportFrom(report)

	it("reports one violated rule", () => {
		expect(formattedReport).toBe(
			`Merge commits detected:
    ${mergeCommits[0].sha} ${mergeCommits[0].toString()}

    They reduce the traceability of the commit history and make it difficult to rebase interactively. Please undo the merge commit and rebase your branch onto the target branch instead.`,
		)
	})
})

describe("a formatted report generated from a mix of regular commits, fixup commits, and a merge commit", () => {
	const report = reportFrom({
		ruleset: allApplicableRules,
		commitsToValidate: [
			regularCommits[0],
			fixupCommits[0],
			fixupCommits[1],
			regularCommits[1],
			mergeCommits[1],
		],
	})
	const formattedReport = formattedReportFrom(report)

	it("reports two violated rules", () => {
		expect(formattedReport).toBe(
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

describe("a formatted report generated from a mix of regular commits, squash commits, merge commits, and fixup commits", () => {
	const report = reportFrom({
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
	const formattedReport = formattedReportFrom(report)

	it("reports three violated rules", () => {
		expect(formattedReport).toBe(
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

describe("a formatted report generated from a mix of regular commits, commits with decapitalised subject lines, and a fixup commit", () => {
	const report = reportFrom({
		ruleset: allApplicableRules,
		commitsToValidate: [
			regularCommits[0],
			commitsWithDecapitalisedSubjectLines[0],
			fixupCommits[0],
			commitsWithDecapitalisedSubjectLines[1],
			regularCommits[1],
		],
	})
	const formattedReport = formattedReportFrom(report)

	it("reports two violated rules", () => {
		expect(formattedReport).toBe(
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
