export type SquashMarkerToken = {
	type: "squash-marker"
	value: string
}

export function squashMarker(value: string): SquashMarkerToken {
	return { type: "squash-marker", value }
}
