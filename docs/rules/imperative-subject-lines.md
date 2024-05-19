# `imperative-subject-lines`

The subject line must start with a verb in the imperative mood so that it reads
like an instruction.

Standardising the commit message format will help you preserve the readability
of the commit history.

### Configuration
#### `imperative-subject-lines--whitelist`
A comma-separated, case-insensitive list of additional words to accept.

For example, a whitelist of `chatify, deckenize` makes the rule accept subject
lines that start with one of the fictive words 'chatify' or 'deckenize', in
addition to subject lines that start with one of the 4,000+ verbs which are
baked into the rule.

### Default configuration
```yaml
imperative-subject-lines--whitelist: '' # An empty list of words.
```

### Examples
```yaml
imperative-subject-lines--whitelist: chatify, deckenize
```

#### ✅ Accepted
> Add a new feature

> Format the code

> Make it work

> Do the validation every time

> Chatify the documentation

#### ❌ Rejected
> Added a new feature

> Formatting

> It works

> Always validate

> Chatifies the documentation
