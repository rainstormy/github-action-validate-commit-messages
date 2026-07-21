import { notEmptyString } from "#utilities/Arrays.ts"

export function regexEnum(literals: Array<string>): string {
	return literals
		.filter(notEmptyString)
		.map((literal) => RegExp.escape(literal))
		.join("|")
}

export function regexUnion(
	alternatives: Array<string>,
	options: Partial<{ preserveCapturingGroups?: boolean }> = {},
): string {
	const preserveCapturingGroups = options.preserveCapturingGroups ?? false
	const nonEmptyAlternatives = alternatives.filter(notEmptyString)

	return preserveCapturingGroups
		? nonEmptyAlternatives.join("|")
		: nonEmptyAlternatives.map((alternative) => `(?:${alternative})`).join("|")
}
