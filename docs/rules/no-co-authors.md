# `no-co-authors`

The message body must not contain `Co-authored-by:` trailers.

Removing the co-authors will help you preserve the authenticity of the commit,
as co-authors are unable to sign commits.

By disallowing `Co-authored-by:` trailers, you can catch commits made through
the GitHub web interface such as code review suggestions proposed by your peers.

### Examples
⏎ denotes a newline character.

#### ✅ Accepted
> Update src/main.ts

> Implement the feature⏎  
> ⏎  
> Reported-By: Little Mermaid <19891117+littlemermaid@users.noreply.github.com>

#### ❌ Rejected
> Update src/main.ts⏎  
> ⏎  
> Co-authored-by: Santa <18920129+santaclaus@users.noreply.github.com>

> Implement the feature⏎  
> ⏎  
> Co-Authored-By: Easter Bunny <bunny@eastercompany.com>⏎  
> Co-Authored-By: Santa <18920129+santaclaus@users.noreply.github.com>⏎  
> Reported-By: Little Mermaid <19891117+littlemermaid@users.noreply.github.com>
