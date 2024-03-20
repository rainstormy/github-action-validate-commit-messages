=== `limit-length-of-subject-lines`
The subject line of each commit must not exceed the number of characters specified in the `+limit-length-of-subject-lines--max-characters+` input parameter.
Exceptions to this rule include merge commits, revert commits, and subject lines that contain a section enclosed by +`backticks`+.
Issue references and squash commit prefixes do not count towards the limit.

Keeping the subject line short will help you preserve the readability of the commit history in various Git clients.

==== Configuration
|===
|Input Parameter |Description |Default Value

m|+limit-length-of-subject-lines--max-characters+
|The maximum number of characters allowed in the subject line.
It must be a positive integer.
m|50
|===

==== Examples (Default Configuration)
|===
|✅ Accepted |⛔ Rejected

m|squash! Retrieve some data from the fast external services
m|Retrieve some data from the quick external services

m|Revert "Compare the list of items to the objects downloaded from the server"
m|Compare the list of items to the objects downloaded from the server

m|Let +`SoftIceMachineAdapter`+ produce the goods that we need
m|Forget to close the backtick section in `RapidTransportService
|===
