# `no-unexpected-whitespace`

The subject line must not contain any leading, trailing, or consecutive
whitespace characters.
The message body must not contain any consecutive whitespace characters except
for indentation.

Standardising the commit message format will help you preserve the readability
of the commit history.

### Examples
· denotes a space character.
⏎ denotes a newline character.

#### ✅ Accepted
Single infix whitespace characters in the subject line:
> Write·unit·tests

> fixup!·Fix·the·bug

> Implement·the·feature

Leading whitespace characters in the message body:
> Write·documentation⏎  
> ⏎  
> ··This·commit·describes·the·usage.

#### ❌ Rejected
Consecutive whitespace characters in the subject line:
> Write·unit··tests

Leading whitespace characters in the subject line:
> ·Fix·the·bug

Trailing whitespace characters in the subject line:
> Implement·the·feature·

Consecutive whitespace characters in the message body:
> Write·documentation⏎  
> ⏎  
> This·commit·describes··the·usage.
