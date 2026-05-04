import { expect, it } from "vitest"
import { ALPHABETICALLY } from "#utilities/Arrays.ts"
import { SORTED_IMPERATIVE_VERBS } from "#utilities/Verbs.ts"

it("has a sorted list of imperative verbs", () => {
	const explicitlySortedVerbs = SORTED_IMPERATIVE_VERBS.toSorted(ALPHABETICALLY)
	const unexpectedDifference = SORTED_IMPERATIVE_VERBS.find(
		(value, index) => value !== explicitlySortedVerbs[index],
	)

	expect(unexpectedDifference).toBeUndefined()
})
