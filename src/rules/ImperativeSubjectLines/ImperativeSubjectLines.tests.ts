import { sortedImperativeVerbs } from "+rules/ImperativeSubjectLines/ImperativeSubjectLines"
import { describe, expect, it } from "vitest"

describe("the list of imperative verbs", () => {
	it("is sorted according to localeCompare", () => {
		const explicitlySortedVerbs = [...sortedImperativeVerbs].sort(
			(first, second) => first.localeCompare(second, "en"),
		)
		const unexpectedDifference = sortedImperativeVerbs.find(
			(value, index) => value !== explicitlySortedVerbs[index],
		)

		expect(unexpectedDifference).toBeUndefined()
	})
})
