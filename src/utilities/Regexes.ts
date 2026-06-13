import { notEmptyString } from "#utilities/Arrays.ts"

export function regexEnum(literals: Array<string>): string {
	return literals
		.filter(notEmptyString)
		.map((literal) => RegExp.escape(literal))
		.join("|")
}

export function regexUnion(alternatives: Array<string>): string {
	return alternatives
		.filter(notEmptyString)
		.map((alternative) => `(?:${alternative})`)
		.join("|")
}
