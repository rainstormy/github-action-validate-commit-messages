# `no-trailing-punctuation-in-subject-lines`

The subject line must not end with a punctuation character.

Standardising the commit message format will help you preserve the readability
of the commit history.

Exceptions to this rule include closing parentheses with matching opening
parentheses, symbols associated with numbers, emoticons, emoji shortcodes, and
characters specified in
the `no-trailing-punctuation-in-subject-lines--whitelist` input parameter.

### Configuration
#### `no-trailing-punctuation-in-subject-lines--whitelist`
A space-separated list of punctuation characters to ignore.

For example, a whitelist of `. !` makes the rule accept subject lines with a
trailing period or a trailing exclamation mark.

### Default configuration
```yaml
no-trailing-punctuation-in-subject-lines--whitelist: '' # An empty list of characters.
```

### Examples
```yaml
no-trailing-punctuation-in-subject-lines--whitelist: '? $'
```

#### ✅ Accepted
> Add a new feature

> Fix the bug?

> Refactor the code (the main module)

> Update dependencies :-)

> Write documentation :smile:

> Improve performance by 42%

> Extract a component$

#### ❌ Rejected
> Add a new feature.

> Fix the bug!

> Refactor the code (

> Update dependencies )

> Write documentation:

> Improve performance by x%

> Extract a component#
