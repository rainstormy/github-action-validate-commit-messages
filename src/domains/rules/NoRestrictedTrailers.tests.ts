import { describe, expect, it } from "vitest"
import { fakeCommitFactory } from "#commits/Commit.fixtures.ts"
import type { Commit } from "#commits/Commit.ts"
import { bodyLineConcern } from "#rules/concerns/BodyLineConcern.ts"
import type { Concerns } from "#rules/concerns/Concern.ts"
import { noRestrictedTrailers } from "#rules/NoRestrictedTrailers.ts"
import type { RuleKey, RuleOptions } from "#rules/Rule.ts"
import type { CharacterRange } from "#types/CharacterRange.ts"
import type { Vector } from "#types/Vector.ts"

const rule = "noRestrictedTrailers" satisfies RuleKey

const enabledNone: RuleOptions<typeof rule> = { restrictedKeys: [] }
const enabled1: RuleOptions<typeof rule> = { restrictedKeys: ["signed-off-by"] }
const enabled2: RuleOptions<typeof rule> = { restrictedKeys: ["co-authored-by", "breaking change"] }
const enabled3: RuleOptions<typeof rule> = {
	restrictedKeys: ["co-authored-by", "refs", "reviewed-by"],
}

const fakeCommit = fakeCommitFactory()

