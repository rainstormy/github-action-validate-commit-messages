# `no-squash-commits`

Squash commits must not be merged into the target branch of the pull request,
reminding you to rebase interactively to consolidate the squash commits with the
original commit.

Avoiding unnecessary commits will help you preserve the traceability of the
commit history.

### Configuration
#### `no-squash-commits--disallowed-prefixes`
A comma-separated, case-sensitive list of subject line prefixes to consider as
squash commits.

### Default configuration
```yaml
no-squash-commits--disallowed-prefixes: amend!, fixup!, squash!
```

### Examples
#### ✅ Accepted
> Add a new feature

> Fix a bug

> Refactor the code

#### ❌ Rejected
> amend! Add a new feature

> fixup! Fix a bug

> squash! Refactor the code
