=== `no-trailing-punctuation-in-subject-lines`
The subject line of each commit must not end with a punctuation character.
Exceptions to this rule include closing parentheses with matching opening parentheses, symbols associated with numbers, emoticons, emoji shortcodes, and characters specified in the `+no-trailing-punctuation-in-subject-lines--whitelist+` input parameter.

Standardising the commit message format will help you preserve the readability of the commit history.

==== Configuration
|===
|Input Parameter |Description |Default Value

m|+no-trailing-punctuation-in-subject-lines--whitelist+
|A space-separated list of punctuation characters to ignore.

For example, a whitelist of `. !` makes the rule accept subject lines with a trailing period or a trailing exclamation mark.
|_(empty)_
|===

==== Examples (Default Configuration)
|===
|✅ Accepted |⛔ Rejected

m|Add a new feature
m|Add a new feature.

m|Fix a bug
m|Fix a bug!

m|Refactor the code (the main module)
m|Refactor the code (

m|Update dependencies :-)
m|Update dependencies )

m|Write documentation :smile:
m|Write documentation:

m|Improve performance by 42%
m|Improve performance by x%
|===
