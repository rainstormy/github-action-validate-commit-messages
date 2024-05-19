# `limit-length-of-subject-lines`

The subject line must not exceed the number of characters specified in
the `limit-length-of-subject-lines--max-characters` input parameter.

Keeping the subject line short will help you preserve the readability of the
commit history in various Git clients.

Exceptions to this rule include merge commits, revert commits, and subject lines
that contain a section enclosed by `backticks`.
Issue references and squash commit prefixes do not count towards the limit.

### Configuration
#### `limit-length-of-subject-lines--max-characters`
The maximum number of characters allowed in the subject line.
It must be a positive integer.

### Default configuration
```yaml
limit-length-of-subject-lines--max-characters: 50
```

### Examples
```yaml
limit-length-of-subject-lines--max-characters: 50
```

#### ✅ Accepted
> Introduce a cool feature

> squash! Retrieve some data from the fast external services

> Let `SoftIceMachineAdapter` produce the goods that we need

> Revert "Compare the list of items to the objects downloaded from the server"

#### ❌ Rejected
> Retrieve some data from the quick external services

> Compare the list of items to the objects downloaded from the server

> Forget to close the backtick section in `RapidTransportService
