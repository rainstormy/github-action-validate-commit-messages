=== `imperative-subject-lines`
The subject line of each commit must start with a verb in the imperative mood so that it reads like an instruction.

Standardising the commit message format will help you preserve the readability of the commit history.

==== Configuration
|===
|Input Parameter |Description |Default Value

|`+imperative-subject-lines--whitelist+`
|A comma-separated, case-insensitive list of additional words to accept.

For example, a whitelist of `chatify, deckenize` makes the rule accept subject lines that start with one of the fictive words 'chatify' or 'deckenize', in addition to subject lines that start with one of the 4,000+ verbs which are baked into the rule.
|_(empty)_
|===

==== Examples (Default Configuration)
|===
|✅ Accepted |⛔ Rejected

m|Add a new feature
m|Added a new feature

m|Format the code
m|Formatting

m|Make it work
m|It works

m|Do the validation every time
m|Always validate
|===
