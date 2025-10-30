# Yarn Setup Instructions

## Option 1: Using Corepack (Recommended)

Corepack is included with Node.js 16.10+ and manages package manager versions automatically.

### Windows (Run as Administrator)

```powershell
# Open PowerShell as Administrator
corepack enable
corepack prepare yarn@4.5.3 --activate
```

### macOS/Linux

```bash
corepack enable
corepack prepare yarn@4.5.3 --activate
```

## Option 2: Manual Yarn Installation

If you can't run Corepack with admin privileges, install Yarn manually:

### Windows

```powershell
# Using npm (already installed with Node.js)
npm install -g yarn

# Verify installation
yarn --version
```

### macOS

```bash
# Using Homebrew
brew install yarn

# Or using npm
npm install -g yarn
```

### Linux

```bash
# Using npm
npm install -g yarn

# Or using the install script
curl -o- -L https://yarnpkg.com/install.sh | bash
```

## After Installation

Once Yarn is installed, run these commands in the project root:

```bash
# Install all dependencies
yarn install

# Start development servers
yarn dev
```

## Verification

Check that everything is set up correctly:

```bash
# Check Yarn version (should be 4.x or 1.x)
yarn --version

# Check Node version (should be 18.x or higher)
node --version

# List available scripts
yarn run
```

## Troubleshooting

### "yarn: command not found"

**Solution:**
1. Close and reopen your terminal
2. If still not found, add Yarn to PATH:
   - Windows: Add `%USERPROFILE%\.yarn\bin` to PATH
   - macOS/Linux: Add `~/.yarn/bin` to PATH in `.bashrc` or `.zshrc`

### "Cannot find module" errors

**Solution:**
```bash
# Clean install
yarn clean  # Remove node_modules
yarn install  # Reinstall
```

### Permission errors on Windows

**Solution:**
Run PowerShell as Administrator, or use npm instead:
```powershell
npm install -g yarn
```

## Alternative: Use npm Instead

If Yarn installation is problematic, you can use npm (which comes with Node.js):

### Update package.json scripts

The project will work with npm too. Just replace:
- `yarn install` → `npm install`
- `yarn dev` → `npm run dev`
- `yarn build` → `npm run build`

All scripts are compatible with both package managers!

