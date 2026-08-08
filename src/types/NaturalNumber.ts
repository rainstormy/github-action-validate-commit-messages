import * as v from "valibot"

// oxlint-disable-next-line typescript/explicit-function-return-type -- Rely on type inference for Valibot schemas.
export function naturalNumber(options?: { minValue: 0 | 1 }) {
	return v.pipe(v.number(), v.integer(), v.minValue(options?.minValue ?? 1))
}