describe.each`
	message                                                                                                                                                                                                                                                        | expectedRanges1                                                                            | expectedRanges2                                               | expectedRanges3
	${"keep the audit trail warm\nsigned-off-by: casey jones <casey.jones@fastforward.com>"}                                                                                                                                                                       | ${[{ line: 0, range: [0, 14] }]}                                                           | ${[]}                                                         | ${[]}
	${"Calibrate the hot chocolate machine\nThe pressure now stays pleasantly dramatic.\n Signed-off-by:Michelangelo di Lodovico Buonarroti Simoni <28317649+cowabunga@users.noreply.github.com>"}                                                                 | ${[{ line: 1, range: [1, 15] }]}                                                           | ${[]}                                                         | ${[]}
	${"Document the pizza protocol\n\nFor the record, it goes like this:\n1. Invite everyone over for pizza and movie night.\n2. Order plenty of pizza, especially the legendary no. 12\n3. Have fun!!\n\n  SIGNED-OFF-BY:   Hamato Yoshi <hamato@nycsewers.com>"} | ${[{ line: 6, range: [2, 16] }]}                                                           | ${[]}                                                         | ${[]}
	${"triple-check the sign-off drawer\n\nsigned-off-by :  April O'Neil <april.oneil@fastforward.com>\nsigned-off-by:Casey Jones <casey.jones@fastforward.com>\nSIGNED-OFF-BY: Hamato Yoshi <hamato@nycsewers.com>"}                                              | ${[{ line: 1, range: [0, 15] }, { line: 2, range: [0, 14] }, { line: 3, range: [0, 14] }]} | ${[]}                                                         | ${[]}
	${"Pack the deploy snacks\n\nAcked-by: Casey Jones <casey.jones@fastforward.com>\nSigned-off-by: April O'Neil <april.oneil@fastforward.com>\nRelates-to: snack table"}                                                                                         | ${[{ line: 2, range: [0, 14] }]}                                                           | ${[]}                                                         | ${[]}
	${"one link and two notes\n\nsigned-off-by: april o'neil <april.oneil@fastforward.com>\nrefs: #668182\nchange-id: deadc0de"}                                                                                                                                   | ${[{ line: 1, range: [0, 14] }]}                                                           | ${[]}                                                         | ${[{ line: 2, range: [0, 5] }]}
	${"stamp the baseball\n\nChange-Id: cafebeef\nReviewed-by: April O'Neil <april.oneil@fastforward.com>\nSigned-off-by: Casey Jones <casey.jones@example.com>"}                                                                                                  | ${[{ line: 3, range: [0, 14] }]}                                                           | ${[]}                                                         | ${[{ line: 2, range: [0, 12] }]}
	${"release train part 1\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>\nBREAKING CHANGE: The old seating chart is gone.\nSigned-off-by: April O'Neil <april.oneil@fastforward.com>"}                                                  | ${[{ line: 3, range: [0, 14] }]}                                                           | ${[{ line: 1, range: [0, 15] }, { line: 2, range: [0, 16] }]} | ${[{ line: 1, range: [0, 15] }]}
	${"Record the quiet acknowledgements\n\nBREAKING CHANGE:"}                                                                                                                                                                                                     | ${[]}                                                                                      | ${[{ line: 1, range: [0, 16] }]}                              | ${[]}
	${"Teach the build script a new trick\n\n breaking change: The old spell is gone."}                                                                                                                                                                            | ${[]}                                                                                      | ${[{ line: 1, range: [1, 17] }]}                              | ${[]}
	${"Break the old thing twice, politely\n\nBREAKING CHANGE: The old switch has left town.\nbreaking change: The old hallway is also closed."}                                                                                                                   | ${[]}                                                                                      | ${[{ line: 1, range: [0, 16] }, { line: 2, range: [0, 16] }]} | ${[]}
	${"Update src/main.ts\n\nCo-Authored-By: Everloving Easter Bunny <everloving.easter.bunny@example.com>"}                                                                                                                                                       | ${[]}                                                                                      | ${[{ line: 1, range: [0, 15] }]}                              | ${[{ line: 1, range: [0, 15] }]}
	${"Refine the button wobble\n\nThe wobble is now intentional.\n\nCO-AUTHORED-BY: Michelangelo di Lodovico Buonarroti Simoni <28317649+cowabunga@users.noreply.github.com>"}                                                                                    | ${[]}                                                                                      | ${[{ line: 3, range: [0, 15] }]}                              | ${[{ line: 3, range: [0, 15] }]}
	${"Wire the release breadcrumb trail\n\nReviewed-By: April O'Neil <april.oneil@fastforward.com>\nCo-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>\nSigned-Off-By: Hamato Yoshi <hamato@nycsewers.com>\nRefs: #123"}                                     | ${[{ line: 3, range: [0, 14] }]}                                                           | ${[{ line: 2, range: [0, 15] }]}                              | ${[{ line: 1, range: [0, 12] }, { line: 2, range: [0, 15] }, { line: 4, range: [0, 5] }]}
	${"link the quiet paperwork\n\nrefs: #123"}                                                                                                                                                                                                                    | ${[]}                                                                                      | ${[]}                                                         | ${[{ line: 1, range: [0, 5] }]}
	${"Upgrade `BadgePrinter`\n\nThe queue no longer panics.\n\n Refs: #1648\nRefs: GH-21523"}                                                                                                                                                                     | ${[]}                                                                                      | ${[]}                                                         | ${[{ line: 3, range: [1, 6] }, { line: 4, range: [0, 5] }]}
	${"line up the approval stamps\n\nRefs: https://github.com/rainstormy/comet/issues/38"}                                                                                                                                                                        | ${[]}                                                                                      | ${[]}                                                         | ${[{ line: 1, range: [0, 5] }]}
	${"handbook renewed\nthe checklist learned some manners\nREVIEWED-BY: Copilot <223556219+Copilot@users.noreply.github.com>"}                                                                                                                                   | ${[]}                                                                                      | ${[]}                                                         | ${[{ line: 1, range: [0, 12] }]}
	${"Credit the careful reviewers\n\nReviewed-by: April O'Neil <april.oneil@fastforward.com>\nReviewed-By: Raph <theraffaelloexperience@tmnt.com>\nReviewed-by: Donatello <42069849+gogogadget@users.noreply.github.com>"}                                       | ${[]}                                                                                      | ${[]}                                                         | ${[{ line: 1, range: [0, 12] }, { line: 2, range: [0, 12] }, { line: 3, range: [0, 12] }]}
`(
	"when the commit message of $message contains restricted trailers",
	(props: {
		message: string
		expectedRanges1: Array<{ line: number; range: CharacterRange }>
		expectedRanges2: Array<{ line: number; range: CharacterRange }>
		expectedRanges3: Array<{ line: number; range: CharacterRange }>
	}) => {
		const commit = fakeCommit({ message: props.message })

		describe.each`
			options     | expectedRanges
			${enabled1} | ${props.expectedRanges1}
			${enabled2} | ${props.expectedRanges2}
			${enabled3} | ${props.expectedRanges3}
		`(
			"and the rule is enabled with restrictions on $options.restrictedKeys",
			(optionProps: {
				options: RuleOptions<typeof rule>
				expectedRanges: Array<{ line: number; range: CharacterRange }>
			}) => {
				const actualConcerns = noRestrictedTrailers([commit], optionProps.options)

				it(
					// oxlint-disable-next-line jest/no-conditional-in-test -- The conditional expression only affects the test name.
					optionProps.expectedRanges.length > 0
						? "raises concerns about the disallowed trailer keys"
						: "does not raise any concerns",
					() => {
						const expectedConcerns: Concerns = optionProps.expectedRanges.map((range) =>
							bodyLineConcern(rule, commit.sha, range),
						)
						expect(actualConcerns).toEqual<Concerns>(expectedConcerns)
					},
				)
			},
		)

		describe("and the rule is enabled with no restricted trailers", () => {
			const actualConcerns = noRestrictedTrailers([commit], enabledNone)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = noRestrictedTrailers([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe.each`
	message
	${"init"}
	${"refs: this looked official for a moment."}
	${"Signed-off-by: April O'Neil <april.oneil@fastforward.com>"}
	${"Explain the suspicious label\nRefs: This looked official for a moment.\nThen the paragraph kept going."}
	${"Do some pair programming\n\nCo-authored-by: Gon Freecss <rock.paper.scissors@hunters.com>\n\nAll participants had fun."}
	${"Resolve the conflicts\n\nConflicts:\n\n src/main.ts\n src/tests.ts"}
	${"move trailers to the garage\n\nchange-id: 0ff1ce\nacked-by: casey jones <casey.jones@example.com>\nrelates-to: snack table"}
	${"Swap the config keys\n\nThe old key now takes a nap."}
`(
	"when the commit message of $message does not contain any restricted trailers",
	(props: { message: string }) => {
		const commit = fakeCommit({ message: props.message })

		describe.each`
			options
			${enabled1}
			${enabled2}
			${enabled3}
		`(
			"and the rule is enabled with restrictions on $options.restrictedKeys",
			(optionProps: { options: RuleOptions<typeof rule> }) => {
				const actualConcerns = noRestrictedTrailers([commit], optionProps.options)

				it("does not raise any concerns", () => {
					expect(actualConcerns).toEqual<Concerns>([])
				})
			},
		)

		describe("and the rule is enabled with no restricted trailers", () => {
			const actualConcerns = noRestrictedTrailers([commit], enabledNone)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})

		describe("and the rule is disabled", () => {
			const actualConcerns = noRestrictedTrailers([commit], null)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		})
	},
)

describe("when verifying a set of multiple commits and some commits contain restricted trailers", () => {
	const commits: Vector<Commit, 7> = [
		fakeCommit({ message: "Refactor the taxi module\n\nThe meter now accepts exact change." }),
		fakeCommit({
			message:
				"Update src/main.ts\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>\n Reviewed-by: Leonardo da Vinci <71091436+katanaturtle@users.noreply.github.com>",
		}),
		fakeCommit({
			message:
				"credit the careful reviewers\n\nreviewed-by: April O'Neil <april.oneil@fastforward.com>",
		}),
		fakeCommit({
			message:
				"Explain the suspicious label\nRefs: This looked official for a moment.\nThen the paragraph kept going.",
		}),
		fakeCommit({ message: "fix this confusing plate of spaghetti" }),
		fakeCommit({ message: "Record the quiet acknowledgements\n\nBREAKING CHANGE:" }),
		fakeCommit({
			message: "squash! serve the tiny sandwiches\n guests get fewer crumbs in the keyboard",
		}),
	]

	describe.each`
		options     | expectedConcerns
		${enabled1} | ${[]}
		${enabled2} | ${[bodyLineConcern(rule, commits[1].sha, { line: 1, range: [0, 15] }), bodyLineConcern(rule, commits[5].sha, { line: 1, range: [0, 16] })]}
		${enabled3} | ${[bodyLineConcern(rule, commits[1].sha, { line: 1, range: [0, 15] }), bodyLineConcern(rule, commits[1].sha, { line: 2, range: [1, 13] }), bodyLineConcern(rule, commits[2].sha, { line: 1, range: [0, 12] })]}
	`(
		"and the rule is enabled with $options.restrictedKeys restricted",
		(props: { options: RuleOptions<typeof rule>; expectedConcerns: Concerns }) => {
			const actualConcerns = noRestrictedTrailers(commits, props.options)

			it(
				// oxlint-disable-next-line jest/no-conditional-in-test -- The conditional expression only affects the test name.
				props.expectedConcerns.length > 0
					? "raises concerns about the disallowed trailer keys"
					: "does not raise any concerns",
				() => {
					expect(actualConcerns).toEqual(props.expectedConcerns)
				},
			)
		},
	)

	describe("and the rule is enabled with no restricted trailers", () => {
		const actualConcerns = noRestrictedTrailers(commits, enabledNone)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = noRestrictedTrailers(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})

describe("when verifying a set of multiple commits and no commits contain restricted trailers", () => {
	const commits: Vector<Commit, 8> = [
		fakeCommit({
			message:
				"fix a longstanding bug\n\nit was just a matter of time before it would cause customers to complain ",
		}),
		fakeCommit({ message: "fixup! Apply strawberry jam to make the code sweeter\n\n\n" }),
		fakeCommit({ message: "Refactor the taxi module\nThe roof sign now flashes politely." }),
		fakeCommit({
			message:
				"Bump @typescript-eslint/parser from 5.52.0 to 5.59.1\n\n\n\n\nBumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 5.52.0 to 5.59.1.\n- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)\n- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)",
		}),
		fakeCommit({
			message:
				"Teach the changelog to whisper\n\nThe noisy bits moved to the release notes.\n\nFooter: charming",
		}),
		fakeCommit({ message: "Use precise names\n" }),
		fakeCommit({
			message:
				"Resolve the conflicts\n\nConflicts:\n\n src/grumpy-cat.ts\n src/summer-vacation-plans.ts",
		}),
		fakeCommit({ message: '#1 Revert "Add an amazing feature"' }),
	]

	describe.each`
		options
		${enabled1}
		${enabled2}
		${enabled3}
	`(
		"and the rule is enabled with restrictions on $options.restrictedKeys",
		(optionProps: { options: RuleOptions<typeof rule> }) => {
			const actualConcerns = noRestrictedTrailers(commits, optionProps.options)

			it("does not raise any concerns", () => {
				expect(actualConcerns).toEqual<Concerns>([])
			})
		},
	)

	describe("and the rule is enabled with no restricted trailers", () => {
		const actualConcerns = noRestrictedTrailers(commits, enabledNone)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})

	describe("and the rule is disabled", () => {
		const actualConcerns = noRestrictedTrailers(commits, null)

		it("does not raise any concerns", () => {
			expect(actualConcerns).toEqual<Concerns>([])
		})
	})
})
