import { describe, expect, it } from "vitest"
import type { RawCommits } from "#rules/Commit"
import { dummyCommit } from "#rules/Commit.dummies"
import type { RuleKeys } from "#rules/Rule"
import { count } from "#utilities/StringUtilities"
import type { Configuration } from "#validator/Configuration"
import {
	dummyDefaultConfiguration,
	dummyGithubStyleIssueReferencesAsPrefixConfiguration,
	dummyNoreplyGithubOrFictiveCompanyEmailAddressesAndTwoWordOrThreeLetterNamesConfiguration,
} from "#validator/Configuration.dummies"
import { violatedRulesReporter } from "#validator/Reporter"
import { validatorFrom } from "#validator/Validator"

describe("when the configuration has default settings", () => {
	const validate = validateViolatedRulesFrom(dummyDefaultConfiguration)

	describe.each`
		subjectLine                                                                 | expectedViolatedRuleKeys
		${"Release the robot butler"}                                               | ${[]}
		${"Fix this confusing plate of spaghetti"}                                  | ${[]}
		${"Refactor the taxi module"}                                               | ${[]}
		${"Unsubscribe from the service"}                                           | ${[]}
		${"Dockerize the application"}                                              | ${[]}
		${"Hunt down the bugs"}                                                     | ${[]}
		${""}                                                                       | ${["multi-word-subject-lines"]}
		${" "}                                                                      | ${["multi-word-subject-lines", "no-unexpected-whitespace"]}
		${"fixup!"}                                                                 | ${["multi-word-subject-lines", "no-squash-commits"]}
		${"test"}                                                                   | ${["capitalised-subject-lines", "multi-word-subject-lines"]}
		${"Formatting."}                                                            | ${["imperative-subject-lines", "multi-word-subject-lines", "no-trailing-punctuation-in-subject-lines"]}
		${"WIP"}                                                                    | ${["imperative-subject-lines", "multi-word-subject-lines"]}
		${"Updated some dependencies"}                                              | ${["imperative-subject-lines"]}
		${"Always use the newest data"}                                             | ${["imperative-subject-lines"]}
		${"never give up!!"}                                                        | ${["capitalised-subject-lines", "imperative-subject-lines", "no-trailing-punctuation-in-subject-lines"]}
		${"Finally..."}                                                             | ${["imperative-subject-lines", "multi-word-subject-lines", "no-trailing-punctuation-in-subject-lines"]}
		${"fixup! Resolve a bug that thought it was a feature"}                     | ${["no-squash-commits"]}
		${"Fixup! Resolve a bug that thought it was a feature"}                     | ${["imperative-subject-lines"]}
		${"fixup!  Added some extra love to the code"}                              | ${["imperative-subject-lines", "no-squash-commits", "no-unexpected-whitespace"]}
		${"fixup! fixup! Fix this confusing plate of spaghetti"}                    | ${["no-squash-commits"]}
		${"amend!Apply strawberry jam to make the code sweeter"}                    | ${["no-squash-commits"]}
		${"Amend!Apply strawberry jam to make the code sweeter"}                    | ${["imperative-subject-lines", "limit-length-of-subject-lines"]}
		${"amend! Solved the problem"}                                              | ${["imperative-subject-lines", "no-squash-commits"]}
		${"squash!Make the formatter happy again :)"}                               | ${["no-squash-commits"]}
		${"Squash!Make the formatter happy again :)"}                               | ${["imperative-subject-lines"]}
		${"squash!   Organise the bookshelf"}                                       | ${["no-squash-commits", "no-unexpected-whitespace"]}
		${"Make the commit scream fixup! again"}                                    | ${[]}
		${"Bugfix"}                                                                 | ${["imperative-subject-lines", "multi-word-subject-lines"]}
		${'Revert "Bugfix"'}                                                        | ${[]}
		${'Revert "Revert "Bugfix""'}                                               | ${["no-revert-revert-commits"]}
		${'Revert "Revert "Revert "Bugfix"""'}                                      | ${["no-revert-revert-commits"]}
		${"release the robot butler"}                                               | ${["capitalised-subject-lines"]}
		${"some refactoring"}                                                       | ${["capitalised-subject-lines", "imperative-subject-lines"]}
		${"fix this confusing plate of spaghetti"}                                  | ${["capitalised-subject-lines"]}
		${"fixup! resolve a bug that thought it was a feature"}                     | ${["capitalised-subject-lines", "no-squash-commits"]}
		${"amend! make the program act like a clown"}                               | ${["capitalised-subject-lines", "no-squash-commits"]}
		${"squash! organise the bookshelf"}                                         | ${["capitalised-subject-lines", "no-squash-commits"]}
		${"Retrieve data from the exclusive third-party service"}                   | ${["limit-length-of-subject-lines"]}
		${'Revert "Retrieve data from the exclusive third-party service"'}          | ${[]}
		${'Revert "Revert "Retrieve data from the exclusive third-party service""'} | ${["no-revert-revert-commits"]}
		${"Compare the list of items to the objects downloaded from the server"}    | ${["limit-length-of-subject-lines"]}
		${"Handle the exceptions thrown by `MalfunctioningOrderService`"}           | ${[]}
		${"Let `SoftIceMachineAdapter` produce the goods that we need"}             | ${[]}
		${"Forget to close the backtick section in `RapidTransportService"}         | ${["limit-length-of-subject-lines"]}
		${"Make the program act like a clown."}                                     | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Spot a UFO,"}                                                            | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Solve the following issue:"}                                             | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Throw a tantrum;"}                                                       | ${["no-trailing-punctuation-in-subject-lines"]}
		${"It works!"}                                                              | ${["imperative-subject-lines", "no-trailing-punctuation-in-subject-lines"]}
		${"Wonder if this will work?"}                                              | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Apply strawberry jam to make the code sweeter-"}                         | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Write the answer ="}                                                     | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Begin the implementation with more to come+"}                            | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Fix a typo: set up*"}                                                    | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Fix a typo: 'setup' ->"}                                                 | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Fix another typo: 'checkout' =>"}                                        | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Short-circuit the loop with &&"}                                         | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Short-circuit the loop with ||"}                                         | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Ignore the parameter with _"}                                            | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Replace Math.pow() with **"}                                             | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Replace block comments with //"}                                         | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Introduce an observable named event$"}                                   | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Finish the job (after the lunch break)"}                                 | ${[]}
		${"Proceed with the job [work in progress]"}                                | ${[]}
		${"Support more delimiters for `rules`"}                                    | ${[]}
		${"Rename the 'strategy'"}                                                  | ${[]}
		${'Enclose the text in "quotes"'}                                           | ${[]}
		${"Quote the «text»"}                                                       | ${[]}
		${"Emphasise even more »well-written prose«"}                               | ${[]}
		${"Finish the job after the lunch break)"}                                  | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Proceed with the job which is a work in progress]"}                      | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Support more delimiters for rules`"}                                     | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Rename the strategy'"}                                                   | ${["no-trailing-punctuation-in-subject-lines"]}
		${'Enclose the text in quotes"'}                                            | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Quote the text»"}                                                        | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Emphasise even more well-written prose«"}                                | ${["no-trailing-punctuation-in-subject-lines"]}
		${"Increase the tax level to 100%"}                                         | ${[]}
		${'Adjust to print margin to 2"'}                                           | ${[]}
		${"Restrict the content to ages 3+"}                                        | ${[]}
		${"Display 120 as the result of 5!"}                                        | ${[]}
		${"Sneak in a funny easter egg :joy:"}                                      | ${[]}
		${"Have fun :slightly_smiling_face:"}                                       | ${[]}
		${"Sneak in a funny easter egg :)"}                                         | ${[]}
		${"Sneak in a funny easter egg :-)"}                                        | ${[]}
		${"Sneak in a funny easter egg =)"}                                         | ${[]}
		${"Sneak in a funny easter egg ^^"}                                         | ${[]}
		${"Sneak in a funny easter egg ^_^"}                                        | ${[]}
		${"Fix your mistakes ;)"}                                                   | ${[]}
		${"Fix your mistakes ;-)"}                                                  | ${[]}
		${"Attempt to fix the bug again :("}                                        | ${[]}
		${"Attempt to fix the bug again :-("}                                       | ${[]}
		${"Attempt to fix the bug again =("}                                        | ${[]}
		${"Make the user interface less chaotic :/"}                                | ${[]}
		${"Make the user interface less chaotic :-/"}                               | ${[]}
		${"Make the user interface less chaotic :\\"}                               | ${[]}
		${"Make the user interface less chaotic :-\\"}                              | ${[]}
		${"Confuse the bug to make it go away :|"}                                  | ${[]}
		${"Confuse the bug to make it go away :-|"}                                 | ${[]}
		${"Threaten the bug with C++"}                                              | ${[]}
		${"Attempt to solve the problem in C#"}                                     | ${[]}
		${"Rewrite the program in F#"}                                              | ${[]}
		${"Prove it in F*"}                                                         | ${[]}
		${"Validate the model in VDM++"}                                            | ${[]}
		${"organise the bookshelf."}                                                | ${["capitalised-subject-lines", "no-trailing-punctuation-in-subject-lines"]}
		${"amend! solve the problem!"}                                              | ${["capitalised-subject-lines", "no-squash-commits", "no-trailing-punctuation-in-subject-lines"]}
	`(
		"a commit with a subject line of $subjectLine",
		(testRow: {
			readonly subjectLine: string
			readonly expectedViolatedRuleKeys: RuleKeys
		}) => {
			const { subjectLine, expectedViolatedRuleKeys } = testRow

			it(`violates ${formatRuleKeys(expectedViolatedRuleKeys)}`, () => {
				const actualViolatedRuleKeys = validate([dummyCommit({ subjectLine })])
				expect(actualViolatedRuleKeys).toStrictEqual(expectedViolatedRuleKeys)
			})
		},
	)

	describe.each`
		subjectLine                                                                                   | body                                                                                                                                                                                                                                                                                                                                                | expectedViolatedRuleKeys
		${" fix it"}                                                                                  | ${""}                                                                                                                                                                                                                                                                                                                                               | ${["capitalised-subject-lines", "no-unexpected-whitespace"]}
		${"Do it over "}                                                                              | ${""}                                                                                                                                                                                                                                                                                                                                               | ${["no-unexpected-whitespace"]}
		${"Make  it work"}                                                                            | ${"\n"}                                                                                                                                                                                                                                                                                                                                             | ${["empty-line-after-subject-lines", "no-unexpected-whitespace"]}
		${"Bring it   on  "}                                                                          | ${"\n\nThe code is prepared for anything."}                                                                                                                                                                                                                                                                                                         | ${["empty-line-after-subject-lines", "no-unexpected-whitespace"]}
		${"Introduce a cool feature"}                                                                 | ${"It is really awesome!"}                                                                                                                                                                                                                                                                                                                          | ${["empty-line-after-subject-lines"]}
		${"Help fix the bug"}                                                                         | ${"\nIt was just a matter of time before it would cause customers to complain. "}                                                                                                                                                                                                                                                                   | ${["limit-length-of-body-lines"]}
		${"Produce the goods"}                                                                        | ${"\nThe `SoftIceMachineAdapter` is totally going to make the customers happy from now on."}                                                                                                                                                                                                                                                        | ${[]}
		${"Transport the goods"}                                                                      | ${"\nThis commit moves the goods from one place to another via the `RapidTransportService`."}                                                                                                                                                                                                                                                       | ${[]}
		${"Forget to close a backtick section"}                                                       | ${"\nThis commit forgets to close the backtick section in `RapidTransportService."}                                                                                                                                                                                                                                                                 | ${["limit-length-of-body-lines"]}
		${"Write unit tests"}                                                                         | ${" Finally..."}                                                                                                                                                                                                                                                                                                                                    | ${["empty-line-after-subject-lines"]}
		${"Resolve the conflicts"}                                                                    | ${"\nConflicts:\n\n src/grumpy-cat.ts\n src/summer-vacation-plans.ts"}                                                                                                                                                                                                                                                                              | ${[]}
		${"Adjust the procedure"}                                                                     | ${"\nIt was totally  wrong until now."}                                                                                                                                                                                                                                                                                                             | ${["no-unexpected-whitespace"]}
		${"Refactor some stuff"}                                                                      | ${" \nThe code looks much better now \nas we finally took the  time to improve it. "}                                                                                                                                                                                                                                                               | ${["empty-line-after-subject-lines", "no-unexpected-whitespace"]}
		${"Release the robot butler"}                                                                 | ${"\n\nIt'll go on a big adventure to meet some unusually interesting characters."}                                                                                                                                                                                                                                                                 | ${["empty-line-after-subject-lines", "limit-length-of-body-lines"]}
		${"Improve the code"}                                                                         | ${"\nSome improvements that we made:\n  - The code is more readable now.\n  - The function is much faster now.\n  - The architecture is much more flexible now."}                                                                                                                                                                                   | ${[]}
		${"Update dependencies"}                                                                      | ${"\nWe discovered some outdated dependencies after running this command:\n\n```shell\nyarn install\n```\n\nThis commit updates some third-party dependencies.\n\n```shell\nyarn update --exact @elements/hydrogen@1.0.0 @elements/nitrogen@2.5.0 @elements/oxygen@2.6.0\n```"}                                                                     | ${[]}
		${"Install necessary dependencies"}                                                           | ${"\nWe discovered some more dependencies after running this command:\n\n```shell\nyarn install\n```\n\nIt turns out that we do in fact need the following dependencies after all. This commit installs them.\n\n```shell\nyarn add @elements/hydrogen@1.0.0 @elements/nitrogen@2.5.0 @elements/oxygen@2.6.0\n```"}                                 | ${["limit-length-of-body-lines"]}
		${"Bump vite from 4.1.1 to 4.3.2"}                                                            | ${"\nBumps [vite](https://github.com/vitejs/vite/tree/HEAD/packages/vite) from 4.1.1 to 4.3.2.\n- [Release notes](https://github.com/vitejs/vite/releases)\n- [Changelog](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)\n- [Commits](https://github.com/vitejs/vite/commits/v4.3.2/packages/vite)"}                          | ${[]}
		${"Bump @typescript-eslint/parser from 5.52.0 to 5.59.1"}                                     | ${"\nBumps [@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint/tree/HEAD/packages/parser) from 5.52.0 to 5.59.1.\n- [Release notes](https://github.com/typescript-eslint/typescript-eslint/releases)\n- [Changelog](https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/parser/CHANGELOG.md)"} | ${[]}
		${"Upgrade dependency @opentelemetry/exporter-metrics-otlp-http to 0.100.5-beta.3"}           | ${""}                                                                                                                                                                                                                                                                                                                                               | ${[]}
		${"Upgrade node:20.18.3-alpine3.20 Docker digest to 4af617c"}                                 | ${""}                                                                                                                                                                                                                                                                                                                                               | ${[]}
		${"Downgrade rainstormy/github-action-validate-commit-messages in GitHub Actions from 1.1.6"} | ${""}                                                                                                                                                                                                                                                                                                                                               | ${[]}
		${"Update src/main.ts"}                                                                       | ${"\nCo-Authored-By: Everloving Easter Bunny <everloving.easter.bunny@example.com>"}                                                                                                                                                                                                                                                                | ${["no-co-authors"]}
		${"Do some pair programming"}                                                                 | ${"\nThis commit is a collab.\nCo-authored-by: Santa Claus <santa.claus@example.com>\nCo-authored-by: Gingerbread Man <gingerbread.man@example.com>\nReported-by: Little Mermaid <little.mermaid@example.com>"}                                                                                                                                     | ${["no-co-authors"]}
	`(
		"a commit with a subject line of $subjectLine and a body of $body",
		(testRow: {
			readonly subjectLine: string
			readonly body: string
			readonly expectedViolatedRuleKeys: RuleKeys
		}) => {
			const { subjectLine, body, expectedViolatedRuleKeys } = testRow

			it(`violates ${formatRuleKeys(expectedViolatedRuleKeys)}`, () => {
				const actualViolatedRuleKeys = validate([
					dummyCommit({ subjectLine, body }),
				])
				expect(actualViolatedRuleKeys).toStrictEqual(expectedViolatedRuleKeys)
			})
		},
	)

	describe.each`
		subjectLine                                               | body                                                                                                                                      | numberOfParents | expectedViolatedRuleKeys
		${"Keep my branch up to date"}                            | ${""}                                                                                                                                     | ${3}            | ${["no-merge-commits"]}
		${"Merge branch 'main' into bugfix/dance-party-playlist"} | ${"\nConflicts:\n\n src/some/very/nested/directory/extremely-grumpy-cat-with-surprising-features.test.ts\n src/summer-vacation-plans.ts"} | ${2}            | ${["no-merge-commits"]}
	`(
		"a merge commit with a subject line of $subjectLine and a body of $body",
		(testRow: {
			readonly subjectLine: string
			readonly body: string
			readonly numberOfParents: number
			readonly expectedViolatedRuleKeys: RuleKeys
		}) => {
			const { subjectLine, body, numberOfParents, expectedViolatedRuleKeys } =
				testRow

			it(`violates ${formatRuleKeys(expectedViolatedRuleKeys)}`, () => {
				const actualViolatedRuleKeys = validate([
					dummyCommit({ subjectLine, body, numberOfParents }),
				])
				expect(actualViolatedRuleKeys).toStrictEqual(expectedViolatedRuleKeys)
			})
		},
	)

	describe.each`
		subjectLines                                                                                                            | numberOfParents | expectedViolatedRuleKeys
		${["Release the robot butler", "Fix this confusing plate of spaghetti", "Refactor the taxi module"]}                    | ${1}            | ${[]}
		${["Release the robot butler", "Unsubscribe from the service", "Refactor the taxi module", "Release the robot butler"]} | ${1}            | ${["unique-subject-lines"]}
		${["Unsubscribe from the service", "Unsubscribe from the service", "Unsubscribe from the service"]}                     | ${1}            | ${["unique-subject-lines"]}
		${["Hunt down the bugs", "fixup! Hunt down the bugs", "fixup! Hunt down the bugs"]}                                     | ${1}            | ${["no-squash-commits"]}
		${["amend! Release the robot butler", "Release the robot butler", "squash! Release the robot butler"]}                  | ${1}            | ${["no-squash-commits"]}
		${['Revert "Release the robot butler"', "Release the robot butler", 'Revert "Release the robot butler"']}               | ${1}            | ${[]}
		${["Keep my branch up to date", "Keep my branch up to date"]}                                                           | ${2}            | ${["no-merge-commits"]}
	`(
		"multiple commits with subject lines of $subjectLines",
		(testRow: {
			readonly subjectLines: ReadonlyArray<string>
			readonly numberOfParents: number
			readonly expectedViolatedRuleKeys: RuleKeys
		}) => {
			const { subjectLines, numberOfParents, expectedViolatedRuleKeys } =
				testRow

			it(`violates ${formatRuleKeys(expectedViolatedRuleKeys)}`, () => {
				const actualViolatedRuleKeys = validate(
					subjectLines.map((subjectLine) =>
						dummyCommit({ subjectLine, numberOfParents }),
					),
				)
				expect(actualViolatedRuleKeys).toStrictEqual(expectedViolatedRuleKeys)
			})
		},
	)
})

describe("when the configuration overrides 'acknowledged-author-email-addresses--patterns' and 'acknowledged-committer-email-addresses--patterns' with GitHub-noreply or fictive company email addresses and 'acknowledged-author-names--patterns' and 'acknowledged-committer-names--patterns' with a two-word or three-letter requirement", () => {
	const validate = validateViolatedRulesFrom(
		dummyNoreplyGithubOrFictiveCompanyEmailAddressesAndTwoWordOrThreeLetterNamesConfiguration,
	)

	describe.each`
		authorName          | authorEmailAddress                                   | committerName       | committerEmailAddress                                | expectedViolatedRuleKeys
		${"Santa Claus"}    | ${"12345678+santaclaus@users.noreply.github.com"}    | ${"Santa Claus"}    | ${"12345678+santaclaus@users.noreply.github.com"}    | ${[]}
		${"scl"}            | ${"scl@fictivecompany.com"}                          | ${"lme"}            | ${"lme@fictivecompany.com"}                          | ${[]}
		${"Little Mermaid"} | ${"87654321+littlemermaid@users.noreply.github.com"} | ${"Little Mermaid"} | ${"87654321+littlemermaid@users.noreply.github.com"} | ${[]}
		${"lme"}            | ${"lme@fictivecompany.com"}                          | ${"scl"}            | ${"scl@fictivecompany.com"}                          | ${[]}
		${"Unicorn"}        | ${"12345678+unicorn@users.noreply.github.com"}       | ${"Santa Claus"}    | ${"12345678+santaclaus@users.noreply.github.com"}    | ${["acknowledged-author-names"]}
		${null}             | ${"12345678+unicorn@users.noreply.github.com"}       | ${"Santa Claus"}    | ${"12345678+santaclaus@users.noreply.github.com"}    | ${["acknowledged-author-names"]}
		${"Santa Claus"}    | ${"claus@santasworkshop.com"}                        | ${"Santa Claus"}    | ${"12345678+santaclaus@users.noreply.github.com"}    | ${["acknowledged-author-email-addresses"]}
		${"Santa Claus"}    | ${null}                                              | ${"Santa Claus"}    | ${"12345678+santaclaus@users.noreply.github.com"}    | ${["acknowledged-author-email-addresses"]}
		${"Easter-Bunny"}   | ${"bunny@theeastercompany.com"}                      | ${"Santa Claus"}    | ${"12345678+santaclaus@users.noreply.github.com"}    | ${["acknowledged-author-email-addresses", "acknowledged-author-names"]}
		${"Santa Claus"}    | ${"12345678+santaclaus@users.noreply.github.com"}    | ${"Unicorn"}        | ${"12345678+unicorn@users.noreply.github.com"}       | ${["acknowledged-committer-names"]}
		${"Santa Claus"}    | ${"12345678+santaclaus@users.noreply.github.com"}    | ${null}             | ${"12345678+unicorn@users.noreply.github.com"}       | ${["acknowledged-committer-names"]}
		${"Santa Claus"}    | ${"12345678+santaclaus@users.noreply.github.com"}    | ${"Santa Claus"}    | ${"claus@santasworkshop.com"}                        | ${["acknowledged-committer-email-addresses"]}
		${"Santa Claus"}    | ${"12345678+santaclaus@users.noreply.github.com"}    | ${"Santa Claus"}    | ${null}                                              | ${["acknowledged-committer-email-addresses"]}
		${"Santa Claus"}    | ${"12345678+santaclaus@users.noreply.github.com"}    | ${"Easter-Bunny"}   | ${"bunny@theeastercompany.com"}                      | ${["acknowledged-committer-email-addresses", "acknowledged-committer-names"]}
		${"Santa Claus"}    | ${"claus@santasworkshop.com"}                        | ${"GitHub"}         | ${"noreply@github.com"}                              | ${["acknowledged-author-email-addresses", "acknowledged-committer-email-addresses", "acknowledged-committer-names"]}
		${null}             | ${null}                                              | ${null}             | ${null}                                              | ${["acknowledged-author-email-addresses", "acknowledged-author-names", "acknowledged-committer-email-addresses", "acknowledged-committer-names"]}
	`(
		"a commit with an author with a name of $authorName and an email address of $authorEmailAddress and a committer with a name of $committerName and an email address of $committerEmailAddress",
		(testRow: {
			readonly authorName: string | null
			readonly authorEmailAddress: string | null
			readonly committerName: string | null
			readonly committerEmailAddress: string | null
			readonly expectedViolatedRuleKeys: RuleKeys
		}) => {
			const {
				authorName,
				authorEmailAddress,
				committerName,
				committerEmailAddress,
				expectedViolatedRuleKeys,
			} = testRow

			it(`violates ${formatRuleKeys(expectedViolatedRuleKeys)}`, () => {
				const actualViolatedRuleKeys = validate([
					dummyCommit({
						subjectLine: "Craft something amazing for us",
						author: {
							name: authorName,
							emailAddress: authorEmailAddress,
						},
						committer: {
							name: committerName,
							emailAddress: committerEmailAddress,
						},
					}),
				])
				expect(actualViolatedRuleKeys).toStrictEqual(expectedViolatedRuleKeys)
			})
		},
	)
})

describe("when the configuration overrides 'imperative-subject-lines--whitelist' with 'chatify'", () => {
	const validate = validateViolatedRulesFrom({
		...dummyDefaultConfiguration,
		imperativeSubjectLines: {
			whitelist: ["chatify"],
		},
	})

	describe.each`
		subjectLine               | expectedViolatedRuleKeys
		${"Chatify the module"}   | ${[]}
		${"Deckenize the module"} | ${["imperative-subject-lines"]}
		${"chatify the module"}   | ${["capitalised-subject-lines"]}
		${"deckenize the module"} | ${["capitalised-subject-lines", "imperative-subject-lines"]}
	`(
		"a commit with a subject line of $subjectLine",
		(testRow: {
			readonly subjectLine: string
			readonly expectedViolatedRuleKeys: RuleKeys
		}) => {
			const { subjectLine, expectedViolatedRuleKeys } = testRow

			it(`violates ${formatRuleKeys(expectedViolatedRuleKeys)}`, () => {
				const actualViolatedRuleKeys = validate([dummyCommit({ subjectLine })])
				expect(actualViolatedRuleKeys).toStrictEqual(expectedViolatedRuleKeys)
			})
		},
	)
})

describe("when the configuration overrides 'imperative-subject-lines--whitelist' with 'Chatify' (capitalised)", () => {
	const validate = validateViolatedRulesFrom({
		...dummyDefaultConfiguration,
		imperativeSubjectLines: {
			whitelist: ["Chatify"],
		},
	})

	describe.each`
		subjectLine               | expectedViolatedRuleKeys
		${"Chatify the module"}   | ${[]}
		${"Deckenize the module"} | ${["imperative-subject-lines"]}
		${"chatify the module"}   | ${["capitalised-subject-lines"]}
		${"deckenize the module"} | ${["capitalised-subject-lines", "imperative-subject-lines"]}
	`(
		"a commit with a subject line of $subjectLine",
		(testRow: {
			readonly subjectLine: string
			readonly expectedViolatedRuleKeys: RuleKeys
		}) => {
			const { subjectLine, expectedViolatedRuleKeys } = testRow

			it(`violates ${formatRuleKeys(expectedViolatedRuleKeys)}`, () => {
				const actualViolatedRuleKeys = validate([dummyCommit({ subjectLine })])
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
			readonly expectedViolatedRuleKeys: RuleKeys
		}) => {
			const { subjectLine, expectedViolatedRuleKeys } = testRow

			it(`violates ${formatRuleKeys(expectedViolatedRuleKeys)}`, () => {
				const actualViolatedRuleKeys = validate([dummyCommit({ subjectLine })])
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
			readonly expectedViolatedRuleKeys: RuleKeys
		}) => {
			const { subjectLine, numberOfParents, expectedViolatedRuleKeys } = testRow

			it(`violates ${formatRuleKeys(expectedViolatedRuleKeys)}`, () => {
				const actualViolatedRuleKeys = validate([
					dummyCommit({ subjectLine, numberOfParents }),
				])
				expect(actualViolatedRuleKeys).toStrictEqual(expectedViolatedRuleKeys)
			})
		},
	)

	describe.each`
		subjectLines                                                                  | expectedViolatedRuleKeys
		${["#1 Make the formatter happy again", "#2 Make the formatter happy again"]} | ${[]}
		${["#1 Make the formatter happy again", "#1 Make the formatter happy again"]} | ${["unique-subject-lines"]}
	`(
		"multiple commits with subject lines of $subjectLines",
		(testRow: {
			readonly subjectLines: ReadonlyArray<string>
			readonly expectedViolatedRuleKeys: RuleKeys
		}) => {
			const { subjectLines, expectedViolatedRuleKeys } = testRow

			it(`violates ${formatRuleKeys(expectedViolatedRuleKeys)}`, () => {
				const actualViolatedRuleKeys = validate(
					subjectLines.map((subjectLine) => dummyCommit({ subjectLine })),
				)
				expect(actualViolatedRuleKeys).toStrictEqual(expectedViolatedRuleKeys)
			})
		},
	)
})

describe("when the configuration overrides 'limit-length-of-body-lines--max-characters' with 32", () => {
	const validate = validateViolatedRulesFrom({
		...dummyDefaultConfiguration,
		limitLengthOfBodyLines: {
			maximumCharacters: 32,
		},
	})

	describe.each`
		subjectLine                    | body                                                                                                                                                                                                                                                                                                             | expectedViolatedRuleKeys
		${"Introduce a cool feature"}  | ${"\nIt is really awesome!"}                                                                                                                                                                                                                                                                                     | ${[]}
		${"Help fix the annoying bug"} | ${"\nIt was really just a matter of time."}                                                                                                                                                                                                                                                                      | ${["limit-length-of-body-lines"]}
		${"Write unit tests"}          | ${"\nIt was about time that we did this."}                                                                                                                                                                                                                                                                       | ${["limit-length-of-body-lines"]}
		${"Update dependencies"}       | ${"\nWe discovered some outdated\ndependencies after running this\ncommand:\n\n```shell\nyarn update --exact @elements/*\nyarn update --recursive @elements/*\n```\n\nThis commit updates them.\n\n```shell\nyarn update --exact @elements/hydrogen@1.0.0 @elements/nitrogen@2.5.0 @elements/oxygen@2.6.0\n```"} | ${[]}
	`(
		"a commit with a subject line of $subjectLine and a body of $body",
		(testRow: {
			readonly subjectLine: string
			readonly body: string
			readonly expectedViolatedRuleKeys: RuleKeys
		}) => {
			const { subjectLine, body, expectedViolatedRuleKeys } = testRow

			it(`violates ${formatRuleKeys(expectedViolatedRuleKeys)}`, () => {
				const actualViolatedRuleKeys = validate([
					dummyCommit({ subjectLine, body }),
				])
				expect(actualViolatedRuleKeys).toStrictEqual(expectedViolatedRuleKeys)
			})
		},
	)
})

describe("when the configuration overrides 'limit-length-of-subject-lines--max-characters' with 20", () => {
	const validate = validateViolatedRulesFrom({
		...dummyDefaultConfiguration,
		limitLengthOfSubjectLines: {
			maximumCharacters: 20,
		},
	})

	describe.each`
		subjectLine                    | body                                                                                                                                                                                                                                                                                                             | expectedViolatedRuleKeys
		${"Introduce a cool feature"}  | ${"\nIt is really awesome!"}                                                                                                                                                                                                                                                                                     | ${["limit-length-of-subject-lines"]}
		${"Help fix the annoying bug"} | ${"\nIt was really just a matter of time."}                                                                                                                                                                                                                                                                      | ${["limit-length-of-subject-lines"]}
		${"Write unit tests"}          | ${"\nIt was about time that we did this."}                                                                                                                                                                                                                                                                       | ${[]}
		${"Update dependencies"}       | ${"\nWe discovered some outdated\ndependencies after running this\ncommand:\n\n```shell\nyarn update --exact @elements/*\nyarn update --recursive @elements/*\n```\n\nThis commit updates them.\n\n```shell\nyarn update --exact @elements/hydrogen@1.0.0 @elements/nitrogen@2.5.0 @elements/oxygen@2.6.0\n```"} | ${[]}
	`(
		"a commit with a subject line of $subjectLine and a body of $body",
		(testRow: {
			readonly subjectLine: string
			readonly body: string
			readonly expectedViolatedRuleKeys: RuleKeys
		}) => {
			const { subjectLine, body, expectedViolatedRuleKeys } = testRow

			it(`violates ${formatRuleKeys(expectedViolatedRuleKeys)}`, () => {
				const actualViolatedRuleKeys = validate([
					dummyCommit({ subjectLine, body }),
				])
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
			readonly expectedViolatedRuleKeys: RuleKeys
		}) => {
			const { subjectLine, expectedViolatedRuleKeys } = testRow

			it(`violates ${formatRuleKeys(expectedViolatedRuleKeys)}`, () => {
				const actualViolatedRuleKeys = validate([dummyCommit({ subjectLine })])
				expect(actualViolatedRuleKeys).toStrictEqual(expectedViolatedRuleKeys)
			})
		},
	)
})

function validateViolatedRulesFrom(
	configuration: Configuration,
): (rawCommits: RawCommits) => RuleKeys {
	return (rawCommits): RuleKeys =>
		validatorFrom(configuration)(rawCommits, violatedRulesReporter())
}

function formatRuleKeys(ruleKeys: RuleKeys): string {
	return ruleKeys.length === 0
		? "no rules"
		: `${count(ruleKeys, "rule", "rules")}: ${ruleKeys.join(", ")}`
}
