import { describe, expect, it } from "vitest"
import { legacyV1SortedImperativeVerbs } from "#legacy-v1/rules/ImperativeSubjectLines/LegacyV1ImperativeSubjectLines.ts"

describe("the list of imperative verbs", () => {
	it("is sorted according to localeCompare", () => {
		const explicitlySortedVerbs = [...legacyV1SortedImperativeVerbs].sort(
			(first, second) => first.localeCompare(second, "en"),
		)
		const unexpectedDifference = legacyV1SortedImperativeVerbs.find(
			(value, index) => value !== explicitlySortedVerbs[index],
		)

		expect(unexpectedDifference).toBeUndefined()
	})
})
