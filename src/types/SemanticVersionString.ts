export type SemanticVersionString =
	| `${number}.${number}.${number}`
	| `${number}.${number}.${number}+${string}`
	| `${number}.${number}.${number}-${string}`
	| `${number}.${number}.${number}-${string}+${string}`
