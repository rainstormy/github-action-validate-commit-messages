import type { Rule } from "+rules"

export function emptyLineAfterSubjectLines(): Rule {
	return {
		key: "empty-line-after-subject-lines",
		validate: ({ bodyLines }) =>
			(bodyLines.length > 0 && bodyLines[0] !== "") ||
			(bodyLines.length > 1 && bodyLines[1] === "")
				? "invalid"
				: "valid",
	}
}
