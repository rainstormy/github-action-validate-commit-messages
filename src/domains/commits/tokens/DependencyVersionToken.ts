export type DependencyVersionToken = {
	type: "dependency-version"
	value: string
}

export function dependencyVersion(value: string): DependencyVersionToken {
	return { type: "dependency-version", value }
}
