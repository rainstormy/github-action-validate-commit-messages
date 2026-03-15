import { integer, minValue, number, pipe } from "valibot"

// oxlint-disable-next-line typescript/explicit-function-return-type: Rely on type inference for Valibot schemas.
export function naturalNumber(minimumValue: 0 | 1 = 0) {
	return pipe(number(), integer(), minValue(minimumValue))
}
