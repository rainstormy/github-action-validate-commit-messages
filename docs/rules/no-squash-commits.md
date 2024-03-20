=== `no-squash-commits`
Squash commits must not be merged into the target branch of the pull request, reminding you to rebase interactively to consolidate the squash commits with the original commit.

Avoiding unnecessary commits will help you preserve the traceability of the commit history.

==== Configuration
|===
|Input Parameter |Description |Default Value

m|+no-squash-commits--disallowed-prefixes+
|A comma-separated, case-sensitive list of subject line prefixes to consider as squash commits.
m|amend!, fixup!, squash!
|===

==== Examples (Default Configuration)
|===
|✅ Accepted |⛔ Rejected

m|Add a new feature
m|amend! Add a new feature

m|Fix a bug
m|fixup! Fix a bug

m|Refactor the code
m|squash! Refactor the code
|===
