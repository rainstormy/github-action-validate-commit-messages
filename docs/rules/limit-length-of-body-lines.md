=== `limit-length-of-body-lines`
Each line of the message body of each commit must not exceed the number of characters specified in the `+limit-length-of-body-lines--max-characters+` input parameter.
Exceptions to this rule include merge conflict lists, lines within verbatim zones enclosed by +```triple backticks```+, and lines that contain a section enclosed by +`backticks`+.

Keeping the body lines short will help you preserve the readability of the commit history in various Git clients.

==== Configuration
|===
|Input Parameter |Description |Default Value

m|+limit-length-of-body-lines--max-characters+
|The maximum number of characters allowed per line in the message body.
It must be a positive integer.
m|72
|===

==== Examples (Default Configuration)
|===
|✅ Accepted |⛔ Rejected

m|Help fix the bug

It was just a matter of time before it would cause customers to grumble.

m|Help fix the bug

It was just a matter of time before it would cause customers to complain.

m|Merge branch 'main' into feature/dance-party

Conflicts: +
{nbsp}src/some/very/nested/directory/extremely-grumpy-cat-with-surprising-features.test.ts
m|Forget to close a backtick section

This commit forgets to close the backtick section in `RapidTransportService.

m|Update dependencies

This commit updates some third-party dependencies:

+```shell+ +
yarn update --exact @elements/hydrogen@1.0.0 @elements/nitrogen@2.5.0 @elements/oxygen@2.6.0 +
+```+

m|Update dependencies

This commit updates some third-party dependencies by running the following command:

+```shell+ +
yarn update --exact @elements/hydrogen@1.0.0 @elements/nitrogen@2.5.0 @elements/oxygen@2.6.0 +
+```+
|===
