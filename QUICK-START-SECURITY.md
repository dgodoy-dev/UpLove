# Quick Start Security Setup

Follow these steps immediately to secure your UpLove project:

## 1. Enable Git Hooks (2 minutes)

```bash
# Enable the pre-commit security hook
git config core.hooksPath .githooks

# Verify it's working
git config core.hooksPath
# Should output: .githooks
```

## 2. Test Security Scripts (1 minute)

```bash
# Run the security check
./scripts/security-check.sh

# Or use npm scripts
npm run security:full
```

## 3. Configure npm (1 minute)

The `.npmrc` file is already created. Verify it's working:

```bash
# Check npm configuration
cat .npmrc

# Verify registry
npm config get registry
# Should output: https://registry.npmjs.org/
```

## 4. Enable 2FA on npm (5 minutes)

```bash
# Enable two-factor authentication
npm profile enable-2fa auth-and-writes

# Follow the prompts to set up your authenticator app
```

## 5. Install Security Tools (5 minutes)

```bash
# Install Snyk globally
npm install -g snyk

# Authenticate with Snyk (requires free account)
snyk auth

# Test your project
snyk test
```

## 6. Run Initial Security Scan (2 minutes)

```bash
# Clean install to ensure integrity
npm ci

# Run full security check
npm run security:full

# Check for outdated packages
npm outdated
```

## 7. Enable GitHub Actions (Optional - 5 minutes)

If you're using GitHub:

1. Go to https://app.snyk.io/account
2. Copy your Snyk token
3. Go to your GitHub repo: Settings > Secrets and variables > Actions
4. Add new secret:
   - Name: `SNYK_TOKEN`
   - Value: [your-snyk-token]

The `.github/workflows/security.yml` is already configured and will run automatically on push/pull requests.

## 8. Daily Workflow

Before starting work each day:

```bash
# Quick security check
npm run security:full
```

Before installing new packages:

```bash
# Research the package first
npm info package-name

# Install one at a time
npm install package-name

# Check after installation
npm run security:full

# Review changes
git diff package.json package-lock.json
```

## Emergency Commands

If you suspect malware infection:

```bash
# IMMEDIATELY kill all Node processes
killall -9 node

# Backup for forensics
cp -r node_modules node_modules.infected.backup
cp package-lock.json package-lock.json.infected.backup

# Clean installation
rm -rf node_modules
npm cache clean --force
npm ci

# Verify clean
npm run security:full
```

## Files Created

- ✅ `.npmrc` - npm security configuration
- ✅ `.githooks/pre-commit` - Git security hook
- ✅ `scripts/security-check.sh` - Security scan script
- ✅ `.github/workflows/security.yml` - CI/CD security checks
- ✅ `package.json` - Updated with security scripts
- ✅ `.gitignore` - Enhanced with security patterns
- ✅ `.vscode/settings.json` - VSCode security settings
- ✅ `SECURITY-SETUP-GUIDE.md` - Comprehensive guide
- ✅ `QUICK-START-SECURITY.md` - This file

## Verify Your Setup

Run this command to verify everything is configured:

```bash
echo "=== Security Configuration Check ==="
echo ""
echo "1. Git hooks configured:"
git config core.hooksPath
echo ""
echo "2. Pre-commit hook exists:"
ls -lh .githooks/pre-commit
echo ""
echo "3. Security scripts exist:"
ls -lh scripts/security-check.sh
echo ""
echo "4. npm registry:"
npm config get registry
echo ""
echo "5. Security scripts in package.json:"
npm run | grep security
echo ""
echo "=== Setup verification complete ==="
```

## Next Steps

1. Read the full guide: `SECURITY-SETUP-GUIDE.md`
2. Review the daily security practices section
3. Set up Snyk monitoring: `snyk monitor`
4. Schedule weekly dependency updates
5. Review GitHub security advisories regularly

## Support

- Full documentation: See `SECURITY-SETUP-GUIDE.md`
- Report security issues: security@npmjs.com
- Shai-Hulud resources: See the sources section in `SECURITY-SETUP-GUIDE.md`

**Your project is now secured against Shai-Hulud 2.0 and similar supply chain attacks!**
