import type { Token } from "#commits/tokens/Token.ts"

export type DependencyVersionToken = {
	type: "dependency-version"
	value: string
}

export function dependencyVersion(value: string): DependencyVersionToken {
	return { type: "dependency-version", value }
}

export function isDependencyVersion(token: Token): token is DependencyVersionToken {
	return typeof token === "object" && token.type === "dependency-version"
}
