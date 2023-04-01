export function countOccurrences(
	value: string,
	characterToCount: string,
): number {
	return value.split(characterToCount).length - 1
}
