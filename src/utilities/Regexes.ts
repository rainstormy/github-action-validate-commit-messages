import { isNotEmptyString } from "#utilities/Arrays.ts"

export function regexEnum(literals: Array<string>): string {
	return literals
		.filter(isNotEmptyString)
		.map((literal) => RegExp.escape(literal))
		.join("|")
}

export function regexUnion(
	alternatives: Array<string>,
	options: Partial<{ preserveCapturingGroups?: boolean }> = {},
): string {
	const preserveCapturingGroups = options.preserveCapturingGroups ?? false
	const nonEmptyAlternatives = alternatives.filter(isNotEmptyString)

	return preserveCapturingGroups
		? nonEmptyAlternatives.join("|")
		: nonEmptyAlternatives.map((alternative) => `(?:${alternative})`).join("|")
}
