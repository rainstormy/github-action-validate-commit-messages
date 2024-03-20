=== `no-merge-commits`
Merge commits must not be merged into the target branch of the pull request, reminding you to rebase your branch onto the target branch instead of merging the target branch into your branch.

Avoiding merge commits will help you preserve the traceability of the commit history as well as the ability to rebase interactively.

==== Examples
The rule considers a commit to be a merge commit when it has more than one parent commit:

|===
|✅ Accepted |⛔ Rejected

|`Merge branch 'main' into feature/dance-party` +
_(one parent commit)_
|`Merge branch 'main' into feature/dance-party` +
_(two parent commits)_

|`Keep the branch up-to-date` +
_(one parent commit)_
|`Keep the branch up-to-date` +
_(three parent commits)_
|===
