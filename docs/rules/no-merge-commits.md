# `no-merge-commits`

Merge commits must not be merged into the target branch of the pull request,
reminding you to rebase your branch onto the target branch instead of merging
the target branch into your branch.

Avoiding merge commits will help you preserve the traceability of the commit
history as well as the ability to rebase interactively.

The rule considers a commit to be a merge commit when it has more than one
parent commit.

### Examples
⇧ denotes the number of parent commits.

#### ✅ Accepted
> ⇧ 1  
> Merge branch 'main' into feature/dance-party

> ⇧ 1  
> Merge the two websites

#### ❌ Rejected
> ⇧ 2  
> Merge branch 'main' into feature/dance-party

> ⇧ 3  
> Keep the branch up-to-date
