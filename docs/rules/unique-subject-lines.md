# `unique-subject-lines`

Commits that repeat the subject line of a previous commit in the pull request
are probably meant to be squash commits that should be consolidated with the
original commit.

Avoiding unnecessary commits will help you preserve the traceability of the
commit history.

Exceptions to this rule include merge commits, revert commits, and proper squash
commits (as configured by `no-squash-commits--disallowed-prefixes`).

### Examples
#### ✅ Accepted
Unique subject lines in the commit set:
1. > Write unit tests
2. > Refactor the code

Squash commits with repeating subject lines:
1. > Refactor the code
2. > squash! Refactor the code
3. > squash! Refactor the code

#### ❌ Rejected
Repeated subject lines:
1. > Refactor the code
2. > Refactor the code

Non-unique subject lines in the commit set:
1. > Write unit tests
2. > Implement the feature
3. > Write unit tests
