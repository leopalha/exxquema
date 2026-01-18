# 🔒 FLAME Lounge - OWASP ZAP Security Scan Guide

Comprehensive guide for running OWASP ZAP security scans on the FLAME Lounge backend API.

## 📖 Table of Contents

- [What is OWASP ZAP?](#what-is-owasp-zap)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Scan Types](#scan-types)
- [Running Scans](#running-scans)
- [Understanding Results](#understanding-results)
- [Remediation Guide](#remediation-guide)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

---

## 🎯 What is OWASP ZAP?

**OWASP Zed Attack Proxy (ZAP)** is a free, open-source penetration testing tool maintained by OWASP. It helps find security vulnerabilities in web applications during development and testing.

**Key Features:**
- Automated scanner for vulnerabilities
- Active and passive scanning
- Spider/crawler for discovering endpoints
- Intercepting proxy for manual testing
- REST API for CI/CD integration
- Comprehensive reporting

---

## 📥 Installation

### Option 1: Desktop Application (Recommended for Manual Testing)

**Windows:**
```bash
# Download from https://www.zaproxy.org/download/
# Install OWASP ZAP 2.14.0 or later
```

**macOS:**
```bash
brew install --cask owasp-zap
```

**Linux:**
```bash
# Download from https://www.zaproxy.org/download/
sudo sh ZAP_2_14_0_unix.sh
```

### Option 2: Docker (Recommended for CI/CD)

```bash
# Pull latest stable image
docker pull ghcr.io/zaproxy/zaproxy:stable

# Run ZAP daemon
docker run -u zap -p 8080:8080 ghcr.io/zaproxy/zaproxy:stable zap.sh -daemon -host 0.0.0.0 -port 8080 -config api.addrs.addr.name=.* -config api.addrs.addr.regex=true
```

### Option 3: Command Line Only

```bash
# Download ZAP CLI wrapper
pip install zapcli

# Or use ZAP's own CLI
python zap-cli.py
```

---

## ⚡ Quick Start

### 1. Basic Scan (Automated)

```bash
# Full automated scan against production
docker run -v $(pwd):/zap/wrk:rw -t ghcr.io/zaproxy/zaproxy:stable \
  zap-full-scan.py -t https://backend-production-28c3.up.railway.app \
  -r zap-report.html
```

### 2. API Scan (OpenAPI/Swagger)

```bash
# Scan using Swagger definition
docker run -v $(pwd):/zap/wrk:rw -t ghcr.io/zaproxy/zaproxy:stable \
  zap-api-scan.py -t https://backend-production-28c3.up.railway.app/swagger.json \
  -f openapi \
  -r zap-api-report.html
```

### 3. Baseline Scan (Quick, Passive Only)

```bash
# Quick baseline scan (no active attacks)
docker run -v $(pwd):/zap/wrk:rw -t ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py -t https://backend-production-28c3.up.railway.app \
  -r zap-baseline-report.html
```

---

## 🔍 Scan Types

### 1. Baseline Scan
**Duration:** 1-5 minutes
**Risk:** None (passive only)
**Use Case:** Quick security check, CI/CD pipelines

```bash
# Passive scan only - finds low-hanging fruit
zap-baseline.py -t https://backend-production-28c3.up.railway.app
```

**What it checks:**
- Missing security headers
- Cookie security flags
- Information disclosure
- CSP configuration
- Outdated libraries

---

### 2. API Scan
**Duration:** 5-15 minutes
**Risk:** Low (active, but API-specific)
**Use Case:** REST API testing, Swagger/OpenAPI scans

```bash
# API-specific scan using OpenAPI/Swagger
zap-api-scan.py -t https://backend-production-28c3.up.railway.app/swagger.json -f openapi
```

**What it checks:**
- Authentication bypass
- Authorization flaws
- Input validation
- API rate limiting
- SQL injection in endpoints
- XSS in API responses

---

### 3. Full Scan
**Duration:** 30-120 minutes
**Risk:** High (aggressive active scanning)
**Use Case:** Pre-production comprehensive testing

```bash
# Full active + passive scan (AGGRESSIVE)
zap-full-scan.py -t https://backend-production-28c3.up.railway.app
```

**What it checks:**
- Everything from Baseline + API scans
- SQL injection (all variants)
- XSS (reflected, stored, DOM)
- CSRF
- Path traversal
- Remote code execution
- XXE attacks
- SSRF
- And 100+ more vulnerability types

---

## 🚀 Running Scans

### Scan 1: Quick Baseline (Start Here)

```bash
# Create reports directory
mkdir -p security-reports

# Run baseline scan
docker run -v $(pwd)/security-reports:/zap/wrk:rw -t ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py \
  -t https://backend-production-28c3.up.railway.app \
  -r baseline-report.html \
  -J baseline-report.json \
  -w baseline-report.md
```

**Expected Output:**
```
PASS: Cookie No HttpOnly Flag [10010]
PASS: Cookie Without Secure Flag [10011]
WARN: X-Content-Type-Options Header Missing [10021]
PASS: Content Security Policy (CSP) Header Not Set [10038]
...
PASS: 34
WARN: 3
FAIL: 0
```

---

### Scan 2: API Scan with Authentication

```bash
# First, get authentication token
TOKEN=$(curl -X POST https://backend-production-28c3.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@flame.com","password":"admin123"}' \
  | jq -r '.token')

# Run API scan with auth token
docker run -v $(pwd)/security-reports:/zap/wrk:rw -t ghcr.io/zaproxy/zaproxy:stable \
  zap-api-scan.py \
  -t https://backend-production-28c3.up.railway.app/swagger.json \
  -f openapi \
  -z "-config api.key=Authorization -config api.value='Bearer $TOKEN'" \
  -r api-scan-report.html \
  -J api-scan-report.json
```

---

### Scan 3: Full Scan (Staging/Test Only)

**⚠️ WARNING:** Only run on test/staging environments, NEVER on production!

```bash
# Run full scan on staging
docker run -v $(pwd)/security-reports:/zap/wrk:rw -t ghcr.io/zaproxy/zaproxy:stable \
  zap-full-scan.py \
  -t https://backend-staging.up.railway.app \
  -r full-scan-report.html \
  -J full-scan-report.json \
  -l INFO \
  -m 60 # Max 60 minutes
```

---

## 📊 Understanding Results

### Severity Levels

| Level | Description | Action Required |
|-------|-------------|-----------------|
| **High** | Critical vulnerability, immediate fix | Fix immediately |
| **Medium** | Significant risk, fix soon | Fix within 7 days |
| **Low** | Minor issue, good to fix | Fix within 30 days |
| **Informational** | No risk, good to know | Optional |

---

### Common Findings & Fixes

#### 1. Missing Security Headers

**Finding:**
```
X-Content-Type-Options Header Missing [Medium]
X-Frame-Options Header Missing [Medium]
```

**Fix (backend/src/server.js):**
```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  xFrameOptions: { action: 'deny' },
  xContentTypeOptions: true,
  referrerPolicy: { policy: 'same-origin' },
}));
```

---

#### 2. Cookie Security Issues

**Finding:**
```
Cookie No HttpOnly Flag [High]
Cookie Without Secure Flag [High]
```

**Fix (backend/src/controllers/authController.js):**
```javascript
res.cookie('authToken', token, {
  httpOnly: true,  // Prevent XSS
  secure: true,    // HTTPS only
  sameSite: 'strict', // CSRF protection
  maxAge: 3600000, // 1 hour
});
```

---

#### 3. SQL Injection Risk

**Finding:**
```
SQL Injection [High]
Endpoint: GET /api/products?category=1
```

**Fix:** Already protected with Sequelize ORM (parameterized queries)
```javascript
// SAFE (Sequelize uses prepared statements)
const products = await Product.findAll({
  where: { categoryId: req.query.category }
});

// UNSAFE (raw query without parameterization)
// const products = await sequelize.query(
//   `SELECT * FROM products WHERE category_id = ${req.query.category}`
// );
```

---

#### 4. XSS Vulnerability

**Finding:**
```
Cross Site Scripting (Reflected) [High]
Endpoint: POST /api/orders
Parameter: notes
```

**Fix (backend/src/middleware/sanitization.middleware.js):**
```javascript
const { sanitize } = require('express-validator');

router.post('/orders',
  sanitize('notes').escape(), // Sanitize HTML
  orderController.create
);
```

---

#### 5. CSRF Missing

**Finding:**
```
Absence of Anti-CSRF Tokens [Medium]
```

**Fix:** Already implemented with csrf-csrf package
```javascript
const { doubleCsrf } = require('csrf-csrf');

const { generateToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET,
  cookieName: 'x-csrf-token',
  cookieOptions: { sameSite: 'strict', secure: true },
});

app.use(doubleCsrfProtection);
```

---

## 🔄 CI/CD Integration

### GitHub Actions Workflow

Create `.github/workflows/security-scan.yml`:

```yaml
name: OWASP ZAP Security Scan

on:
  schedule:
    - cron: '0 2 * * 1' # Every Monday at 2 AM
  workflow_dispatch: # Manual trigger

jobs:
  zap-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Run ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.10.0
        with:
          target: 'https://backend-production-28c3.up.railway.app'
          rules_file_name: '.zap/rules.tsv'
          cmd_options: '-a'

      - name: Upload ZAP Report
        uses: actions/upload-artifact@v3
        with:
          name: zap-scan-report
          path: report_html.html

      - name: Create Issue on Failure
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: '🔒 Security vulnerabilities found by ZAP scan',
              body: 'OWASP ZAP scan found vulnerabilities. Check the workflow run for details.',
              labels: ['security', 'bug']
            })
```

---

### ZAP Rules Configuration

Create `.zap/rules.tsv`:

```tsv
10021	WARN	(X-Content-Type-Options Header Missing)
10020	WARN	(X-Frame-Options Header Missing)
10038	WARN	(Content Security Policy (CSP) Header Not Set)
10054	WARN	(Cookie Without SameSite Attribute)
10011	FAIL	(Cookie Without Secure Flag)
10010	FAIL	(Cookie No HttpOnly Flag)
40012	FAIL	(Cross Site Scripting (Reflected))
40014	FAIL	(Cross Site Scripting (Persistent))
40018	FAIL	(SQL Injection)
90019	FAIL	(Server Side Request Forgery)
```

---

## 📋 Best Practices

### 1. Scan Frequency

| Environment | Scan Type | Frequency |
|-------------|-----------|-----------|
| Production | Baseline | Daily |
| Production | API Scan | Weekly |
| Staging | Full Scan | Weekly |
| Development | Baseline | On PR |

### 2. Pre-Deployment Checklist

Before deploying to production:

- [ ] Run baseline scan (no HIGH/MEDIUM findings)
- [ ] Run API scan with authentication
- [ ] Review all WARN findings
- [ ] Update security headers
- [ ] Check cookie configurations
- [ ] Verify CSRF protection enabled
- [ ] Test rate limiting
- [ ] Review CORS settings

### 3. Handling False Positives

Create `.zap/context.xml` to ignore false positives:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <context>
    <name>FLAME API</name>
    <exclude>
      <!-- Exclude health check from rate limiting alerts -->
      <regex>https://backend-production.*\.railway\.app/health</regex>
    </exclude>
  </context>
</configuration>
```

### 4. Report Storage

Store reports securely:

```bash
# Encrypt reports before committing
gpg -c security-reports/full-scan-report.html

# Add to .gitignore
echo "security-reports/*.html" >> .gitignore
echo "security-reports/*.json" >> .gitignore
```

---

## 🎯 Expected Scan Results (FLAME Lounge)

### Current Security Posture (v2.0.0)

Based on previous security implementations:

**✅ PASS (Expected):**
- ✅ SQL Injection Protection (Sequelize ORM)
- ✅ XSS Protection (sanitization middleware)
- ✅ CSRF Protection (Double Submit Cookie)
- ✅ Secure Cookies (httpOnly, secure, sameSite)
- ✅ HTTPS Enforced
- ✅ Rate Limiting (500 req/15min)
- ✅ Helmet Security Headers
- ✅ CORS Configuration
- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt 12 rounds)

**⚠️ WARN (Acceptable):**
- ⚠️ Content Security Policy (CSP) - Could be stricter
- ⚠️ HSTS Max Age - Could be longer (currently 1 year)
- ⚠️ Subresource Integrity - Not implemented (low priority)

**❌ FAIL (Unexpected - Need Investigation):**
- None expected

---

## 📚 Additional Resources

- **OWASP ZAP Documentation:** https://www.zaproxy.org/docs/
- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **OWASP API Security:** https://owasp.org/www-project-api-security/
- **ZAP Docker:** https://www.zaproxy.org/docs/docker/
- **ZAP GitHub Actions:** https://github.com/zaproxy/action-baseline

---

## 🔧 Troubleshooting

### Issue: Connection Refused

```bash
# Check if target is accessible
curl -I https://backend-production-28c3.up.railway.app/health

# Verify network connectivity
docker run --rm curlimages/curl:latest curl -I https://backend-production-28c3.up.railway.app
```

### Issue: Too Many False Positives

```bash
# Use context file to exclude endpoints
docker run -v $(pwd):/zap/wrk:rw -t ghcr.io/zaproxy/zaproxy:stable \
  zap-baseline.py \
  -t https://backend-production-28c3.up.railway.app \
  -n .zap/context.xml
```

### Issue: Scan Takes Too Long

```bash
# Limit scan time
docker run -v $(pwd):/zap/wrk:rw -t ghcr.io/zaproxy/zaproxy:stable \
  zap-api-scan.py \
  -t https://backend-production-28c3.up.railway.app/swagger.json \
  -m 15 # Max 15 minutes
```

---

**Last Updated:** 2026-01-17
**Version:** 1.0
**Maintainer:** FLAME Security Team
