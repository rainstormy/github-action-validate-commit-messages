=== `acknowledged-committer-names`
The committer of each commit must use a name that matches one of the regular expressions in the `+acknowledged-committer-names--patterns+` input parameter.

Standardising the committer format will help you preserve the traceability of the commit history and avoid leaking personal information inadvertently.

==== Configuration
|===
|Input Parameter |Description |Default Value

m|+acknowledged-committer-names--patterns+
|A space-separated list of regular expressions of names to accept.
|`+^\b$+` _(a regular expression that never matches anything)_
|===

==== Examples (Multi-Word Names)
A regular expression of `+\p{Lu}.*\s.++` makes the rule accept names that have at least two words where the first one starts with an uppercase letter:

|===
|✅ Accepted |⛔ Rejected

m|The Little Mermaid
m|the little mermaid

m|Santa Claus
m|Santa.claus

m|Jeanne d'Arc
m|Jeanne
|===
