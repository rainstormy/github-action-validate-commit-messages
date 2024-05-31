# Get started on 🍏 macOS

### 🍏 Install 1Password
[1Password](https://developer.1password.com/docs/ssh/manage-keys) is a password
manager with a built-in SSH agent.

1. [Download and install](https://1password.com/downloads/mac) the 1Password
   desktop app.

2. [Enable](https://developer.1password.com/docs/ssh/get-started/#step-3-turn-on-the-1password-ssh-agent)
   the SSH agent in 1Password: Go to **Settings** (<kbd>⌘ Cmd</kbd><kbd>,
   Comma</kbd>) > **Developer** and select **Use the SSH agent**.

3. [Instruct](https://developer.1password.com/docs/ssh/get-started/#step-4-configure-your-ssh-or-git-client)
   the SSH client to use the SSH agent in 1Password:
   ```shell
   mkdir -p ~/.1password && \
   ln -s ~/Library/Group\ Containers/2BUA8C4S2C.com.1password/t/agent.sock ~/.1password/agent.sock && \
   mkdir -p ~/.ssh && \
   echo -e "Host *\n  IdentityAgent ~/.1password/agent.sock" >> ~/.ssh/config
   ```

4. [Add a new item](https://developer.1password.com/docs/ssh/get-started#step-1-generate-an-ssh-key)
   of the SSH key type in your personal vault in 1Password.

5. Generate a public-private key pair with the _Ed25519_ algorithm.

6. [Upload](https://github.com/settings/ssh/new) the public key to GitHub as an
   authentication key and also as a signing key for your Git commits.
   It appears like `ssh-ed25519 AAAAC3(...)`.

> [!NOTE]  
> [To generate](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
> a public-private key pair with OpenSSH instead of 1Password:
> ```shell
> mkdir -p ~/.ssh && \
> ssh-keygen -t ed25519 -f "$HOME/.ssh/id_ed25519" && \
> ssh-add --apple-use-keychain ~/.ssh/id_ed25519 && \
> echo -e "Host github.com\n  AddKeysToAgent yes\n  UseKeychain yes\n  IdentityFile ~/.ssh/id_ed25519" >> ~/.ssh/config && \
> cat ~/.ssh/id_ed25519.pub
> ```

### 🍏 Install Homebrew
[Homebrew](https://brew.sh) is a community-driven package manager.

1. Run the installation script:
   ```shell
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Follow the instructions that appear when the script completes to enable
   the `brew` command.

> [!TIP]  
> To upgrade all installed packages:
> ```shell
> brew update && brew upgrade
> ```

### 🍏 Install Git
[Git](https://git-scm.com) is a version control system.

1. Install Git via Homebrew:
   ```shell
   brew install git
   ```

2. [Obtain](https://github.com/settings/emails) your noreply email address on
   GitHub. It appears like `<id>+<username>@users.noreply.github.com`.

3. Declare your identity (fill in the `<placeholders>` accordingly):
   ```shell
   git config --global user.name "<FirstName> <LastName>" && \
   git config --global user.email "<id>+<username>@users.noreply.github.com"
   ```

4. [Instruct](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification)
   Git to sign your commits with the public SSH key from your personal vault in
   1Password (fill in the `<placeholders>` accordingly):
   ```shell
   git config --global user.signingkey "ssh-ed25519 AAAAC3<PublicKey>" && \
   git config --global gpg.format "ssh" && \
   git config --global commit.gpgsign "true" && \
   git config --global tag.gpgsign "true"
   ```
   GitHub will display a _Verified_ badge next to your signed commits.

5. _(optional)_ Enable autosquash suggestions from Git when you rebase
   interactively:
   ```shell
   git config --global rebase.autosquash "true"
   ```

6. _(optional)_ Conduct interactive rebases in IntelliJ IDEA or Visual Studio
   Code, respectively:
   ```shell
   git config --global core.editor "idea --wait"
   ```
   ```shell
   git config --global core.editor "code --wait"
   ```

### 🍏 Install GitHub CLI _(optional)_
[GitHub CLI](https://cli.github.com) lets you interact with GitHub from the
terminal if you prefer this.

1. Install GitHub CLI via Homebrew:
   ```shell
   brew install gh
   ```

2. Sign in to GitHub using the web-based authentication flow:
   ```shell
   gh auth login
   ```

### 🍏 Install Node.js and pnpm
[Node.js](https://nodejs.org) is a JavaScript runtime.
[pnpm](https://pnpm.io) is a fast and feature-rich package manager alternative
to npm.

1. [Install](https://github.com/nvm-sh/nvm) nvm:
   ```shell
   curl https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
   ```

2. Start a new terminal session.
   [Install](https://github.com/nvm-sh/nvm?tab=readme-ov-file#nvmrc) Node.js via
   nvm, which automatically infers the version to install from `.nvmrc`:
   ```shell
   nvm install
   ```

3. [Install](https://pnpm.io/installation#using-corepack) pnpm via Corepack in
   Node.js, which automatically infers the version to install
   from `package.json`:
   ```shell
   corepack enable
   ```

### 🍏 Install IntelliJ IDEA _(optional)_
1. [Download and install](https://www.jetbrains.com/toolbox-app) the JetBrains
   Toolbox App.

2. Install **IntelliJ IDEA Ultimate** (or **WebStorm**) via the JetBrains
   Toolbox App. Open IntelliJ IDEA once the installation is complete.

3. Configure the JVM options.
   1. On the Welcome screen, select ⚙️ (**Options**) > **Edit Custom VM 
      Options**. Alternatively, from the menu bar, select **Help** > **Edit 
      Custom VM Options**.
   2. Add or modify the `-Xmx` line to increase the maximum heap size, for
      example to 8 GB of RAM:
      ```
      -Xmx8192m
      ```
   3. _(optional)_ Disable mnemonics to avoid conflicts with macOS keyboard
      shortcuts:
      ```
      ide.mac.alt.mnemonic.without.ctrl=false
      ```

4. Quit IntelliJ IDEA (<kbd>⌘ Cmd</kbd><kbd>Q</kbd>). Install the following
   plugins:
   - [Biome](https://plugins.jetbrains.com/plugin/22761-biome).
   ```shell
   idea installPlugins \
     "com.github.biomejs.intellijbiome"
   ```

### 🍏 Install Visual Studio Code _(optional)_
1. [Download and install](https://code.visualstudio.com) Visual Studio Code.
   Open Visual Studio Code once the installation is complete.

2. Select **View** > **Command Palette** (<kbd>⇧ Shift</kbd><kbd>⌘
   Cmd</kbd><kbd>P</kbd>). Locate and run **Shell Command: Install 'code'
   command in PATH**. Note that Visual Studio Code will request elevated
   privileges.

3. Quit Visual Studio Code (<kbd>⌘ Cmd</kbd><kbd>Q</kbd>). Install the following
   plugins:
   - [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome).
   ```shell
   code --install-extension "biomejs.biome"
   ```

### 🍏 Clone the repository
1. Clone the repository into the directory in which you keep your workspaces,
   for example:
   ```shell
   git clone git@github.com:rainstormy/github-action-validate-commit-messages.git ~/repositories/rainstormy/
   ```

2. Go to the project root directory, for example:
   ```shell
   cd ~/repositories/rainstormy/github-action-validate-commit-messages/
   ```

3. Install third-party dependencies and Git hooks:
   ```shell
   pnpm install
   ```

4. Open the project in IntelliJ IDEA or Visual Studio Code, respectively:
   ```shell
   idea .
   ```
   ```shell
   code .
   ```
