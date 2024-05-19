# `limit-length-of-body-lines`

Each line in the message body must not exceed the number of characters specified
in the `limit-length-of-body-lines--max-characters` input parameter.

Keeping the body lines short will help you preserve the readability of the
commit history in various Git clients.

Exceptions to this rule include merge conflict lists, lines within verbatim
zones enclosed by ```triple backticks```, and lines that contain a section
enclosed by `backticks`.

### Configuration
#### `limit-length-of-body-lines--max-characters`
The maximum number of characters allowed per line in the message body.
It must be a positive integer.

### Default configuration
```yaml
limit-length-of-body-lines--max-characters: 72
```

### Examples
```yaml
limit-length-of-body-lines--max-characters: 72
```

⏎ denotes a newline character.

#### ✅ Accepted
> Help fix the bug⏎  
> ⏎  
> It was just a matter of time before it would cause customers to grumble.

> Merge branch 'main' into feature/dance-party⏎  
> ⏎  
> Conflicts:⏎  
> &nbsp;&nbsp;src/some/very/nested/directory/extremely-grumpy-cat-with-surprising-features.test.ts

> Update dependencies⏎  
> ⏎  
> This commit updates some third-party dependencies:⏎  
> ⏎  
> \```shell⏎  
> yarn update --exact @elements/hydrogen@1.0.0 @elements/nitrogen@2.5.0 @elements/oxygen@2.6.0⏎  
> \```

#### ❌ Rejected
> Help fix the bug⏎  
> ⏎  
> It was just a matter of time before it would cause customers to complain.

> Forget to close a backtick section⏎  
> ⏎  
> This commit forgets to close the backtick section in `RapidTransportService.

> Update dependencies⏎  
> ⏎  
> This commit updates some third-party dependencies by running the following
> command:⏎  
> ⏎  
> \```shell⏎  
> yarn update --exact @elements/hydrogen@1.0.0 @elements/nitrogen@2.5.0 @elements/oxygen@2.6.0⏎  
> \```
