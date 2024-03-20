# Validate Commit Messages in Pull Requests

This repository implements a reusable GitHub Action that validates commit messages in pull requests on GitHub to ensure that the commit messages meet certain standards and to remind you about squash commits that must be consolidated before you merge the pull request.

It checks the commits that are about to be delivered to the target branch.
It does not check any commits outside the pull request such as existing commits that have already been merged to the target branch in a previous pull request.

### Usage
Define a GitHub Actions workflow that runs on pull requests:

```yaml
# .github/workflows/validate-pull-requests.yml

name: Validate pull requests
on: [pull_request]
jobs:
  validate-commit-messages:
    name: Validate commit messages
    runs-on: ubuntu-latest
    steps:
      - name: Validate the commit messages
        uses: rainstormy/github-action-validate-commit-messages@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          rules: no-merge-commits, no-squash-commits
```

Here is a more elaborate example that uses all the available rules and tweaks the configuration of some of them:

```yaml
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
  rules: acknowledged-author-email-addresses, acknowledged-author-names, acknowledged-committer-email-addresses, acknowledged-committer-names, capitalised-subject-lines, empty-line-after-subject-lines, imperative-subject-lines, issue-references-in-subject-lines, limit-length-of-body-lines, limit-length-of-subject-lines, multi-word-subject-lines, no-co-authors, no-merge-commits, no-revert-revert-commits, no-squash-commits, no-trailing-punctuation-in-subject-lines, no-unexpected-whitespace, unique-subject-lines
  acknowledged-author-email-addresses--patterns: '\d+\+.+@users\.noreply\.github\.com'
  acknowledged-author-names--patterns: '.+\s.+'
  acknowledged-committer-email-addresses--patterns: '\d+\+.+@users\.noreply\.github\.com'
  acknowledged-committer-names--patterns: '.+\s.+'
  issue-references-in-subject-lines--allowed-positions: as-suffix
  issue-references-in-subject-lines--patterns: '\(#[1-9][0-9]*\) #[1-9][0-9]*'
```

### Rules
