# Get started on 🟦 Windows + 🐧 WSL

> [!IMPORTANT]  
> For 🟦 sections, complete the steps on the Windows host machine.  
> For 🐧 sections, complete the steps in the Ubuntu terminal on WSL.

### 🟦 Install 1Password
[1Password](https://developer.1password.com/docs/ssh/manage-keys) is a password
manager with a built-in SSH agent.

1. [Download and install](https://1password.com/downloads/windows) the 1Password
   desktop app.

2. [Enable](https://developer.1password.com/docs/ssh/get-started/#step-3-turn-on-the-1password-ssh-agent)
   the SSH agent in 1Password: Go to **Settings** (<kbd>Ctrl</kbd><kbd>,
   Comma</kbd>) > **Developer** and select **Use the SSH agent**.

3. [Add a new item](https://developer.1password.com/docs/ssh/get-started#step-1-generate-an-ssh-key)
   of the SSH key type in your personal vault in 1Password.

4. Generate a public-private key pair with the _Ed25519_ algorithm.

5. [Upload](https://github.com/settings/ssh/new) the public key to GitHub as an
   authentication key and also as a signing key for your Git commits. It appears
   like `ssh-ed25519 AAAAC3(...)`.

> [!NOTE]  
> [To generate](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
> a public-private key pair with OpenSSH instead of 1Password:
> ```shell
> mkdir -p ~/.ssh && \
> ssh-keygen -t ed25519 -f "$HOME/.ssh/id_ed25519" && \
> ssh-add ~/.ssh/id_ed25519 && \
> cat ~/.ssh/id_ed25519.pub
> ```

### 🟦 Install Ubuntu on WSL
[Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/about)
is a platform for running Linux environments on Windows.

1. Enable WSL 2:
   ```powershell
   wsl --set-default-version 2
   ```

2. Install Ubuntu as the default distribution:
   ```powershell
   wsl --install "Ubuntu" && `
   wsl --setdefault "Ubuntu"
   ```

3. Create a WSL configuration file on the Windows host machine:
   ```powershell
   echo "[wsl2]`nguiApplications=false" >> ~\.wslconfig
   ```
   This helps to reduce input latency in the Ubuntu terminal on WSL.

> [!TIP]  
> To reboot Ubuntu on WSL:
> ```powershell
> wsl --shutdown
> ```

### 🐧 Configure WSL
1. Allow WSL to access the file system on the Windows host machine:
   ```shell
   echo -e "[boot]\nsystemd=true\n\n[interop]\nappendWindowsPath=true\nenabled=true" | sudo tee /etc/wsl.conf > /dev/null
   ```

### 🐧 Install Zsh _(optional)_
[Zsh](https://www.zsh.org) is a Unix shell and a powerful alternative to Bash.

1. Install Zsh via APT:
   ```shell
   sudo apt update && \
   sudo apt install zsh
   ```

2. Set Zsh as the default shell:
   ```shell
   chsh -s $(which zsh)
   ```

> [!TIP]  
> To upgrade Zsh:
> ```shell
> sudo apt update && sudo apt install zsh
> ```

### 🐧 Install Git
1. Install Git via APT:
   ```shell
   sudo add-apt-repository ppa:git-core/ppa && \
   sudo apt update && \
   sudo apt install git
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
   1Password or OpenSSH (fill in the `<placeholders>` accordingly):
   ```shell
   git config --global user.signingkey "ssh-ed25519 AAAAC3<PublicKey>" && \
   git config --global gpg.format "ssh" && \
   git config --global commit.gpgsign "true" && \
   git config --global tag.gpgsign "true"
   git config --global core.sshCommand "ssh.exe" && \
   echo -e 'eval "$(ssh-agent -s)" > /dev/null\nalias ssh="ssh.exe"\nalias ssh-add="ssh-add.exe"' >> ~/.zshrc
   ```
   GitHub will display a _Verified_ badge next to your signed commits.

5. _(skip if using OpenSSH)_ Instruct Git to use 1Password as the SSH agent for
   signing commits (fill in the `<placeholders>` accordingly):
   ```shell
   git config --global gpg.ssh.program "/mnt/c/Users/<username>/AppData/Local/1Password/app/8/op-ssh-sign.exe"
   ```

6. _(optional)_ Enable autosquash suggestions from Git when you rebase
   interactively:
   ```shell
   git config --global rebase.autosquash true
   ```

7. _(optional)_ Conduct interactive rebases in IntelliJ IDEA or Visual Studio
   Code, respectively:
   ```shell
   git config --global core.editor "idea --wait"
   ```
   ```shell
   git config --global core.editor "code --wait"
   ```

> [!TIP]  
> To upgrade Git:
> ```shell
> sudo apt update && sudo apt install git
> ```

### 🐧 Install GitHub CLI _(optional)_
[GitHub CLI](https://cli.github.com) lets you interact with GitHub from the
terminal if you prefer this.

1. [Install](https://github.com/cli/cli/blob/trunk/docs/install_linux.md) GitHub
   CLI via APT:
   ```shell
   sudo mkdir -p -m 755 /etc/apt/keyrings && \
   wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null && \
   sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg && \
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null && \
   sudo apt update && \
   sudo apt install gh -y
   ```

2. Sign in to GitHub using the web-based authentication flow:
   ```shell
   gh auth login
   ```

> [!TIP]  
> To upgrade GitHub CLI:
> ```shell
> sudo apt update && sudo apt install gh
> ```

### 🐧 Install Node.js and pnpm
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

### 🟦 Install IntelliJ IDEA _(optional)_
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

4. Exit IntelliJ IDEA (<kbd>Alt</kbd><kbd>F4</kbd>). Install the following
   plugins:
   - [Biome](https://plugins.jetbrains.com/plugin/22761-biome).
   ```powershell
   idea installPlugins `
     "com.github.biomejs.intellijbiome"
   ```

### 🐧 Install IntelliJ IDEA command-line launcher _(optional)_
1. Add an alias to IntelliJ IDEA on the Windows host machine (fill in
   the `<placeholders>` accordingly):
   ```shell
   echo 'alias idea="/mnt/c/Users/<username>/AppData/Local/Programs/IntelliJ\ IDEA\ Ultimate/bin/idea64.exe"' >> ~/.zshrc
   ```

### 🟦 Install Visual Studio Code _(optional)_
1. [Download and install](https://code.visualstudio.com) Visual Studio Code.

2. Start a new terminal session. Install the following plugins:
   - [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome).
   - [WSL](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl).
   ```powershell
   code --install-extension "biomejs.biome" && `
   code --install-extension "ms-vscode-remote.remote-wsl"
   ```

### 🐧 Clone the repository
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
