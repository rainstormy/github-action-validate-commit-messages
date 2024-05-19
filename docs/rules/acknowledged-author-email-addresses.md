# `acknowledged-author-email-addresses`

The commit author must use an email address that matches one of the regular
expressions in the `acknowledged-author-email-addresses--patterns` input
parameter.

Standardising the author format will help you preserve the traceability of the
commit history and avoid leaking personal information (e.g. a private email
address) inadvertently.

### Configuration
#### `acknowledged-author-email-addresses--patterns`
A space-separated list of regular expressions of email addresses to accept.

### Default configuration
```yaml
acknowledged-author-email-addresses--patterns: '^\b$' # A regular expression that never matches anything.
```

### Examples
```yaml
acknowledged-author-email-addresses--patterns: '\d+\+.+@users\.noreply\.github\.com'
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
