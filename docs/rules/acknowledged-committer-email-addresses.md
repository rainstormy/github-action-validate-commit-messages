# `acknowledged-committer-email-addresses`

The committer must use an email address that matches one of the regular
expressions in the `acknowledged-committer-email-addresses--patterns` input
parameter.

By disallowing `noreply@github.com` as a committer email address, you can catch
commits made through the GitHub web interface such as code review suggestions.

Standardising the committer format will help you preserve the traceability of
the commit history and avoid leaking personal information (e.g. a private email
address) inadvertently.

### Configuration

#### `acknowledged-committer-email-addresses--patterns`
A space-separated list of regular expressions of email addresses to accept.

### Default configuration
```yaml
acknowledged-committer-email-addresses--patterns: '^\b$' # A regular expression that never matches anything.
```

### Examples
```yaml
acknowledged-committer-email-addresses--patterns: '\d+\+.+@users\.noreply\.github\.com'
```

This regular expression makes the rule accept personal noreply email addresses
on GitHub:

#### ✅ Accepted
> 19891117+littlemermaid@users.noreply.github.com

> 18920129+santaclaus@users.noreply.github.com

> 12345678+username@users.noreply.github.com

#### ❌ Rejected
> little.mermaid@theocean.com

> claus@santasworkshop.com

> noreply@github.com
