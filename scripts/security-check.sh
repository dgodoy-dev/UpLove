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
if [ -f package-lock.json ]; then
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
else
    echo -e "${YELLOW}⚠️  package-lock.json not found${NC}"
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
if [ -d node_modules ]; then
    PREINSTALL_COUNT=$(grep -r '"preinstall"' node_modules/*/package.json 2>/dev/null | grep -v "node_modules/.bin" | wc -l || echo "0")
    if [ "$PREINSTALL_COUNT" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Found ${PREINSTALL_COUNT} packages with preinstall scripts${NC}"
        grep -r '"preinstall"' node_modules/*/package.json 2>/dev/null | grep -v "node_modules/.bin" | sed 's/node_modules\//  - /g' | sed 's/\/package.json.*//g'
    else
        echo -e "${GREEN}✅ No suspicious preinstall scripts${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  node_modules not found - run 'npm install' first${NC}"
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
