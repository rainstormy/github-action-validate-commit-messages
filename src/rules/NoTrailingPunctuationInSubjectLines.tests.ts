import type { Commit } from "+core"
import { dummyCommits } from "+core/dummies"
import { noTrailingPunctuationInSubjectLines } from "+rules"
import { dummyConfiguration } from "+validation/dummies"

const {
	commitsWithTrailingEmojiShortcodeInSubjectLines,
	commitsWithTrailingEmoticonsInSubjectLines,
	commitsWithTrailingMatchedClosingPunctuationInSubjectLines,
	commitsWithTrailingNumericPunctuationInSubjectLines,
	commitsWithTrailingProgrammingLanguageNameInSubjectLines,
	commitsWithTrailingPunctuationInSubjectLines,
	commitsWithTrailingUnmatchedClosingPunctuationInSubjectLines,
	regularCommits,
} = dummyCommits

describe("a validation rule that rejects trailing punctuation in subject lines", () => {
	const rule = noTrailingPunctuationInSubjectLines(dummyConfiguration)

	it.each<Commit>(commitsWithTrailingPunctuationInSubjectLines)(
		"rejects a commit with a subject line of '%s' that ends with a punctuation mark",
		(subjectLine) => {
			expect(rule.validate(subjectLine)).toBe("invalid")
		},
	)

	it.each<Commit>(regularCommits)(
		"accepts a commit with a subject line of '%s' that does not end with a punctuation mark",
		(subjectLine) => {
			expect(rule.validate(subjectLine)).toBe("valid")
		},
	)

	it.each<Commit>(commitsWithTrailingMatchedClosingPunctuationInSubjectLines)(
		"accepts a commit with a subject line of '%s' that ends with a matched closing punctuation mark",
		(subjectLine) => {
			expect(rule.validate(subjectLine)).toBe("valid")
		},
	)

	it.each<Commit>(commitsWithTrailingUnmatchedClosingPunctuationInSubjectLines)(
		"rejects a commit with a subject line of '%s' that ends with an unmatched closing punctuation mark",
		(subjectLine) => {
			expect(rule.validate(subjectLine)).toBe("invalid")
		},
	)

	it.each<Commit>(commitsWithTrailingNumericPunctuationInSubjectLines)(
		"accepts a commit with a subject line of '%s' that ends with a number-related punctuation mark",
		(subjectLine) => {
			expect(rule.validate(subjectLine)).toBe("valid")
		},
	)

	it.each<Commit>(commitsWithTrailingEmojiShortcodeInSubjectLines)(
		"accepts a commit with a subject line of '%s' that ends with an emoji shortcode",
		(subjectLine) => {
			expect(rule.validate(subjectLine)).toBe("valid")
		},
	)

	it.each<Commit>(commitsWithTrailingEmoticonsInSubjectLines)(
		"accepts a commit with a subject line of '%s' that ends with an emoticon",
		(subjectLine) => {
			expect(rule.validate(subjectLine)).toBe("valid")
		},
	)

	it.each<Commit>(commitsWithTrailingProgrammingLanguageNameInSubjectLines)(
		"accepts a commit with a subject line of '%s' that ends with a programming language name",
		(subjectLine) => {
			expect(rule.validate(subjectLine)).toBe("valid")
		},
	)
})

describe("a validation rule that rejects trailing punctuation in subject lines with a set of whitelisted suffixes", () => {
	const rule = noTrailingPunctuationInSubjectLines({
		...dummyConfiguration,
		suffixWhitelist: [
			".",
			",",
			":",
			";",
			"!",
			"?",
			"-",
			"=",
			"+",
			"*",
			"->",
			"=>",
			"&&",
			"||",
			"_",
			"//",
			"$",
		],
	})

	it.each<Commit>(commitsWithTrailingPunctuationInSubjectLines)(
		"accepts a commit with a subject line of '%s' that ends with a whitelisted suffix",
		(subjectLine) => {
			expect(rule.validate(subjectLine)).toBe("valid")
		},
	)
})
