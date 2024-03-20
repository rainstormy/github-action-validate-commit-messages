=== `no-unexpected-whitespace`
The subject line of each commit must not contain any leading, trailing, or consecutive whitespace characters.
The message body must not contain any consecutive whitespace characters except for indentation.

Standardising the commit message format will help you preserve the readability of the commit history.

==== Examples
Space and newline characters are denoted by the `&middot;` and `&#9166;` characters, respectively, in the following examples:

|===
|✅ Accepted |⛔ Rejected

m|Write&middot;unit&middot;tests
m|Write&middot;unit&middot;&middot;tests

m|fixup!&middot;Fix&middot;the&middot;bug
m|&middot;Fix&middot;the&middot;bug

m|Implement&middot;the&middot;feature
m|Implement&middot;the&middot;feature&middot;

m|Write&middot;documentation&#9166; +
&#9166; +
&middot;&middot;This&middot;commit&middot;describes&middot;the&middot;usage.
m|Write&middot;documentation&#9166; +
&#9166; +
This&middot;commit&middot;describes&middot;&middot;the&middot;usage.
|===
