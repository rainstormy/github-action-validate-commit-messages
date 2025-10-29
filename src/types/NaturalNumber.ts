import { integer, minValue, number, pipe } from "valibot"

export function naturalNumber(minimumValue: 0 | 1 = 0) {
	return pipe(number(), integer(), minValue(minimumValue))
}
