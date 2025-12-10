# Security Setup Guide - UpLove Project

## Table of Contents
1. [Initial Project Security Setup](#initial-project-security-setup)
2. [NPM Configuration](#npm-configuration)
3. [Git Security](#git-security)
4. [Development Environment](#development-environment)
5. [CI/CD Security](#cicd-security)
6. [Monitoring & Detection](#monitoring--detection)
7. [Incident Response](#incident-response)
8. [Daily Security Practices](#daily-security-practices)

---

## Initial Project Security Setup

### Step 1: Secure Your Environment

```bash
# Update npm to latest version
npm install -g npm@latest

# Enable 2FA on your npm account (CRITICAL)
npm profile enable-2fa auth-and-writes

# Verify npm registry
npm config get registry
# Should output: https://registry.npmjs.org/
```

### Step 2: Clean Installation

```bash
# Remove existing node_modules if you're concerned
rm -rf node_modules

# Clean install from lock file (guarantees exact versions)
npm ci

# Run security audit
npm audit

# Fix high-severity issues automatically
npm audit fix --only=prod
```

---

## NPM Configuration

### Create `.npmrc` File

Create `.npmrc` in your project root with the following settings:

```bash
# .npmrc - Project Security Configuration

# ===== Registry Security =====
# Use only official npm registry
registry=https://registry.npmjs.org/

# ===== Installation Security =====
# Require package-lock.json to be present and up to date
package-lock=true

# Don't automatically run lifecycle scripts (prevents preinstall attacks)
ignore-scripts=true

# Don't save packages with ^ or ~ version ranges (use exact versions)
save-exact=true

# ===== Download Security =====
# Verify package signatures
audit=true

# Set audit level (fail on moderate or higher vulnerabilities)
audit-level=moderate

# ===== Development Settings =====
# Don't update package.json when installing
save=false

# Use legacy peer dependencies resolution to avoid conflicts
legacy-peer-deps=false

# ===== Engine Strict =====
# Fail if Node/npm version doesn't match package.json
engine-strict=true
```

### Add `.npmrc` to Git

```bash
git add .npmrc
git commit -m "security: add npm security configuration"
```

### Update `package.json` with Engine Requirements

Add to your `package.json`:

```json
{
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
```

---

## Git Security

### Step 1: Configure Git Hooks

Create `.githooks/pre-commit`:

```bash
#!/bin/bash
# Pre-commit hook to detect malware signatures

echo "🔍 Running security checks..."

# Check for Shai-Hulud signatures
if find . -name "setup_bun.js" -o -name "bun_environment.js" 2>/dev/null | grep -q .; then
    echo "❌ ERROR: Malicious files detected (setup_bun.js or bun_environment.js)"
    exit 1
fi

# Check for malicious patterns in code
if grep -r "Sha1-Hulud\|Shai-Hulud\|The Second Coming" . --exclude-dir=node_modules --exclude-dir=.git 2>/dev/null | grep -q .; then
    echo "❌ ERROR: Malicious code patterns detected"
    exit 1
fi

# Check for suspicious preinstall scripts in dependencies
if grep -r '"preinstall"' node_modules/*/package.json 2>/dev/null | grep -v "node_modules/.bin" | grep -q .; then
    echo "⚠️  WARNING: Packages with preinstall scripts detected"
    echo "Review these packages carefully:"
    grep -r '"preinstall"' node_modules/*/package.json 2>/dev/null | grep -v "node_modules/.bin"
    read -p "Continue with commit? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Run npm audit
echo "🔒 Running npm audit..."
if ! npm audit --audit-level=high; then
    echo "❌ ERROR: High or critical vulnerabilities found"
    echo "Run 'npm audit fix' to resolve issues"
    exit 1
fi

echo "✅ Security checks passed"
exit 0
```

### Step 2: Enable Git Hooks

```bash
# Make the hook executable
chmod +x .githooks/pre-commit

# Configure git to use custom hooks directory
git config core.hooksPath .githooks

# Add hooks to repository
git add .githooks/
git commit -m "security: add pre-commit security hooks"
```

### Step 3: Protect Sensitive Files

Create/update `.gitignore`:

```bash
# Dependencies
node_modules/
package-lock.json.backup

# Environment variables (NEVER commit these)
.env
.env.local
.env.*.local

# Sensitive files
*.key
*.pem
*.p12
*.keystore
credentials.json
secrets.json

# Build outputs
dist/
build/
.expo/
.expo-shared/

# IDE
.vscode/settings.json
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/
```

---

## Development Environment

### Step 1: Install Security Tools

```bash
# Install Snyk for vulnerability scanning
npm install -g snyk

# Authenticate with Snyk
snyk auth

# Install Socket.dev CLI for supply chain security
npm install -g @socketsecurity/cli

# Install npm-check for dependency updates
npm install -g npm-check
```

### Step 2: Create Security Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint",

    "security:audit": "npm audit --audit-level=moderate",
    "security:scan": "snyk test",
    "security:check-malware": "find . -name 'setup_bun.js' -o -name 'bun_environment.js' && echo 'Malware detected!' || echo 'No malware found'",
    "security:check-preinstall": "grep -r '\"preinstall\"' node_modules/*/package.json 2>/dev/null | grep -v 'node_modules/.bin' || echo 'No suspicious preinstall scripts'",
    "security:full": "npm run security:audit && npm run security:check-malware && npm run security:check-preinstall",
    "security:monitor": "snyk monitor",

    "deps:check": "npm outdated",
    "deps:update-interactive": "npm-check -u",

    "postinstall": "npm run security:full"
  }
}
```

### Step 3: VSCode Security Settings

Create `.vscode/settings.json`:

```json
{
  "files.exclude": {
    "**/node_modules": false
  },
  "search.exclude": {
    "**/node_modules": false
  },
  "files.watcherExclude": {
    "**/node_modules/**": true
  },
  "npm.packageManager": "npm",
  "npm.enableScriptExplorer": true,
  "security.workspace.trust.enabled": true,
  "security.workspace.trust.startupPrompt": "always",
  "terminal.integrated.inheritEnv": false
}
```

---

## CI/CD Security

### GitHub Actions Workflow

Create `.github/workflows/security.yml`:

```yaml
name: Security Checks

on:
  push:
    branches: [ master, main, develop ]
  pull_request:
    branches: [ master, main, develop ]
  schedule:
    # Run daily at 2 AM UTC
    - cron: '0 2 * * *'

jobs:
  security-audit:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Verify package-lock.json
        run: |
          if [ ! -f package-lock.json ]; then
            echo "ERROR: package-lock.json not found"
            exit 1
          fi

      - name: Clean install dependencies
        run: npm ci

      - name: Run npm audit
        run: npm audit --audit-level=moderate
        continue-on-error: false

      - name: Check for Shai-Hulud malware
        run: |
          echo "Scanning for malware signatures..."

          # Check for malicious files
          if find . -name "setup_bun.js" -o -name "bun_environment.js" | grep -q .; then
            echo "ERROR: Malicious files detected!"
            exit 1
          fi

          # Check for malicious patterns
          if grep -r "Sha1-Hulud\|Shai-Hulud\|The Second Coming" . --exclude-dir=node_modules --exclude-dir=.git 2>/dev/null | grep -q .; then
            echo "ERROR: Malicious code patterns detected!"
            exit 1
          fi

          echo "No malware signatures found"

      - name: Check for suspicious preinstall scripts
        run: |
          echo "Checking for suspicious lifecycle scripts..."
          PREINSTALL_COUNT=$(grep -r '"preinstall"' node_modules/*/package.json 2>/dev/null | grep -v "node_modules/.bin" | wc -l || echo "0")

          if [ "$PREINSTALL_COUNT" -gt 0 ]; then
            echo "WARNING: Found $PREINSTALL_COUNT packages with preinstall scripts"
            grep -r '"preinstall"' node_modules/*/package.json 2>/dev/null | grep -v "node_modules/.bin"
          else
            echo "No suspicious preinstall scripts found"
          fi

      - name: Snyk Security Scan
        uses: snyk/actions/node@master
        continue-on-error: true
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      - name: Upload Snyk results
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: snyk.sarif

  dependency-review:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Dependency Review
        uses: actions/dependency-review-action@v4
        with:
          fail-on-severity: moderate
          deny-licenses: GPL-3.0, AGPL-3.0
```

### Setup Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add `SNYK_TOKEN`:
   - Get token from https://app.snyk.io/account
   - Click "New repository secret"
   - Name: `SNYK_TOKEN`
   - Value: [your-snyk-token]

---

## Monitoring & Detection

### Step 1: Automated Monitoring

```bash
# Enable Snyk continuous monitoring
snyk monitor

# Schedule regular checks (add to cron)
crontab -e

# Add this line (runs security check every 6 hours)
0 */6 * * * cd /path/to/UpLove/app/UpLove && npm run security:full
```

### Step 2: Manual Inspection Routine

Create `scripts/security-check.sh`:

```bash
#!/bin/bash

echo "======================================="
echo "   UpLove Security Check"
echo "======================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: Malicious files
echo "🔍 Checking for malicious files..."
if find . -name "setup_bun.js" -o -name "bun_environment.js" 2>/dev/null | grep -q .; then
    echo -e "${RED}❌ CRITICAL: Malicious files detected!${NC}"
    find . -name "setup_bun.js" -o -name "bun_environment.js"
    exit 1
else
    echo -e "${GREEN}✅ No malicious files found${NC}"
fi
echo ""

# Check 2: Malicious patterns
echo "🔍 Checking for malicious code patterns..."
if grep -r "Sha1-Hulud\|Shai-Hulud\|The Second Coming" . --exclude-dir=node_modules --exclude-dir=.git 2>/dev/null | grep -q .; then
    echo -e "${RED}❌ CRITICAL: Malicious code patterns detected!${NC}"
    exit 1
else
    echo -e "${GREEN}✅ No malicious patterns found${NC}"
fi
echo ""

# Check 3: Package modifications
echo "🔍 Checking package-lock.json integrity..."
LOCK_MTIME=$(stat -c %Y package-lock.json 2>/dev/null || stat -f %m package-lock.json 2>/dev/null)
CURRENT_TIME=$(date +%s)
DIFF=$((CURRENT_TIME - LOCK_MTIME))
HOURS=$((DIFF / 3600))

if [ $HOURS -lt 24 ]; then
    echo -e "${YELLOW}⚠️  package-lock.json was modified ${HOURS} hours ago${NC}"
    echo "   Recent changes detected - verify this was intentional"
else
    echo -e "${GREEN}✅ No recent package-lock.json changes${NC}"
fi
echo ""

# Check 4: npm audit
echo "🔍 Running npm audit..."
if npm audit --audit-level=moderate > /dev/null 2>&1; then
    echo -e "${GREEN}✅ No vulnerabilities found${NC}"
else
    echo -e "${YELLOW}⚠️  Vulnerabilities detected - run 'npm audit' for details${NC}"
fi
echo ""

# Check 5: Preinstall scripts
echo "🔍 Checking for preinstall scripts..."
PREINSTALL_COUNT=$(grep -r '"preinstall"' node_modules/*/package.json 2>/dev/null | grep -v "node_modules/.bin" | wc -l || echo "0")
if [ "$PREINSTALL_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found ${PREINSTALL_COUNT} packages with preinstall scripts${NC}"
    grep -r '"preinstall"' node_modules/*/package.json 2>/dev/null | grep -v "node_modules/.bin" | sed 's/node_modules\//  - /g' | sed 's/\/package.json.*//g'
else
    echo -e "${GREEN}✅ No suspicious preinstall scripts${NC}"
fi
echo ""

# Check 6: Outdated dependencies
echo "🔍 Checking for outdated dependencies..."
OUTDATED=$(npm outdated --json 2>/dev/null)
if [ "$OUTDATED" = "{}" ] || [ -z "$OUTDATED" ]; then
    echo -e "${GREEN}✅ All dependencies up to date${NC}"
else
    echo -e "${YELLOW}⚠️  Some dependencies are outdated - run 'npm outdated' for details${NC}"
fi
echo ""

echo "======================================="
echo -e "${GREEN}   Security check complete!${NC}"
echo "======================================="
```

Make it executable:

```bash
chmod +x scripts/security-check.sh
```

---

## Incident Response

### If You Suspect Infection

#### Immediate Actions (Within 5 Minutes)

```bash
# 1. DISCONNECT FROM NETWORK IMMEDIATELY
# Disable WiFi or unplug ethernet cable

# 2. Take inventory of what's running
ps aux | grep node
lsof -i -P -n | grep LISTEN

# 3. Kill suspicious processes
killall -9 node

# 4. Backup current state for forensics
cp -r node_modules node_modules.infected.backup
cp package-lock.json package-lock.json.infected.backup
```

#### Investigation (Next 30 Minutes)

```bash
# 1. Search for malicious files
find . -name "setup_bun.js" -o -name "bun_environment.js"

# 2. Search for data exfiltration
grep -r "github.com.*Sha1-Hulud\|Shai-Hulud" .

# 3. Check recent file modifications
find . -type f -mtime -1 -ls

# 4. Check git history for unauthorized changes
git log --all --since="1 week ago" --pretty=format:"%h %an %ad %s"

# 5. Check for unauthorized GitHub repos
# Visit: https://github.com/settings/repositories
# Look for repos with "Sha1-Hulud: The Second Coming" description
```

#### Remediation (Next 2 Hours)

```bash
# 1. Rotate ALL credentials
# - GitHub personal access tokens
# - npm tokens
# - AWS/GCP/Azure credentials
# - API keys
# - SSH keys
# - Database passwords

# 2. Check for leaked secrets
# Visit GitHub repos you own and search for exposed credentials

# 3. Clean installation
rm -rf node_modules package-lock.json
npm cache clean --force
npm ci

# 4. Verify clean state
npm run security:full

# 5. Update all dependencies
npm update
npm audit fix

# 6. Reconnect to network and monitor
# Watch for unusual network activity
```

#### Reporting

```bash
# Report to:
# 1. npm security: security@npmjs.com
# 2. GitHub security: https://github.com/security/advisories
# 3. Your organization's security team
# 4. Affected package maintainers
```

---

## Daily Security Practices

### Every Day

- [ ] Run security check before starting work:
  ```bash
  npm run security:full
  ```

- [ ] Review git status for unexpected changes:
  ```bash
  git status
  git diff
  ```

### Before Installing New Packages

- [ ] Research the package:
  ```bash
  npm info <package-name>
  npm info <package-name> maintainers
  ```

- [ ] Check package reputation:
  - Visit npmjs.com/package/<package-name>
  - Check weekly downloads
  - Review recent version history
  - Read GitHub issues and PRs

- [ ] Install one package at a time:
  ```bash
  npm install <package-name>
  npm run security:full
  git diff package.json package-lock.json
  ```

### Weekly

- [ ] Run full security scan:
  ```bash
  npm run security:scan
  ```

- [ ] Check for outdated dependencies:
  ```bash
  npm outdated
  ```

- [ ] Review GitHub security alerts:
  - Visit: https://github.com/your-org/UpLove/security

### Monthly

- [ ] Update dependencies:
  ```bash
  npm run deps:update-interactive
  ```

- [ ] Review and update security tools:
  ```bash
  npm update -g snyk
  npm update -g npm
  ```

- [ ] Audit third-party services and tokens

- [ ] Review access logs and permissions

---

## Quick Reference Commands

```bash
# Security Checks
npm run security:full              # Run all security checks
npm audit                          # Check for vulnerabilities
npm run security:check-malware     # Check for Shai-Hulud

# Safe Installation
npm ci                             # Clean install from lock file
npm install <pkg> --save-exact     # Install with exact version
npm audit fix                      # Fix vulnerabilities

# Monitoring
snyk test                          # Run Snyk scan
snyk monitor                       # Enable continuous monitoring
npm outdated                       # Check outdated packages

# Forensics
git log --all --oneline -20        # Recent commits
git diff HEAD~1 package-lock.json  # Recent dependency changes
find . -type f -mtime -1           # Recently modified files

# Emergency
killall -9 node                    # Kill all Node processes
rm -rf node_modules                # Remove dependencies
npm cache clean --force            # Clear npm cache
```

---

## Additional Resources

- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)
- [Snyk Open Source Security](https://snyk.io/product/open-source-security-management/)
- [Socket.dev Supply Chain Security](https://socket.dev/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)

---

## Support

If you detect suspicious activity:

1. **Stop immediately** - Don't ignore red flags
2. **Document everything** - Take screenshots, save logs
3. **Isolate the system** - Disconnect from network
4. **Report it** - Contact security@npmjs.com
5. **Learn from it** - Update this guide with lessons learned

---

**Last Updated**: 2025-12-01
**Version**: 1.0.0
**Maintained By**: UpLove Security Team
