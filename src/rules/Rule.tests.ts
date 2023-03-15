import type { RawCommit, RuleKey } from "+rules"
import { dummyCommit } from "+rules"
import { count } from "+utilities"
import type { Configuration } from "+validator"
import {
	dummyDefaultConfiguration,
	dummyGithubStyleIssueReferencesAsPrefixConfiguration,
	validatorFrom,
	violatedRulesReporter,
} from "+validator"

describe("when the configuration has default settings", () => {
	const validate = validateViolatedRulesFrom(dummyDefaultConfiguration)

	describe.each`
		subjectLine                                              | expectedViolatedRuleKeys
		${"Release the robot butler"}                            | ${[]}
		${"Fix this confusing plate of spaghetti"}               | ${[]}
		${""}                                                    | ${["multi-word-subject-lines"]}
		${" "}                                                   | ${["multi-word-subject-lines"]}
		${"fixup!"}                                              | ${["multi-word-subject-lines", "no-squash-commits"]}
		${"test"}                                                | ${["capitalised-subject-lines", "multi-word-subject-lines"]}
		${"Formatting."}                                         | ${["multi-word-subject-lines", "no-trailing-punctuation-in-subject-lines"]}
		${"fixup! Resolve a bug that thought it was a feature"}  | ${["no-squash-commits"]}
		${"fixup!  Add some extra love to the code"}             | ${["no-squash-commits"]}
		${"fixup! fixup! Fix this confusing plate of spaghetti"} | ${["no-squash-commits"]}
		${"amend!Apply strawberry jam to make the code sweeter"} | ${["no-squash-commits"]}
		${"amend! Solve the problem"}                            | ${["no-squash-commits"]}
		${"squash!Make the formatter happy again :)"}            | ${["no-squash-commits"]}
		${"squash!   Organise the bookshelf"}                    | ${["no-squash-commits"]}
		${"Make the commit scream fixup! again"}                 | ${[]}
		${"release the robot butler"}                            | ${["capitalised-subject-lines"]}
		${"fix this confusing plate of spaghetti"}               | ${["capitalised-subject-lines"]}
		${"fixup! resolve a bug that thought it was a feature"}  | ${["capitalised-subject-lines", "no-squash-commits"]}
		${"amend! make the program act like a clown"}            | ${["capitalised-subject-lines", "no-squash-commits"]}
		${"squash! organise the bookshelf"}                      | ${["capitalised-subject-lines", "no-squash-commits"]}
		${"Make the program act like a clown."}                  | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Spot a UFO,"}                                         | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Solve the following issue:"}                          | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Throw a tantrum;"}                                    | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Make it work!"}                                       | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Wonder if this will work?"}                           | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Apply strawberry jam to make the code sweeter-"}      | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Write the answer ="}                                  | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Begin the implementation with more to come+"}         | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Fix a typo: set up*"}                                 | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Fix a typo: 'setup' ->"}                              | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Fix another typo: 'checkout' =>"}                     | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Short-circuit the loop with &&"}                      | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Short-circuit the loop with ||"}                      | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Ignore the parameter with _"}                         | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Replace Math.pow() with **"}                          | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Replace block comments with //"}                      | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Introduce an observable named event$"}                | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Finish the job (after the lunch break)"}              | ${[]}
		${"Proceed with the job [work in progress]"}             | ${[]}
		${"Support more delimiters for `rules`"}                 | ${[]}
		${"Rename the 'strategy'"}                               | ${[]}
		${'Enclose the text in "quotes"'}                        | ${[]}
		${"Quote the «text»"}                                    | ${[]}
		${"Emphasise even more »well-written prose«"}            | ${[]}
		${"Finish the job after the lunch break)"}               | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Proceed with the job which is a work in progress]"}   | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Support more delimiters for rules`"}                  | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Rename the strategy'"}                                | ${["no-trailing-punctuation-in-subject-lines"]}
		${'Enclose the text in quotes"'}                         | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Quote the text»"}                                     | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Emphasise even more well-written prose«"}             | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Increase the tax level to 100%"}                      | ${[]}
		${'Adjust to print margin to 2"'}                        | ${[]}
		${"Restrict the content to ages 3+"}                     | ${[]}
		${"Display 120 as the result of 5!"}                     | ${[]}
		${"Sneak in a funny easter egg :joy:"}                   | ${[]}
		${"Have fun :slightly_smiling_face:"}                    | ${[]}
		${"Sneak in a funny easter egg :)"}                      | ${[]}
		${"Sneak in a funny easter egg :-)"}                     | ${[]}
		${"Sneak in a funny easter egg =)"}                      | ${[]}
		${"Sneak in a funny easter egg ^^"}                      | ${[]}
		${"Sneak in a funny easter egg ^_^"}                     | ${[]}
		${"Fix your mistakes ;)"}                                | ${[]}
		${"Fix your mistakes ;-)"}                               | ${[]}
		${"Attempt to fix the bug again :("}                     | ${[]}
		${"Attempt to fix the bug again :-("}                    | ${[]}
		${"Attempt to fix the bug again =("}                     | ${[]}
		${"Make the user interface less chaotic :/"}             | ${[]}
		${"Make the user interface less chaotic :-/"}            | ${[]}
		${"Make the user interface less chaotic :\\"}            | ${[]}
		${"Make the user interface less chaotic :-\\"}           | ${[]}
		${"Confuse the bug to make it go away :|"}               | ${[]}
		${"Confuse the bug to make it go away :-|"}              | ${[]}
		${"Threaten the bug with C++"}                           | ${[]}
		${"Attempt to solve the problem in C#"}                  | ${[]}
		${"Rewrite the program in F#"}                           | ${[]}
		${"Prove it in F*"}                                      | ${[]}
		${"Validate the model in VDM++"}                         | ${[]}
		${"organise the bookshelf."}                             | ${["capitalised-subject-lines", "no-trailing-punctuation-in-subject-lines"]}
		${"amend! solve the problem!"}                           | ${["capitalised-subject-lines", "no-squash-commits", "no-trailing-punctuation-in-subject-lines"]}
	`(
		"a commit with a subject line of $subjectLine",
		(testRow: {
			readonly subjectLine: string
			readonly expectedViolatedRuleKeys: ReadonlyArray<RuleKey>
		}) => {
			const { subjectLine, expectedViolatedRuleKeys } = testRow

			it(`violates ${formatRuleKeys(expectedViolatedRuleKeys)}`, () => {
				const actualViolatedRuleKeys = validate(dummyCommit({ subjectLine }))
				expect(actualViolatedRuleKeys).toStrictEqual(expectedViolatedRuleKeys)
			})
		},
	)

	describe.each`
		subjectLine                                               | numberOfParents | expectedViolatedRuleKeys
		${"Keep my branch up to date"}                            | ${3}            | ${["no-merge-commits"]}
		${"Merge branch 'main' into bugfix/dance-party-playlist"} | ${2}            | ${["no-merge-commits"]}
	`(
		"a merge commit with a subject line of $subjectLine",
		(testRow: {
			readonly subjectLine: string
			readonly numberOfParents: number
			readonly expectedViolatedRuleKeys: ReadonlyArray<RuleKey>
		}) => {
			const { subjectLine, numberOfParents, expectedViolatedRuleKeys } = testRow

			it(`violates ${formatRuleKeys(expectedViolatedRuleKeys)}`, () => {
				const actualViolatedRuleKeys = validate(
					dummyCommit({ subjectLine, numberOfParents }),
				)
				expect(actualViolatedRuleKeys).toStrictEqual(expectedViolatedRuleKeys)
			})
		},
	)
})

describe("when the configuration overrides 'issue-references-in-subject-lines--patterns' with GitHub-style issue references as prefix", () => {
	const validate = validateViolatedRulesFrom(
		dummyGithubStyleIssueReferencesAsPrefixConfiguration,
	)

	describe.each`
		subjectLine                                                   | expectedViolatedRuleKeys
		${"Release the robot butler"}                                 | ${["issue-references-in-subject-lines"]}
		${"Fix this confusing plate of spaghetti"}                    | ${["issue-references-in-subject-lines"]}
		${'Revert "Release the robot butler"'}                        | ${[]}
		${"#1"}                                                       | ${["multi-word-subject-lines"]}
		${"fixup! Resolve a bug that thought it was a feature"}       | ${["no-squash-commits", "issue-references-in-subject-lines"]}
		${"fixup! #1 Fix this confusing plate of spaghetti"}          | ${["no-squash-commits"]}
		${"(#42)amend!Apply strawberry jam to make the code sweeter"} | ${["no-squash-commits"]}
		${"#7044: Solve the problem"}                                 | ${[]}
		${"squash! #3 Make the formatter happy again :)"}             | ${["no-squash-commits"]}
		${"#7 #8 resolve a bug that thought it was a feature"}        | ${["capitalised-subject-lines"]}
		${"amend! #55: make the program act like a clown"}            | ${["capitalised-subject-lines", "no-squash-commits"]}
	`(
		"a commit with a subject line of $subjectLine",
		(testRow: {
			readonly subjectLine: string
			readonly expectedViolatedRuleKeys: ReadonlyArray<RuleKey>
		}) => {
			const { subjectLine, expectedViolatedRuleKeys } = testRow

			it(`violates ${formatRuleKeys(expectedViolatedRuleKeys)}`, () => {
				const actualViolatedRuleKeys = validate(dummyCommit({ subjectLine }))
				expect(actualViolatedRuleKeys).toStrictEqual(expectedViolatedRuleKeys)
			})
		},
	)

	describe.each`
		subjectLine                                               | numberOfParents | expectedViolatedRuleKeys
		${"#1 Keep my branch up to date"}                         | ${3}            | ${["no-merge-commits"]}
		${"Merge branch 'main' into bugfix/dance-party-playlist"} | ${2}            | ${["no-merge-commits"]}
	`(
		"a merge commit with a subject line of $subjectLine",
		(testRow: {
			readonly subjectLine: string
			readonly numberOfParents: number
			readonly expectedViolatedRuleKeys: ReadonlyArray<RuleKey>
		}) => {
			const { subjectLine, numberOfParents, expectedViolatedRuleKeys } = testRow

			it(`violates ${formatRuleKeys(expectedViolatedRuleKeys)}`, () => {
				const actualViolatedRuleKeys = validate(
					dummyCommit({ subjectLine, numberOfParents }),
				)
				expect(actualViolatedRuleKeys).toStrictEqual(expectedViolatedRuleKeys)
			})
		},
	)
})

describe("when the configuration overrides 'no-trailing-punctuation-in-subject-lines--whitelist' with . and ,", () => {
	const validate = validateViolatedRulesFrom({
		...dummyDefaultConfiguration,
		noTrailingPunctuationInSubjectLines: {
			whitelist: [".", ","],
		},
	})

	describe.each`
		subjectLine                             | expectedViolatedRuleKeys
		${"Make the program act like a clown."} | ${[]}
		${"Spot a UFO,"}                        | ${[]}
		${"Solve the following issue:"}         | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Throw a tantrum;"}                   | ${["no-trailing-punctuation-in-subject-lines"]}
	`(
		"a commit with a subject line of $subjectLine",
		(testRow: {
			readonly subjectLine: string
			readonly expectedViolatedRuleKeys: ReadonlyArray<RuleKey>
		}) => {
			const { subjectLine, expectedViolatedRuleKeys } = testRow

			it(`violates ${formatRuleKeys(expectedViolatedRuleKeys)}`, () => {
				const actualViolatedRuleKeys = validate(dummyCommit({ subjectLine }))
				expect(actualViolatedRuleKeys).toStrictEqual(expectedViolatedRuleKeys)
			})
		},
	)
})

function validateViolatedRulesFrom(
	configuration: Configuration,
): (commit: RawCommit) => ReadonlyArray<RuleKey> {
	return (commit) =>
		validatorFrom(configuration)([commit], violatedRulesReporter())
}

function formatRuleKeys(ruleKeys: ReadonlyArray<RuleKey>): string {
	return ruleKeys.length === 0
		? "no rules"
		: `${count(ruleKeys, "rule", "rules")}: ${ruleKeys.join(", ")}`
}
