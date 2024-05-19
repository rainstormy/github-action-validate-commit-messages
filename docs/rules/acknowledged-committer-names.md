# `acknowledged-committer-names`

The committer must use a name that matches one of the regular expressions in
the `acknowledged-committer-names--patterns` input parameter.

Standardising the committer format will help you preserve the traceability of
the commit history and avoid leaking personal information inadvertently.

### Configuration
#### `acknowledged-committer-names--patterns`
A space-separated list of regular expressions of names to accept.

### Default configuration
```yaml
acknowledged-committer-names--patterns: '^\b$' # A regular expression that never matches anything.
```

### Examples
```yaml
acknowledged-committer-names--patterns: '\p{Lu}.*\s.+'
```

This regular expression makes the rule accept names that have at least two words
where the first one starts with an uppercase letter:

#### ✅ Accepted
> The Little Mermaid

> Santa Claus

> Jeanne d'Arc

#### ❌ Rejected
> the little mermaid

> Santa.claus

> Jeanne
