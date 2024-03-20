=== `unique-subject-lines`
Commits that repeat the subject line of a previous commit in the pull request are probably meant to be squash commits that should be consolidated with the original commit.
Exceptions to this rule include merge commits, revert commits, and proper squash commits (as configured by `+no-squash-commits--disallowed-prefixes+`).

Avoiding unnecessary commits will help you preserve the traceability of the commit history.

==== Examples
|===
|✅ Accepted |⛔ Rejected

a|
* `Write unit tests`
* `Refactor the code`
  a|
* `Refactor the code`
* `Refactor the code`

a|
* `Refactor the code`
* `squash! Refactor the code`
* `squash! Refactor the code`
  a|
* `Write unit tests`
* `Implement the feature`
* `Write unit tests`
  |===
