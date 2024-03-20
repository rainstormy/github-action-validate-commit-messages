=== `acknowledged-committer-email-addresses`
The committer of each commit must use an email address that matches one of the regular expressions in the `+acknowledged-committer-email-addresses--patterns+` input parameter.

By disallowing `noreply@github.com` as a committer email address, you can catch commits made through the GitHub web interface such as code review suggestions.

Standardising the committer format will help you preserve the traceability of the commit history and avoid leaking personal information (e.g. a private email address) inadvertently.

==== Configuration
|===
|Input Parameter |Description |Default Value

m|+acknowledged-committer-email-addresses--patterns+
|A space-separated list of regular expressions of email addresses to accept.
|`+^\b$+` _(a regular expression that never matches anything)_
|===

==== Examples (GitHub Noreply)
A regular expression of `+\d+\+.+@users\.noreply\.github\.com+` makes the rule accept personal noreply email addresses on GitHub:

|===
|✅ Accepted |⛔ Rejected

m|+19891117+littlemermaid@users.noreply.github.com+
m|+little.mermaid@theocean.com+

m|+18920129+santaclaus@users.noreply.github.com+
m|+claus@santasworkshop.com+

m|+12345678+username@users.noreply.github.com+
m|+noreply@github.com+
|===
