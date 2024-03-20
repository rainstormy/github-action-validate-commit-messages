=== `no-revert-revert-commits`
Commits that revert other revert commits must not be merged into the target branch of the pull request, reminding you to re-apply the original commits instead of reverting the revert commits.

Providing more context (such as the original commit message) and avoiding unnecessary commits will help you preserve the traceability of the commit history.

==== Examples
|===
|✅ Accepted |⛔ Rejected

m|Revert "Fix the bug"
m|Revert "Revert "Fix the bug""

m|Revert the revert commit
m|Revert "Revert "Revert "Fix the bug"""
|===
