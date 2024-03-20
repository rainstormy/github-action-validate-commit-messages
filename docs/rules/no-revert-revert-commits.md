# `no-revert-revert-commits`

Commits that revert other revert commits must not be merged into the target
branch of the pull request, reminding you to re-apply the original commits
instead of reverting the revert commits.

Providing more context (such as the original commit message) and avoiding
unnecessary commits will help you preserve the traceability of the commit
history.

### Examples
#### ✅ Accepted
> Revert "Fix the bug"

> Revert the revert commit

#### ❌ Rejected
> Revert "Revert "Fix the bug""

> Revert "Revert "Revert "Fix the bug"""
