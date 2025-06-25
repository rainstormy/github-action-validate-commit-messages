# Get started on 🍏 macOS

This guide describes the necessary steps for you to start coding in this
project.

Last updated: June 25, 2025.

1. [Install Homebrew and essential packages](#-1-install-homebrew-and-essential-packages)
2. [Generate SSH keys](#-2-generate-ssh-keys)
3. [Install Git and GitHub CLI](#-3-install-git-and-github-cli)
4. [Prepare your workspace](#-4-prepare-your-workspace)
5. [Install an IDE](#-5-install-an-ide)

> [!IMPORTANT]  
> This guide assumes that you are using:
> - An ARM-based CPU (e.g. an M-series Apple Silicon chip).
> - macOS 15 (Sequoia) or newer.
>
> You must complete the guide in [Zsh](https://zsh.sourceforge.io) (the
> default shell on macOS) in a _single_ shell session (i.e. the same terminal
> tab), as some steps rely on variables set in earlier steps.

> [!TIP]  
> This guide may use `\` line continuations in multi-line commands to let you
> copy, paste, and run them as one.

## 🍏 1. Install [Homebrew](https://brew.sh) and essential packages
1. Install Homebrew:  
   _(it may request elevated privileges)_
   ```shell
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" && \
   echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile && \
   eval "$(/opt/homebrew/bin/brew shellenv)"
   ```

2. Verify that the installation succeeded:
   ```shell
   brew --version # -> 4.5.0 or newer
   ```

3. Install [jq](https://jqlang.org) and [yq](https://mikefarah.gitbook.io/yq):
   ```shell
   brew install jq yq
   ```

4. Verify that both installations succeeded:
   ```shell
   jq --version # -> 1.8.0 or newer
   ```
   ```shell
   yq --version # -> 4.45.0 or newer
   ```

5. [Enable](https://github.com/DomT4/homebrew-autoupdate) daily package
   upgrades:
   ```shell
   brew tap DomT4/homebrew-autoupdate && \
   brew autoupdate start --upgrade --cleanup --immediate
   ```

> [!TIP]  
> You can also upgrade all installed packages manually:
> ```shell
> brew update && brew upgrade
> ```

## 🍏 2. Generate [SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/about-ssh)
### ⭐ Using [1Password](https://1password.com) _(recommended)_
1. [Download](https://1password.com/downloads/mac) and install the desktop app.

2. [Enable](https://developer.1password.com/docs/ssh/get-started/#step-3-turn-on-the-1password-ssh-agent)
   the SSH agent in 1Password:  
   Go to **Settings** (<kbd>⌘ Cmd</kbd><kbd>,</kbd>) › **Developer**.  
   Select **Use the SSH agent**.

3. [Configure](https://developer.1password.com/docs/ssh/get-started/#step-4-configure-your-ssh-or-git-client)
   the SSH client to use the SSH agent in 1Password:
   ```shell
   mkdir -p ~/.1password && \
   ln -s ~/Library/Group\ Containers/2BUA8C4S2C.com.1password/t/agent.sock ~/.1password/agent.sock && \
   mkdir -p ~/.ssh && \
   echo -e "Host *\n  IdentityAgent ~/.1password/agent.sock" >> ~/.ssh/config
   ```

4. [Install](https://developer.1password.com/docs/cli/get-started/#step-1-install-1password-cli)
   the 1Password CLI:
   ```shell
   brew install 1password-cli
   ```

5. Verify that the installation succeeded:
   ```shell
   op --version # -> 2.31.0 or newer
   ```

6. [Generate](https://developer.1password.com/docs/ssh/manage-keys/#generate-an-ssh-key)
   two SSH keys in your 1Password vault; one to authenticate to GitHub and one
   to sign commits:  
   _(use names of your choice)_
   ```shell
   OP_AUTH_KEY_NAME='GitHub authentication key'
   ```
   ```shell
   OP_SIGN_KEY_NAME='GitHub signing key'
   ```
   ```shell
   JQ_GRAB_PUBLIC_KEY='.fields[] | select(.label=="public key") | .value' && \
   GH_AUTH_KEY="$(op item create --category ssh --title "$OP_AUTH_KEY_NAME" --format json | jq --raw-output "$JQ_GRAB_PUBLIC_KEY")" && \
   GH_SIGN_KEY="$(op item create --category ssh --title "$OP_SIGN_KEY_NAME" --format json | jq --raw-output "$JQ_GRAB_PUBLIC_KEY")"
   ```

### Using [OpenSSH](https://www.openssh.com)
1. [Generate](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
   an SSH key to authenticate to GitHub:  
   _(use a name of your choice and enter a passphrase to protect the key)_
   ```shell
   SSH_AUTH_KEY_FILENAME='id_github_auth'
   ```
   ```shell
   mkdir -p ~/.ssh && \
   ssh-keygen -t ed25519 -f "$HOME/.ssh/$SSH_AUTH_KEY_FILENAME" && \
   ssh-add --apple-use-keychain "$HOME/.ssh/$SSH_AUTH_KEY_FILENAME" && \
   echo -e "Host github.com\n  AddKeysToAgent yes\n  UseKeychain yes\n  IdentityFile ~/.ssh/$SSH_AUTH_KEY_FILENAME" >> ~/.ssh/config && \
   GH_AUTH_KEY="$(< "$HOME/.ssh/$SSH_AUTH_KEY_FILENAME.pub")"
   ```

2. Generate an SSH key to sign commits:  
   _(use a name of your choice and enter a passphrase to protect the key)_
   ```shell
   SSH_SIGN_KEY_FILENAME='id_github_sign'
   ```
   ```shell
   ssh-keygen -t ed25519 -f "$HOME/.ssh/$SSH_SIGN_KEY_FILENAME" && \
   ssh-add --apple-use-keychain "$HOME/.ssh/$SSH_SIGN_KEY_FILENAME" && \
   GH_SIGN_KEY="$(< "$HOME/.ssh/$SSH_SIGN_KEY_FILENAME.pub")"
   ```

> [!IMPORTANT]  
> You must unlock the signing key whenever you have restarted your computer:
> ```shell
> ssh-add --apple-use-keychain ~/.ssh/id_github_sign
> ```
>
> Otherwise, you may face this problem when attempting to commit:
> ```
> error: Couldn't find key in agent?
> fatal: failed to write commit object
> ```

> [!IMPORTANT]  
> The SSH keys are stored locally in the `~/.ssh` directory and must be
> transferred manually to other computers.

## 🍏 3. Install [Git](https://git-scm.com) and [GitHub CLI](https://cli.github.com)
1. Install Git and the GitHub CLI:
   ```shell
   brew install git gh
   ```

2. Verify that both installations succeeded:
   ```shell
   git --version # -> 2.50.0 or newer
   ```
   ```shell
   gh --version # -> 2.74.0 or newer
   ```

3. [Create](https://cli.github.com/manual/gh_auth_login) an access token that
   grants the GitHub CLI access to your SSH keys:  
   _(it triggers a web-based authentication flow on github.com)_
   ```shell
   gh auth login --scopes admin:public_key,admin:ssh_signing_key
   ```

4. [Add](https://cli.github.com/manual/gh_ssh-key_add) the SSH keys to your
   GitHub account:  
   _(use names of your choice)_
   ```shell
   GH_AUTH_KEY_NAME='Rainstorm authentication key'
   ```
   ```shell
   GH_SIGN_KEY_NAME='Rainstorm signing key'
   ```
   ```shell
   echo "$GH_AUTH_KEY" | gh ssh-key add - --title "$GH_AUTH_KEY_NAME" && \
   echo "$GH_SIGN_KEY" | gh ssh-key add - --title "$GH_SIGN_KEY_NAME" --type signing
   ```

5. [Revoke](https://cli.github.com/manual/gh_auth_refresh) the access to your
   SSH keys from the GitHub CLI:  
   _(it triggers a web-based authentication flow on github.com)_
   ```shell
   gh auth refresh --remove-scopes admin:public_key,admin:ssh_signing_key
   ```

6. [Specify](https://github.com/settings/profile) your full name (first and last
   names) in your GitHub profile.

7. Declare your identity using your GitHub profile name and noreply email
   address:
   ```shell
   GH_USER="$(gh api user)" && \
   git config --global user.name "$(echo "$GH_USER" | jq --raw-output 'if (.name | test("^\\p{Lu}.*\\s")) then .name else error("Full name must contain at least two words where the first word starts with a capital letter") end')" && \
   git config --global user.email "$(echo "$GH_USER" | jq --raw-output '"\(.id)+\(.login)@users.noreply.github.com"')"
   ```

8. [Sign](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification)
   your commits to make GitHub display
   a <span style="border: 1px green solid; border-radius: 4rem; color: green; font-size: smaller; font-weight: bold; padding: 0.25rem 0.5rem;">
   Verified</span> badge next to your commits:
   ```shell
   git config --global user.signingkey "$GH_SIGN_KEY" && \
   git config --global gpg.format 'ssh' && \
   git config --global commit.gpgsign 'true' && \
   git config --global tag.gpgsign 'true'
   ```

9. Enable autosquash suggestions when you rebase interactively:
   ```shell
   git config --global rebase.autosquash 'true'
   ```

## 🍏 4. Prepare your workspace
1. [Install](https://mise.jdx.dev/getting-started.html) mise-en-place:
   ```shell
   brew install mise && \
   echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
   ```

2. Verify that the installation succeeded:
   ```shell
   mise --version # -> 2025.6.0 or newer
   ```

3. Clone the repository into the directory in which you keep your workspaces:  
   _(specify the path to your workspace directory)_
   ```shell
   WORKSPACE_ROOT="$HOME/repositories/rainstormy/"
   ```
   ```shell
   git clone git@github.com:rainstormy/github-action-validate-commit-messages.git "$WORKSPACE_ROOT" && \
   cd "${WORKSPACE_ROOT%/}/github-action-validate-commit-messages/"
   ```

4. Let mise-en-place trust the project configuration:
   ```shell
   mise trust
   ```

5. Install the tools and dependencies required by the project (including Node.js
   and pnpm):
   ```shell
   mise install && mise run init
   ```

6. Verify that both installations succeeded:
   ```shell
   node --version # -> 20.19.0 or newer
   ```
   ```shell
   pnpm --version # -> 10.12.0 or newer
   ```

7. [Pin](https://pnpm.io/settings#saveprefix) packages to an exact version:
   ```shell
   pnpm config --global set save-prefix ''
   ```

## 🍏 5. Install an IDE
### ⭐ Using [IntelliJ IDEA](https://www.jetbrains.com/idea) _(recommended)_
1. [Download](https://www.jetbrains.com/toolbox-app), install, and launch the
   JetBrains Toolbox App.  
   Then install and launch **IntelliJ IDEA Ultimate**.

2. In the menu bar, select **Help** › **Edit Custom VM Options**.  
   Insert these lines to increase the maximum heap size, e.g. to 8 GB of RAM,
   and to disable mnemonics to avoid conflicts with macOS keyboard shortcuts:
   ```
   -Xmx8192m
   -Dide.mac.alt.mnemonic.without.ctrl=false
   ```

3. Quit IntelliJ IDEA (<kbd>⌘ Cmd</kbd><kbd>Q</kbd>).  
   Then install the recommended plugins:
   ```shell
   yq --output-format=csv '.project.component.plugin[]."+@id"' .idea/externalDependencies.xml | xargs -n 1 idea installPlugins
   ```

4. [Use](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration#_basic_client_configuration)
   IntelliJ IDEA as the default editor in Git to edit commit messages and
   conduct interactive rebases:
   ```shell
   git config --global core.editor "idea --wait"
   ```

5. Open the project in IntelliJ IDEA:
    ```shell
    idea .
    ```

6. You're all set &mdash; let the coding begin!

### Using [Visual Studio Code](https://code.visualstudio.com)
1. [Download](https://code.visualstudio.com), install, and launch Visual Studio
   Code.

2. [Enable](https://code.visualstudio.com/docs/setup/mac#_launch-vs-code-from-the-command-line)
   launching Visual Studio Code from the terminal:  
   In the menu bar, select **View** › **Command Palette** (<kbd>⇧
   Shift</kbd><kbd>⌘ Cmd</kbd><kbd>P</kbd>).  
   Locate and run **Shell Command: Install 'code' command in PATH**.  
   _(it may request elevated privileges)_

3. Quit Visual Studio Code (<kbd>⌘ Cmd</kbd><kbd>Q</kbd>).  
   Then install the recommended extensions:
   ```shell
   jq --raw-output '.recommendations[]' .vscode/extensions.json | xargs -n 1 code --install-extension
   ```

4. [Use](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration#_basic_client_configuration)
   Visual Studio Code as the default editor in Git to edit commit messages and
   conduct interactive rebases:
   ```shell
   git config --global core.editor "code --wait"
   ```

5. Open the project in Visual Studio Code:  
   _(it may prompt you to trust the project directory)_
   ```shell
   code .
   ```

6. Open any TypeScript file (`.ts` or `.tsx`) and allow using the TypeScript
   version specified for the workspace.

7. You're all set &mdash; let the coding begin!
