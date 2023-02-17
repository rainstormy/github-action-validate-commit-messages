import type { Commit, ValidationRule } from "./index"

type ValidationReport = Readonly<Record<string, ReadonlyArray<Commit>>>

type ValidationReportProps = {
	readonly rules: ReadonlyArray<ValidationRule<string>>
	readonly commits: ReadonlyArray<Commit>
}

export function validationReportFrom({
	rules,
	commits,
}: ValidationReportProps): ValidationReport {
	return Object.fromEntries(
		rules
			.map((rule) => [
				rule.key,
				commits.filter((commit) => rule.validate(commit) === "invalid"),
			])
			.filter(([, invalidCommits]) => invalidCommits.length > 0),
	)
}
