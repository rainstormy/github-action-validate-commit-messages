export type CoauthorToken = {
	type: "coauthor"
	value: string
}

export function coauthor(value: string): CoauthorToken {
	return { type: "coauthor", value }
}
