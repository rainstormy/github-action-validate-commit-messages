# Validate Commit Messages in Pull Requests

This repository implements a reusable GitHub Action that validates commit
messages in pull requests on GitHub to ensure that the commit messages meet
certain standards and to remind you about squash commits that must be
consolidated before you merge the pull request.

It checks the commits that are about to be delivered to the target branch.
It does not check any commits outside the pull request such as existing commits
that have already been merged to the target branch in a previous pull request.

### Usage
#### Basic Example
```yaml
# .github/workflows/ci.yml

name: CI

on:
  pull_request:
    branches:
      - main

jobs:
  has-standardised-commit-messages:
    name: Has standardised commit messages
    # Uncomment the following line if the workflow has other triggers than `pull_request` events:
    # if: github.event_name == 'pull_request'
    runs-on: ubuntu-22.04
    timeout-minutes: 1
    permissions:
      pull-requests: read # Allow `rainstormy/github-action-validate-commit-messages` to read the commit messages in the pull request.
    steps:
      - name: Verify that the commit messages are standardised
        uses: rainstormy/github-action-validate-commit-messages@158b8e35c5e89cf6a10b611efe20ac70cd51983a # https://github.com/rainstormy/github-action-validate-commit-messages/releases/tag/v1.1.4
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          rules: |
            no-merge-commits,
            no-squash-commits,
```

#### Advanced Example
This example uses all the available rules and tweaks the configuration of a
subset of the rules.

```yaml
# .github/workflows/ci.yml

name: CI

on:
  pull_request:
    branches:
      - main

jobs:
  has-standardised-commit-messages:
    name: Has standardised commit messages
    # Uncomment the following line if the workflow has other triggers than `pull_request` events:
    # if: github.event_name == 'pull_request'
    runs-on: ubuntu-22.04
    timeout-minutes: 1
    permissions:
      pull-requests: read # Allow `rainstormy/github-action-validate-commit-messages` to read the commit messages in the pull request.
    steps:
      - name: Verify that the commit messages are standardised
        uses: rainstormy/github-action-validate-commit-messages@158b8e35c5e89cf6a10b611efe20ac70cd51983a # https://github.com/rainstormy/github-action-validate-commit-messages/releases/tag/v1.1.4
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          rules: |
            acknowledged-author-email-addresses,
            acknowledged-author-names,
            acknowledged-committer-email-addresses,
            acknowledged-committer-names,
            capitalised-subject-lines,
            empty-line-after-subject-lines,
            imperative-subject-lines,
            limit-length-of-body-lines,
            limit-length-of-subject-lines,
            multi-word-subject-lines,
            no-co-authors,
            no-merge-commits,
            no-revert-revert-commits,
            no-squash-commits,
            no-trailing-punctuation-in-subject-lines,
            no-unexpected-whitespace,
            unique-subject-lines,
          acknowledged-author-email-addresses--patterns: '\d+\+.+@users\.noreply\.github\.com'
          acknowledged-author-names--patterns: '.+\s.+'
          acknowledged-committer-email-addresses--patterns: '\d+\+.+@users\.noreply\.github\.com'
          acknowledged-committer-names--patterns: '.+\s.+'
          issue-references-in-subject-lines--allowed-positions: as-suffix
          issue-references-in-subject-lines--patterns: '\(#[1-9][0-9]*\) #[1-9][0-9]*'
```

### Rules
| Key                                                                                                | Description                                                                                                               |
|----------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| [acknowledged-author-email-addresses](docs/rules/acknowledged-author-email-addresses.md)           | The commit author must use an email address that matches a given regular expression.                                      |
| [acknowledged-author-names](docs/rules/acknowledged-author-names.md)                               | The commit author must use a name that matches a given regular expression.                                                |
| [acknowledged-committer-email-addresses](docs/rules/acknowledged-committer-email-addresses.md)     | The committer must use an email address that matches a given regular expression.                                          |
| [acknowledged-committer-names](docs/rules/acknowledged-committer-names.md)                         | The committer must use a name that matches a given regular expression.                                                    |
| [capitalised-subject-lines](docs/rules/capitalised-subject-lines.md)                               | The subject line must start with an uppercase letter.                                                                     |
| [empty-line-after-subject-lines](docs/rules/empty-line-after-subject-lines.md)                     | The subject line and the message body must be separated by an empty line.                                                 |
| [imperative-subject-lines](docs/rules/imperative-subject-lines.md)                                 | The subject line must start with a verb in the imperative mood.                                                           |
| [issue-references-in-subject-lines](docs/rules/issue-references-in-subject-lines.md)               | The subject line must contain a reference to an issue tracking system.                                                    |
| [limit-length-of-body-lines](docs/rules/limit-length-of-body-lines.md)                             | Each line in the message body must not exceed a given number of characters.                                               |
| [limit-length-of-subject-lines](docs/rules/limit-length-of-subject-lines.md)                       | The subject line must not exceed a given number of characters.                                                            |
| [multi-word-subject-lines](docs/rules/multi-word-subject-lines.md)                                 | The subject line must contain at least two words.                                                                         |
| [no-co-authors](docs/rules/no-co-authors.md)                                                       | The message body must not contain `Co-authored-by:` trailers.                                                             |
| [no-merge-commits](docs/rules/no-merge-commits.md)                                                 | Disallow merge commits to be merged to the target branch.                                                                 |
| [no-revert-revert-commits](docs/rules/no-revert-revert-commits.md)                                 | Disallow commits that revert other revert commits to be merged to the target branch.                                      |
| [no-squash-commits](docs/rules/no-squash-commits.md)                                               | Disallow squash commits to be merged to the target branch.                                                                |
| [no-trailing-punctuation-in-subject-lines](docs/rules/no-trailing-punctuation-in-subject-lines.md) | The subject line must not end with a punctuation character.                                                               |
| [no-unexpected-whitespace](docs/rules/no-unexpected-whitespace.md)                                 | The subject line and message body must not contain any leading, trailing, or consecutive whitespace characters.           |
| [unique-subject-lines](docs/rules/unique-subject-lines.md)                                         | Disallow commits that repeat the subject line of a previous commit in the pull request to be merged to the target branch. |
