import type { Commit } from "+core"
import type { ApplicableRuleKey, Ruleset } from "+validation"

export type Report = Readonly<Record<ApplicableRuleKey, ReadonlyArray<Commit>>>

type ReportProps = {
	readonly ruleset: Ruleset
	readonly commitsToValidate: ReadonlyArray<Commit>
}

export function reportFrom({
	ruleset,
	commitsToValidate,
}: ReportProps): Report {
	return Object.fromEntries(
		ruleset
			.map((rule) => [
				rule.key,
				commitsToValidate.filter(
					(commit) => rule.validate(commit) === "invalid",
				),
			])
			.filter(([, invalidCommits]) => invalidCommits.length > 0),
	)
}
