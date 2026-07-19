export type CharacterRange = [startIndex: number, endIndex: number]

export function nonEmptyRangeOf(start: number, end: number): CharacterRange {
	return end > start ? [start, end] : [start, start + 1]
}

export function rangeBetween(a: CharacterRange, b: CharacterRange): CharacterRange {
	return [Math.min(a[0], b[0]), Math.max(a[1], b[1])]
}

export function formatRange(range: CharacterRange, anchoredRight: boolean): string {
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
