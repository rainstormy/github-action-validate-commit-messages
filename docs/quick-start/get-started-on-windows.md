# Get started on 🟦 Windows

This guide describes the necessary steps for you to start coding in this
project.

Last updated: July 8, 2025.

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
>
> Recommended tools are marked with ⭐.

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

   ![](assets/powershell-windows.png)

3. Start a new PowerShell session.

4. Define a function to refresh the `PATH` environment variable in the current
   shell session:
   ```shell
   function Refresh-Path { $ENV:PATH = [System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path', 'User') }
   ```

5. Install [jq](https://jqlang.org) and [yq](https://mikefarah.gitbook.io/yq):
   ```shell
   winget install --source winget --exact --id jqlang.jq && `
   winget install --source winget --exact --id MikeFarah.yq && `
   Refresh-Path
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
### Using [1Password](https://1password.com) ⭐
1. [Disable](https://developer.1password.com/docs/ssh/get-started/#step-3-turn-on-the-1password-ssh-agent)
   the OpenSSH Authentication Agent service in Windows:  
   Go to **Services** (<kbd>Win</kbd><kbd>R</kbd> › type `services.msc` › <kbd>
   Enter</kbd>) › **OpenSSH Authentication Agent**.  
   Set the **Startup type** to be _Disabled_.  
   Stop the service if it is currently running.  
   Press **OK**.

   ![](assets/openssh-disabled-windows.png)

2. [Download](https://1password.com/downloads/windows) and install the desktop
   app.

3. [Enable](https://developer.1password.com/docs/ssh/get-started/#step-3-turn-on-the-1password-ssh-agent)
   the SSH agent in 1Password:  
   Go to **Settings** (<kbd>Ctrl</kbd><kbd>,</kbd>) › **Developer** › **Set up
   the SSH agent** › **Use key names**.  
   Press **Set up the SSH agent** again and confirm that the OpenSSH
   Authentication Agent service is disabled.  
   Ensure that **Use the SSH agent** is checked.

   ![](assets/1password-ssh-agent-windows.png)

4. [Install](https://developer.1password.com/docs/cli/get-started/#step-1-install-1password-cli)
   the 1Password CLI:
   ```shell
   winget install --source winget --exact --id AgileBits.1Password.CLI && `
   Refresh-Path
   ```

5. Verify that the installation succeeded:
   ```shell
   op --version # -> 2.31.0 or newer
   ```

6. [Enable](https://developer.1password.com/docs/cli/get-started/#step-2-turn-on-the-1password-desktop-app-integration)
   the CLI integration in 1Password:  
   Go to **Settings** (<kbd>Ctrl</kbd><kbd>,</kbd>) › **Developer**.  
   Ensure that **Integrate with 1Password CLI** is checked.

   ![](assets/1password-cli.png)

7. [Generate](https://developer.1password.com/docs/ssh/manage-keys/#generate-an-ssh-key)
   two SSH keys in your 1Password vault; one to authenticate to GitHub and one
   to sign commits.  
   You may replace 'GitHub authentication key' and 'GitHub signing key' with
   names of your choice:
   ```shell
   $OP_AUTH_KEY_NAME = 'GitHub authentication key'
   ```
   ```shell
   $OP_SIGN_KEY_NAME = 'GitHub signing key'
   ```
   ```shell
   Set-Variable -name GH_AUTH_KEY -value "$( `
     op item get "$OP_AUTH_KEY_NAME" --fields label='public key' 2>$null || `
     op item create --category ssh --title "$OP_AUTH_KEY_NAME" --format json | jq --raw-output '.fields[] | select(.label=="public key") | .value' `
   )" && `
   Set-Variable -name GH_SIGN_KEY -value "$( `
     op item get "$OP_SIGN_KEY_NAME" --fields label='public key' 2>$null || `
     op item create --category ssh --title "$OP_SIGN_KEY_NAME" --format json | jq --raw-output '.fields[] | select(.label=="public key") | .value' `
   )"
   ```

### Using [OpenSSH](https://www.openssh.com)
1. Enable the OpenSSH Authentication Agent service in Windows:  
   Go to **Services** (<kbd>Win</kbd><kbd>R</kbd> › type `services.msc` › <kbd>
   Enter</kbd>) › **OpenSSH Authentication Agent**.  
   Set the **Startup type** to be _Automatic_.  
   Start the service if it is not running.  
   Press **OK**.

   ![](assets/openssh-enabled-windows.png)

2. [Generate](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
   an SSH key to authenticate to GitHub.  
   You may replace 'id_github_auth' with a name of your choice and enter a
   passphrase to protect the key:
   ```shell
   $SSH_AUTH_KEY_FILENAME = 'id_github_auth'
   ```
   ```shell
   New-Item -Path ~\.ssh -ItemType Directory -Force && `
   Add-Content -Path ~\.ssh\config -Value "Host github.com`n  AddKeysToAgent yes`n  IdentityFile ~/.ssh/$SSH_AUTH_KEY_FILENAME" && `
   ssh-keygen -t ed25519 -f "$HOME\.ssh\$SSH_AUTH_KEY_FILENAME" && `
   ssh-add "$HOME\.ssh\$SSH_AUTH_KEY_FILENAME" && `
   Set-Variable -name GH_AUTH_KEY -value "$(Get-Content "$HOME\.ssh\$SSH_AUTH_KEY_FILENAME.pub")"
   ```

3. Generate an SSH key to sign commits.  
   You may replace 'id_github_sign' with a name of your choice and enter a
   passphrase to protect the key:
   ```shell
   $SSH_SIGN_KEY_FILENAME = 'id_github_sign'
   ```
   ```shell
   ssh-keygen -t ed25519 -f "$HOME\.ssh\$SSH_SIGN_KEY_FILENAME" && `
   ssh-add "$HOME\.ssh\$SSH_SIGN_KEY_FILENAME" && `
   Set-Variable -name GH_SIGN_KEY -value "$(Get-Content "$HOME\.ssh\$SSH_SIGN_KEY_FILENAME.pub")"
   ```

> [!CAUTION]  
> The SSH keys are stored locally in the `~\.ssh` directory and must be
> transferred manually to other computers.

## 🟦 3. Install [Git](https://git-scm.com) and [GitHub CLI](https://cli.github.com)
1. Install Git and the GitHub CLI:  
   _(it may request elevated privileges)_
   ```shell
   winget install --source winget --exact --id Git.Git && `
   winget install --source winget --exact --id GitHub.cli && `
   Refresh-Path
   ```

2. Verify that both installations succeeded:
   ```shell
   git --version # -> 2.50.0 or newer
   ```
   ```shell
   gh --version # -> 2.74.0 or newer
   ```

3. [Add](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints)
   the public SSH key of `github.com` to the list of known hosts:
   ```shell
   Add-Content -Path ~\.ssh\known_hosts -Value 'github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl'
   ```

4. [Create](https://cli.github.com/manual/gh_auth_login) an access token that
   grants the GitHub CLI access to your SSH keys.  
   Choose **GitHub.com** and **SSH** as the preferred protocol and skip SSH key
   generation.  
   Then copy the one-time code and trigger the web-based authentication flow on
   github.com:
   ```shell
   gh auth login --scopes admin:public_key,admin:ssh_signing_key
   ```

5. [Add](https://cli.github.com/manual/gh_ssh-key_add) the SSH keys to your
   GitHub account.  
   You may replace 'Rainstorm authentication key' and 'Rainstorm signing key'
   with names of your choice:
   ```shell
   $GH_AUTH_KEY_NAME = 'Rainstorm authentication key'
   ```
   ```shell
   $GH_SIGN_KEY_NAME = 'Rainstorm signing key'
   ```
   ```shell
   $GH_AUTH_KEY | gh ssh-key add - --title "$GH_AUTH_KEY_NAME" && `
   $GH_SIGN_KEY | gh ssh-key add - --title "$GH_SIGN_KEY_NAME" --type signing
   ```

6. [Revoke](https://cli.github.com/manual/gh_auth_refresh) the access to your
   SSH keys from the GitHub CLI.  
   Copy the one-time code and trigger the web-based authentication flow on
   github.com:
   ```shell
   gh auth refresh --remove-scopes admin:public_key,admin:ssh_signing_key
   ```

7. [Specify](https://github.com/settings/profile) your full name (first and last
   names) in your GitHub profile.

8. Declare your identity using your GitHub profile name and noreply email
   address:
   ```shell
   $GH_USER = "$(gh api user)" && `
   git config --global user.name "$($GH_USER | jq --raw-output 'if (.name | test("^\\p{Lu}.*\\s")) then .name else error("Full name must contain at least two words where the first word starts with a capital letter") end')" && `
   git config --global user.email "$($GH_USER | jq --raw-output '"\(.id)+\(.login)@users.noreply.github.com"')"
   ```

9. [Sign](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification)
   your commits to make GitHub display
   a <span style="border: 1px green solid; border-radius: 4rem; color: green; font-size: smaller; font-weight: bold; padding: 0.25rem 0.5rem;">
   Verified</span> badge next to your commits:
   ```shell
   git config --global core.sshCommand 'C:/Windows/System32/OpenSSH/ssh.exe' && `
   git config --global user.signingkey "$GH_SIGN_KEY" && `
   git config --global gpg.format ssh && `
   git config --global commit.gpgsign true && `
   git config --global tag.gpgsign true
   ```

10. Enable autosquash suggestions when you rebase interactively:
    ```shell
    git config --global rebase.autosquash true
    ```

## 🟦 4. Prepare your workspace
1. [Install](https://mise.jdx.dev/getting-started.html) mise-en-place and
   activate it in the shell:
   ```shell
   winget install --source winget --exact --id jdx.mise && `
   Refresh-Path && `
   New-Item -Path (Split-Path -Parent "$PROFILE") -ItemType Directory -Force && `
   Add-Content -Path "$PROFILE" -Value 'mise activate pwsh | Out-String | Invoke-Expression' && `
   mise activate pwsh | Out-String | Invoke-Expression
   ```

2. Verify that the installation succeeded:
   ```shell
   mise --version # -> 2025.7.0 or newer
   ```

3. Clone the repository into the directory in which you keep your workspaces.  
   Specify the path to your workspace directory:
   ```shell
   $WORKSPACE_ROOT = "$HOME\repositories\rainstormy\"
   ```
   ```shell
   Set-Variable -name REPOSITORY_URL -value 'git@github.com:rainstormy/github-action-validate-commit-messages.git' && `
   Set-Variable -name DESTINATION_PATH -value "$(Join-Path "$WORKSPACE_ROOT" "$((Split-Path "$REPOSITORY_URL" -Leaf) -Replace '\.git$','')")" && `
   git clone "$REPOSITORY_URL" "$DESTINATION_PATH" && `
   Set-Location "$DESTINATION_PATH"
   ```

4. Mark the project configuration as trusted:
   ```shell
   mise trust
   ```

5. Install the tools required by the project (including Node.js and pnpm):
   ```shell
   mise install
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

8. Install the Node.js packages required by the project and enable its Git
   hooks:
   ```shell
   mise run init
   ```

> [!IMPORTANT]  
> If `pnpm --version` reports an unexpected version, e.g. `9.15.1` or older, it
> may be installed globally via Corepack or npm. Try uninstalling it:
>
> ```shell
> corepack disable && npm uninstall --global pnpm
> ```

## 🟦 5. Install an IDE
### Using [IntelliJ IDEA](https://www.jetbrains.com/idea) ⭐
1. [Download](https://www.jetbrains.com/toolbox-app), install, and launch the
   JetBrains Toolbox App.  
   Sign in with your JetBrains account.  
   Then install and launch **IntelliJ IDEA Ultimate**.

2. From the welcome screen, select ⚙️ › **Edit Custom VM Options**.  
   Increase the memory limit, e.g. to 8 GB of RAM:
   ```
   -Xmx8192m
   ```

<mark>TODO: Verify</mark>
3. Quit IntelliJ IDEA (<kbd>Alt</kbd><kbd>F4</kbd>).  
   Then install the recommended plugins:
   ```shell
   idea installPlugins $(yq --output-format=csv '.project.component.plugin[]."+@id"' .idea/externalDependencies.xml)
   ```

4. [Use](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration#_basic_client_configuration)
   IntelliJ IDEA as the default editor in Git to edit commit messages and
   conduct interactive rebases:
   ```shell
   git config --global core.editor 'idea --wait'
   ```

5. Open the project in IntelliJ IDEA.  
   Mark the plugins and the workspace as trusted:
    ```shell
    idea .
    ```

6. You're all set &mdash; let the coding begin!

### Using [Visual Studio Code](https://code.visualstudio.com)
1. [Download](https://code.visualstudio.com), install, and launch Visual Studio
   Code.

<mark>TODO: Verify</mark>
2. [Enable](https://code.visualstudio.com/docs/editor/command-line#_launching-from-command-line)
   launching Visual Studio Code from the terminal:  
   In the menu bar, select **View** › **Command Palette** (<kbd>Ctrl</kbd><kbd>
   Shift</kbd><kbd>P</kbd>).  
   Locate and run **Shell Command: Install 'code' command in PATH**.
   _(it may request elevated privileges)_

<mark>TODO: Verify</mark>
3. Quit Visual Studio Code (<kbd>Alt</kbd><kbd>F4</kbd>).  
   Then install the recommended extensions:
   ```shell
   code $(jq --raw-output '.recommendations[] | "--install-extension " + .' .vscode/extensions.json)
   ```

4. [Use](https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration#_basic_client_configuration)
   Visual Studio Code as the default editor in Git to edit commit messages and
   conduct interactive rebases:
   ```shell
   git config --global core.editor 'code --wait'
   ```

5. Open the project in Visual Studio Code:  
   _(it may prompt you to trust the project directory)_
   ```shell
   code .
   ```

6. Open any TypeScript file (`.ts` or `.tsx`) and allow using the TypeScript
   version specified for the workspace.

7. You're all set &mdash; let the coding begin!
