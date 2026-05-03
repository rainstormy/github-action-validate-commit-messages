import type { LegacyV1ImperativeSubjectLinesConfiguration } from "#legacy-v1/rules/ImperativeSubjectLines/LegacyV1ImperativeSubjectLinesConfiguration.ts"
import type { LegacyV1Commits } from "#legacy-v1/rules/LegacyV1Commit.ts"
import type { LegacyV1Rule } from "#legacy-v1/rules/LegacyV1Rule.ts"
import { isImperativeVerb } from "#utilities/Verbs.ts"

export function legacyV1ImperativeSubjectLines({
	whitelist,
}: LegacyV1ImperativeSubjectLinesConfiguration): LegacyV1Rule {
	const customWordsToAccept = new Set(whitelist.map((word) => word.toLowerCase()))

	return {
		key: "imperative-subject-lines",
		getInvalidCommits: (refinedCommits: LegacyV1Commits): LegacyV1Commits =>
			refinedCommits
				.map((commit) => {
					const { refinedSubjectLine } = commit
					const leadingWord = getLeadingWord(refinedSubjectLine)
					return [commit, leadingWord] as const
				})
				.filter(([, leadingWord]) => leadingWord !== "")
				.filter(([, leadingWord]) => !customWordsToAccept.has(leadingWord))
				.filter(([, leadingWord]) => !isImperativeVerb(leadingWord))
				.map(([commit]) => commit),
	}
}

function getLeadingWord(refinedSubjectLine: string): string {
	return refinedSubjectLine.split(" ")[0]?.trim().toLowerCase() ?? ""
}
