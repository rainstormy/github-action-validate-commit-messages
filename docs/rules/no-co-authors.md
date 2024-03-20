=== `no-co-authors`
The message body must not contain `Co-authored-by:` trailers.

Removing the co-authors will help you preserve the authenticity of the commit, as co-authors are unable to sign commits.

By disallowing `Co-authored-by:` trailers, you can catch commits made through the GitHub web interface such as code review suggestions proposed by your peers.

==== Examples
|===
|✅ Accepted |⛔ Rejected

m|Update src/main.ts
m|Update src/main.ts

Co-authored-by: Santa Claus <+18920129+santaclaus@users.noreply.github.com+>

m|Implement the feature

Reported-By: Little Mermaid <+19891117+littlemermaid@users.noreply.github.com+>

m|Implement the feature

Co-Authored-By: Easter Bunny <+bunny@eastercompany.com+> +
Co-Authored-By: Santa Claus <+18920129+santaclaus@users.noreply.github.com+> +
Reported-By: Little Mermaid <+19891117+littlemermaid@users.noreply.github.com+>
|===
