import { dummyCommits } from "+core/dummies"
import { allApplicableRules, reportFrom } from "+validation"
import { formattedReportFrom } from "./FormattedReport"

const { fixupCommits, mergeCommits, regularCommits, squashCommits } =
	dummyCommits

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
    ${squashCommits[0].sha} ${squashCommits[0].subjectLine}

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
    ${mergeCommits[0].sha} ${mergeCommits[0].subjectLine}

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
    ${fixupCommits[0].sha} ${fixupCommits[0].subjectLine}
    ${fixupCommits[1].sha} ${fixupCommits[1].subjectLine}

    Please rebase interactively to consolidate the fixup commits before merging the pull request.

Merge commits detected:
    ${mergeCommits[1].sha} ${mergeCommits[1].subjectLine}

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

	it("reports two violated rules", () => {
		expect(formattedReport).toBe(
			`Fixup commits detected:
    ${fixupCommits[0].sha} ${fixupCommits[0].subjectLine}
    ${fixupCommits[1].sha} ${fixupCommits[1].subjectLine}

    Please rebase interactively to consolidate the fixup commits before merging the pull request.

Squash commits detected:
    ${squashCommits[0].sha} ${squashCommits[0].subjectLine}
    ${squashCommits[1].sha} ${squashCommits[1].subjectLine}

    Please rebase interactively to consolidate the squash commits before merging the pull request.

Merge commits detected:
    ${mergeCommits[0].sha} ${mergeCommits[0].subjectLine}
    ${mergeCommits[1].sha} ${mergeCommits[1].subjectLine}

    They reduce the traceability of the commit history and make it difficult to rebase interactively. Please undo the merge commit and rebase your branch onto the target branch instead.`,
		)
	})
})
