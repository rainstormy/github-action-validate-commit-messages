import { describe, expect, it } from "vitest"
import { legacyV1SortedImperativeVerbs } from "#legacy-v1/rules/ImperativeSubjectLines/LegacyV1ImperativeSubjectLines.ts"
import { ALPHABETICALLY } from "#utilities/Arrays.ts"

describe("the list of imperative verbs", () => {
	it("is sorted alphabetically", () => {
		const explicitlySortedVerbs = legacyV1SortedImperativeVerbs.toSorted(ALPHABETICALLY)
		const unexpectedDifference = legacyV1SortedImperativeVerbs.find(
			(value, index) => value !== explicitlySortedVerbs[index],
		)

		expect(unexpectedDifference).toBeUndefined()
	})
})
