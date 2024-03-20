# `issue-references-in-subject-lines`

The subject line must contain at least one reference to an issue tracking system
that matches one of the regular expressions in
the `issue-references-in-subject-lines--patterns` input parameter.

Providing more context in the commit message (such as an issue reference) will
help you preserve the traceability of the commit history.

Exceptions to this rule include merge commits and revert commits.

### Configuration
#### `issue-references-in-subject-lines--allowed-positions`
A comma-separated list of positions in the subject line where the issue
reference is allowed to appear.

- `as-prefix` allows issue references to appear at the start of the subject
  line.
- `as-suffix` allows issue references to appear at the end of the subject line.

#### `issue-references-in-subject-lines--patterns`
A space-separated list of regular expressions of issue references to recognise.

The declaration order matters, as it resolves the issue references in the order
they are listed. Please take care not to shadow a specific regular expression
with a more general one declared earlier in the list.

### Default configuration
```yaml
issue-references-in-subject-lines--allowed-positions: as-prefix, as-suffix
issue-references-in-subject-lines--patterns: '^\b$' # A regular expression that never matches anything.
```

### Examples (GitHub/GitHub)
```yaml
issue-references-in-subject-lines--allowed-positions: as-suffix
issue-references-in-subject-lines--patterns: '\(#[1-9][0-9]*\) #[1-9][0-9]*'
```

When `as-suffix` is the only allowed position, these two regular expressions
make the rule recognise GitHub/GitLab-style issue references in the form of
`#123` at the end of the subject line, potentially enclosed by parentheses:

#### ✅ Accepted
> Introduce a cool feature #123

> Write unit tests (#42)

> Fix the bug #1 #2

#### ❌ Rejected
> Introduce a cool feature

> (#42) Write unit tests

> Close #1 and #2 by fixing the bug

### Examples (Jira/YouTrack)
```yaml
issue-references-in-subject-lines--allowed-positions: 'as-prefix, as-suffix'
issue-references-in-subject-lines--patterns: '\(UNICORN-[1-9][0-9]*\) UNICORN-[1-9][0-9]*'
```

When `as-prefix, as-suffix` are the allowed positions, these two regular
expressions make the rule recognise Jira/YouTrack-style issue references in the
form of `UNICORN-123` at the start or the end of the subject line, potentially
enclosed by parentheses:

#### ✅ Accepted
> UNICORN-123 Introduce a cool feature

> Write unit tests (UNICORN-42)

> fixup! UNICORN-1 UNICORN-2 Fix the bug

#### ❌ Rejected
> Introduce a cool feature #123

> Write unit tests (UNICORN-042)

> Close UNICORN-1 and UNICORN-2 by fixing the bug
