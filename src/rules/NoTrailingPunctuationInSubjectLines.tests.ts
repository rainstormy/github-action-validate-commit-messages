import { dummyCommitFactory } from "+core/dummies"
import { noTrailingPunctuationInSubjectLines } from "+rules"
import { dummyConfiguration } from "+validation/dummies"

const { commitOf } = dummyCommitFactory()

describe("a validation rule that rejects trailing punctuation in subject lines", () => {
	const rule = noTrailingPunctuationInSubjectLines(dummyConfiguration)

	it.each`
		subjectLine
		${"Make the program act like a clown."}
		${"Spot a UFO,"}
		${"Solve the following issue:"}
		${"Throw a tantrum;"}
		${"Make it work!"}
		${"Wonder if this will work?"}
		${"Apply strawberry jam to make the code sweeter-"}
		${"Write the answer ="}
		${"Begin the implementation with more to come+"}
		${"Fix a typo: set up*"}
		${"Fix a typo: 'setup' ->"}
		${"Fix another typo: 'checkout' =>"}
		${"Short-circuit the loop with &&"}
		${"Short-circuit the loop with ||"}
		${"Ignore the parameter with _"}
		${"Replace Math.pow() with **"}
		${"Replace block comments with //"}
		${"Introduce an observable named event$"}
	`(
		"rejects a commit with a subject line of $subjectLine that ends with a punctuation mark",
		(testRow: { readonly subjectLine: string }) => {
			const { subjectLine } = testRow

			const commit = commitOf(subjectLine)
			expect(rule.validate(commit)).toBe("invalid")
		},
	)

	it.each`
		subjectLine
		${"Release the robot butler"}
		${"Fix this confusing plate of spaghetti"}
	`(
		"accepts a commit with a subject line of $subjectLine that does not end with a punctuation mark",
		(testRow: { readonly subjectLine: string }) => {
			const { subjectLine } = testRow

			const commit = commitOf(subjectLine)
			expect(rule.validate(commit)).toBe("valid")
		},
	)

	it.each`
		subjectLine
		${"Finish the job (after the lunch break)"}
		${"Proceed with the job [work in progress]"}
		${"Support more delimiters for `rules`"}
		${"Rename the 'strategy'"}
		${'Enclose the text in "quotes"'}
		${"Quote the «text»"}
		${"Emphasise even more »well-written prose«"}
	`(
		"accepts a commit with a subject line of $subjectLine that ends with a matched closing punctuation mark",
		(testRow: { readonly subjectLine: string }) => {
			const { subjectLine } = testRow

			const commit = commitOf(subjectLine)
			expect(rule.validate(commit)).toBe("valid")
		},
	)

	it.each`
		subjectLine
		${"Finish the job after the lunch break)"}
		${"Proceed with the job which is a work in progress]"}
		${"Support more delimiters for rules`"}
		${"Rename the strategy'"}
		${'Enclose the text in quotes"'}
		${"Quote the text»"}
		${"Emphasise even more well-written prose«"}
	`(
		"rejects a commit with a subject line of $subjectLine that ends with an unmatched closing punctuation mark",
		(testRow: { readonly subjectLine: string }) => {
			const { subjectLine } = testRow

			const commit = commitOf(subjectLine)
			expect(rule.validate(commit)).toBe("invalid")
		},
	)

	it.each`
		subjectLine
		${"Increase the tax level to 100%"}
		${'Adjust to print margin to 2"'}
		${"Restrict the content to ages 3+"}
		${"Display 120 as the result of 5!"}
	`(
		"accepts a commit with a subject line of $subjectLine that ends with a number-related punctuation mark",
		(testRow: { readonly subjectLine: string }) => {
			const { subjectLine } = testRow

			const commit = commitOf(subjectLine)
			expect(rule.validate(commit)).toBe("valid")
		},
	)

	it.each`
		subjectLine
		${"Sneak in a funny easter egg :joy:"}
		${"Have fun :slightly_smiling_face:"}
	`(
		"accepts a commit with a subject line of $subjectLine that ends with an emoji shortcode",
		(testRow: { readonly subjectLine: string }) => {
			const { subjectLine } = testRow

			const commit = commitOf(subjectLine)
			expect(rule.validate(commit)).toBe("valid")
		},
	)

	it.each`
		subjectLine
		${"Sneak in a funny easter egg :)"}
		${"Sneak in a funny easter egg :-)"}
		${"Sneak in a funny easter egg =)"}
		${"Sneak in a funny easter egg ^^"}
		${"Sneak in a funny easter egg ^_^"}
		${"Fix your mistakes ;)"}
		${"Fix your mistakes ;-)"}
		${"Attempt to fix the bug again :("}
		${"Attempt to fix the bug again :-("}
		${"Attempt to fix the bug again =("}
		${"Make the user interface less chaotic :/"}
		${"Make the user interface less chaotic :-/"}
		${"Make the user interface less chaotic :\\"}
		${"Make the user interface less chaotic :-\\"}
		${"Confuse the bug to make it go away :|"}
		${"Confuse the bug to make it go away :-|"}
	`(
		"accepts a commit with a subject line of $subjectLine that ends with an emoticon",
		(testRow: { readonly subjectLine: string }) => {
			const { subjectLine } = testRow

			const commit = commitOf(subjectLine)
			expect(rule.validate(commit)).toBe("valid")
		},
	)

	it.each`
		subjectLine
		${"Threaten the bug with C++"}
		${"Attempt to solve the problem in C#"}
		${"Rewrite the program in F#"}
		${"Prove it in F*"}
		${"Validate the model in VDM++"}
	`(
		"accepts a commit with a subject line of $subjectLine that ends with a programming language name",
		(testRow: { readonly subjectLine: string }) => {
			const { subjectLine } = testRow

			const commit = commitOf(subjectLine)
			expect(rule.validate(commit)).toBe("valid")
		},
	)
})

describe("a validation rule that rejects trailing punctuation in subject lines with a set of whitelisted suffixes", () => {
	const rule = noTrailingPunctuationInSubjectLines({
		...dummyConfiguration,
		suffixWhitelist: [".", ","],
	})

	it.each`
		subjectLine
		${"Make the program act like a clown."}
		${"Spot a UFO,"}
	`(
		"accepts a commit with a subject line of $subjectLine that ends with a whitelisted suffix",
		(testRow: { readonly subjectLine: string }) => {
			const { subjectLine } = testRow

			const commit = commitOf(subjectLine)
			expect(rule.validate(commit)).toBe("valid")
		},
	)

	it.each`
		subjectLine
		${"Solve the following issue:"}
		${"Throw a tantrum;"}
	`(
		"rejects a commit with a subject line of $subjectLine that ends with a non-whitelisted punctuation mark",
		(testRow: { readonly subjectLine: string }) => {
			const { subjectLine } = testRow

			const commit = commitOf(subjectLine)
			expect(rule.validate(commit)).toBe("invalid")
		},
	)
})
