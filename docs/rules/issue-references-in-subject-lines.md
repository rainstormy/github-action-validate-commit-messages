=== `issue-references-in-subject-lines`
The subject line of each commit must contain at least one reference to an issue tracking system that matches one of the regular expressions in the `+issue-references-in-subject-lines--patterns+` input parameter.
Exceptions to this rule include merge commits and revert commits.

Providing more context in the commit message (such as an issue reference) will help you preserve the traceability of the commit history.

==== Configuration
|===
|Input Parameter |Description |Default Value

m|+issue-references-in-subject-lines--allowed-positions+
|A comma-separated list of positions in the subject line where the issue reference is allowed to appear.

`as-prefix` allows issue references to appear at the start of the subject line.

`as-suffix` allows issue references to appear at the end of the subject line.
|`as-prefix, as-suffix`

m|+issue-references-in-subject-lines--patterns+
|A space-separated list of regular expressions of issue references to recognise.

The declaration order matters, as it resolves the issue references in the order they are listed.
Please take care not to shadow a specific regular expression with a more general one declared earlier in the list.
|`+^\b$+` _(a regular expression that never matches anything)_
|===

==== Examples (GitHub/GitLab)
When `as-suffix` is the only allowed position, a list of regular expressions of `+\(#[1-9][0-9]*\) #[1-9][0-9]*+` makes the rule recognise GitHub/GitLab-style issue references in the form of `#123` at the end of the subject line, potentially enclosed by parentheses:

|===
|✅ Accepted |⛔ Rejected

m|Introduce a cool feature #123
m|Introduce a cool feature

m|Write unit tests (#42)
m|(#42) Write unit tests

m|Fix the bug #1 #2
m|Close #1 and #2 by fixing the bug
|===

==== Examples (Jira/YouTrack)
When `as-prefix, as-suffix` are the allowed positions, a list of regular expressions of `+\(UNICORN-[1-9][0-9]*\) UNICORN-[1-9][0-9]*+` makes the rule recognise Jira/YouTrack-style issue references in the form of `UNICORN-123` at the start or the end of the subject line, potentially enclosed by parentheses:

|===
|✅ Accepted |⛔ Rejected

m|UNICORN-123 Introduce a cool feature
m|Introduce a cool feature #123

m|Write unit tests (UNICORN-42)
m|Write unit tests (UNICORN-042)

m|fixup! UNICORN-1 UNICORN-2 Fix the bug
m|Close UNICORN-1 and UNICORN-2 by fixing the bug
|===
