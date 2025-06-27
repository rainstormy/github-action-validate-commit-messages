# Get started on 🟦 Windows

This guide describes the necessary steps for you to start coding in this
project.

Last updated: June 25, 2025.

1. [Install the modern PowerShell and essential packages](#-1-install-the-modern-powershell-and-essential-packages)
2. [Generate SSH keys](#-2-generate-ssh-keys)
3. [Install Git and GitHub CLI](#-3-install-git-and-github-cli)
4. [Prepare your workspace](#-4-prepare-your-workspace)
5. [Install an IDE](#-5-install-an-ide)

> [!IMPORTANT]  
> This guide assumes that you are using:
> - Windows 11 or newer.
>
> You must complete the guide in [PowerShell](https://microsoft.com/PowerShell)
> in a _single_ shell session (i.e. the same terminal tab), as some steps rely
> on variables set in earlier steps.

> [!TIP]  
> This guide may use `` ` `` line continuations in multi-line commands to let
> you copy, paste, and run them as one.

## 🟦 1. Install the modern [PowerShell](https://microsoft.com/PowerShell) and essential packages
1. [Install](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows#install-powershell-using-winget-recommended)
   PowerShell:
   ```shell
   winget install --source winget --exact --id Microsoft.PowerShell
   ```

2. [Make](https://learn.microsoft.com/en-us/windows/terminal/customize-settings/startup#default-profile)
   PowerShell the default shell in Windows Terminal:  
   Close and reopen Windows Terminal to make it discover the newly installed
   PowerShell.  
   Go to **Settings** (<kbd>Ctrl</kbd><kbd>,</kbd>) › **Startup**.  
   Set **Default profile** to be _PowerShell_.  
   Press **Save**.

3. Start a new PowerShell session.

4. Install [jq](https://jqlang.org) and [yq](https://mikefarah.gitbook.io/yq):
   ```shell
   winget install --source winget --exact --id jqlang.jq && `
   winget install --source winget --exact --id MikeFarah.yq
   ```

5. Refresh the `PATH` to enable them in the command-line:
   ```shell
   $env:Path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path', 'User')
   ```

6. Verify that both installations succeeded:
   ```shell
   jq --version # -> 1.8.0 or newer
   ```
   ```shell
   yq --version # -> 4.45.0 or newer
   ```

> [!TIP]  
> You can upgrade all installed packages manually:
> ```shell
> winget upgrade --all
> ```

## 🟦 2. Generate [SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/about-ssh)
### ⭐ Using [1Password](https://1password.com) _(recommended)_
1. [Disable](https://developer.1password.com/docs/ssh/get-started/#step-3-turn-on-the-1password-ssh-agent)
   the OpenSSH Authentication Agent service in Windows:  
   Go to **Services** (<kbd>Win</kbd><kbd>R</kbd> › type `services.msc` › <kbd>
   Enter</kbd>) › **OpenSSH Authentication Agent**.  
   Set the **Startup type** to be disabled.  
   Stop the service if it is currently running.  
   Press **OK**.

2. [Download](https://1password.com/downloads/windows) and install the desktop
   app.

3. [Enable](https://developer.1password.com/docs/ssh/get-started/#step-3-turn-on-the-1password-ssh-agent)
   the SSH agent in 1Password:  
   Go to **Settings** (<kbd>Ctrl</kbd><kbd>,</kbd>) › **Developer** › **Set up
   the SSH agent** › **Use key names**.  
   Then press **Set up the SSH agent** again and confirm that the OpenSSH
   Authentication Agent service is disabled.

3. [Configure](https://developer.1password.com/docs/ssh/get-started/#step-4-configure-your-ssh-or-git-client)
   the SSH client to use the SSH agent in 1Password:
   ```shell
   New-Item -Path "$env:USERPROFILE\.1password" -ItemType Directory -Force && `
   New-Item -Path "$env:USERPROFILE\.ssh" -ItemType Directory -Force && `
   Add-Content -Path "$env:USERPROFILE\.ssh\config" -Value "Host *`n  IdentityAgent ~/.1password/agent.sock"
   ```

4. [Install](https://developer.1password.com/docs/cli/get-started/#step-1-install-1password-cli)
   the 1Password CLI:
   ```shell
   winget install --source winget --exact --id AgileBits.1Password.CLI
   ```

5. Refresh the `PATH` to enable it in the command-line:
   ```shell
   $env:Path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path', 'User')
   ```

6. Verify that the installation succeeded:
   ```shell
   op --version # -> 2.31.0 or newer
   ```

7. [Generate](https://developer.1password.com/docs/ssh/manage-keys/#generate-an-ssh-key)
   two SSH keys in your 1Password vault; one to authenticate to GitHub and one
   to sign commits:  
   _(use names of your choice)_
   ```shell
   $OP_AUTH_KEY_NAME = 'GitHub Authentication Key'
   ```
   ```shell
   $OP_SIGN_KEY_NAME = 'GitHub Signing Key'
   ```
   ```shell
   $JQ_GRAB_PUBLIC_KEY = '.fields[] | select(.label=="public key") | .value'
   $GH_AUTH_KEY = (op item create --category ssh --title "$OP_AUTH_KEY_NAME" --format json | jq --raw-output "$JQ_GRAB_PUBLIC_KEY")
   $GH_SIGN_KEY = (op item create --category ssh --title "$OP_SIGN_KEY_NAME" --format json | jq --raw-output "$JQ_GRAB_PUBLIC_KEY")
   ```

### Using [OpenSSH](https://www.openssh.com)
1. [Generate](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
   an SSH key to authenticate to GitHub:  
   _(use a name of your choice and enter a passphrase to protect the key)_
   ```shell
   $SSH_AUTH_KEY_FILENAME = 'id_github_auth'
   ```
   ```shell
   New-Item -Path "$env:USERPROFILE\.ssh" -ItemType Directory -Force
   ssh-keygen -t ed25519 -f "$env:USERPROFILE\.ssh\$SSH_AUTH_KEY_FILENAME"
   Add-Content -Path "$env:USERPROFILE\.ssh\config" -Value "Host github.com`n  AddKeysToAgent yes`n  IdentityFile ~/.ssh/$SSH_AUTH_KEY_FILENAME"
   $GH_AUTH_KEY = Get-Content "$env:USERPROFILE\.ssh\$SSH_AUTH_KEY_FILENAME.pub"
   ```

2. Generate an SSH key to sign commits:  
   _(use a name of your choice and enter a passphrase to protect the key)_
   ```shell
   $SSH_SIGN_KEY_FILENAME = 'id_github_sign'
   ```
   ```shell
   ssh-keygen -t ed25519 -f "$env:USERPROFILE\.ssh\$SSH_SIGN_KEY_FILENAME"
   $GH_SIGN_KEY = Get-Content "$env:USERPROFILE\.ssh\$SSH_SIGN_KEY_FILENAME.pub"
   ```

> [!IMPORTANT]  
> You must start the SSH agent and add your keys whenever you have restarted
> your computer:
> ```shell
> Start-Service ssh-agent
> ssh-add "$env:USERPROFILE\.ssh\id_github_auth"
> ssh-add "$env:USERPROFILE\.ssh\id_github_sign"
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

## 🟦 3. Install [Git](https://git-scm.com) and [GitHub CLI](https://cli.github.com)
1. Install Git and the GitHub CLI:  
   _(it may request elevated privileges)_
   ```shell
   winget install --source winget --exact --id Git.Git
   winget install --source winget --exact --id GitHub.cli
   ```

2. Refresh the `PATH` to enable them in the command-line:
   ```shell
   $env:Path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path', 'User')
   ```

3. Verify that both installations succeeded:
   ```shell
   git --version # -> 2.50.0 or newer
   ```
   ```shell
   gh --version # -> 2.74.0 or newer
   ```

4. [Create](https://cli.github.com/manual/gh_auth_login) an access token that
   grants the GitHub CLI access to your SSH keys:  
   _(it triggers a web-based authentication flow on github.com)_
   ```shell
   gh auth login --scopes admin:public_key,admin:ssh_signing_key
   ```

5. [Add](https://cli.github.com/manual/gh_ssh-key_add) the SSH keys to your
   GitHub account:  
   _(use names of your choice)_
   ```shell
   $GH_AUTH_KEY_NAME = 'Rainstorm authentication key'
   ```
   ```shell
   $GH_SIGN_KEY_NAME = 'Rainstorm signing key'
   ```
   ```shell
   $GH_AUTH_KEY | gh ssh-key add - --title "$GH_AUTH_KEY_NAME"
   $GH_SIGN_KEY | gh ssh-key add - --title "$GH_SIGN_KEY_NAME" --type signing
   ```

6. [Revoke](https://cli.github.com/manual/gh_auth_refresh) the access to your
   SSH keys from the GitHub CLI:  
   _(it triggers a web-based authentication flow on github.com)_
   ```shell
   gh auth refresh --remove-scopes admin:public_key,admin:ssh_signing_key
   ```

7. [Specify](https://github.com/settings/profile) your full name (first and last
   names) in your GitHub profile.

8. Declare your identity using your GitHub profile name and noreply email
   address:
   ```shell
   $GH_USER = gh api user | ConvertFrom-Json
   $GH_NAME = $GH_USER.name
   if (-not ($GH_NAME -match "^[A-Z].*\s")) {
       Write-Error "Full name must contain at least two words where the first word starts with a capital letter"
       exit 1
   }
   git config --global user.name $GH_NAME
   git config --global user.email "$($GH_USER.id)+$($GH_USER.login)@users.noreply.github.com"
   ```

9. [Sign](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification)
   your commits:
   ```shell
   git config --global user.signingkey "$GH_SIGN_KEY"
   git config --global gpg.format 'ssh'
   git config --global commit.gpgsign 'true'
   git config --global tag.gpgsign 'true'
   ```
   GitHub will display a _Verified_ badge next to your signed commits.

10. Enable autosquash suggestions when you rebase interactively:
   ```shell
   git config --global rebase.autosquash 'true'
   ```

## 🟦 4. Prepare your workspace
1. [Install](https://mise.jdx.dev/getting-started.html) mise-en-place:
   ```shell
   winget install --source winget --exact --id jdx.mise
   ```

2. Refresh the `PATH` to enable it in the command-line:
   ```shell
   $env:Path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path', 'User')
   ```

3. Add mise-en-place activation to your PowerShell profile:
   ```shell
   Add-Content -Path $PROFILE -Value 'Invoke-Expression (&mise activate powershell)'
   ```

4. Verify that the installation succeeded:
   ```shell
   mise --version # -> 2025.6.0 or newer
   ```

5. Clone the repository into the directory in which you keep your workspaces:  
   _(specify the path to your workspace directory)_
   ```shell
   $WORKSPACE_ROOT = "$env:USERPROFILE\repositories\rainstormy\"
   ```
   ```shell
   git clone git@github.com:rainstormy/github-action-validate-commit-messages.git $WORKSPACE_ROOT
   Set-Location "${WORKSPACE_ROOT}github-action-validate-commit-messages\"
   ```

6. Let mise-en-place trust the project configuration:
   ```shell
   mise trust
   ```

7. Install the tools and dependencies required by the project (including Node.js
   and pnpm):
   ```shell
   mise install && mise run init
   ```

8. Verify that both installations succeeded:
   ```shell
   node --version # -> 20.19.0 or newer
   ```
   ```shell
   pnpm --version # -> 10.12.0 or newer
   ```

9. [Pin](https://pnpm.io/settings#saveprefix) packages to an exact version:
   ```shell
   pnpm config --global set save-prefix ''
   ```

## 🟦 5. Install an IDE
### ⭐ Using [IntelliJ IDEA](https://www.jetbrains.com/idea) _(recommended)_
1. [Download](https://www.jetbrains.com/toolbox-app), install, and launch the
   JetBrains Toolbox App.  
   Then install and launch **IntelliJ IDEA Ultimate**.

2. In the menu bar, select **Help** › **Edit Custom VM Options**.  
   Insert these lines to increase the maximum heap size, e.g. to 8 GB of RAM:
   ```
   -Xmx8192m
   ```

3. Quit IntelliJ IDEA (<kbd>Alt</kbd><kbd>F4</kbd>).  
   Then install the [Biome](https://plugins.jetbrains.com/plugin/22761-biome)
   plugin:
   ```shell
   idea installPlugins 'com.github.biomejs.intellijbiome'
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

7. [Open](jetbrains://idea/settings?name=Languages+%26+Frameworks--Node.js) the
   Node.js settings of the project:
   ```shell
   Start-Process 'jetbrains://idea/settings?name=Languages+%26+Frameworks--Node.js'
   ```
   Or go to **Settings** (<kbd>Ctrl</kbd><kbd>Alt</kbd><kbd>S</kbd>) › **Languages & Frameworks** › **Node.js**.  
   [Select](https://www.jetbrains.com/help/idea/developing-node-js-applications.html#ws_node_configure_local_node_interpreter)
   **node .nvmrc &rarr; C:\Users\...\nvm\...** as Node interpreter.  
   [Select](https://www.jetbrains.com/help/idea/installing-and-removing-external-software-using-node-package-manager.html#ws_npm_yarn_configure_package_manager)
   **pnpm** as package manager.

### Using [Visual Studio Code](https://code.visualstudio.com)
1. [Download](https://code.visualstudio.com), install, and launch Visual Studio
   Code.

2. [Enable](https://code.visualstudio.com/docs/editor/command-line#_launching-from-command-line)
   launching Visual Studio Code from the terminal:  
   In the menu bar, select **View** › **Command Palette** (<kbd>Ctrl</kbd><kbd>
   Shift</kbd><kbd>P</kbd>).  
   Locate and run **Shell Command: Install 'code' command in PATH**.
   _(it may request elevated privileges)_

3. Quit Visual Studio Code (<kbd>Alt</kbd><kbd>F4</kbd>) and start a new
   terminal.  
   Then install the
   [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
   extension:
   ```shell
   code --install-extension 'biomejs.biome'
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
