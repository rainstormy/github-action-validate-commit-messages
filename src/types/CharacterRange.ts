export type CharacterRange = [startIndex: number, endIndex: number]

export function formatCharacterRange(range: CharacterRange, anchoredRight: boolean): string {
	const [start, end] = range
	const length = end - start

	if (length === 1) {
		return "┬"
	}

	const longHalfLength = Math.trunc(length / 2)
	const shortHalfLength = length - longHalfLength - 1

	const longHalf = "─".repeat(longHalfLength)
	const shortHalf = "─".repeat(shortHalfLength)

	return anchoredRight ? `${longHalf}┬${shortHalf}` : `${shortHalf}┬${longHalf}`
	//                 anchored right ─╯                             ╰─ anchored left
}
