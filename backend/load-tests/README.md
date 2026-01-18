# 📊 FLAME Lounge - Load Tests with Artillery

Comprehensive load testing suite for the FLAME Lounge backend API using Artillery.

## 🎯 Test Types

### 1. **Standard Load Test** (`config.yml`)
Tests normal production load with gradual ramp-up.

**Phases:**
- Warm-up: 5 req/s for 60s
- Ramp-up: 10→50 req/s over 120s
- Sustained: 50 req/s for 180s
- Spike: 100 req/s for 60s
- Cool-down: 10 req/s for 60s

**Scenarios (7 total):**
- Browse Menu (30% weight)
- User Registration & Login (10%)
- Create Order (25%)
- View Orders History (15%)
- Cashback Operations (10%)
- Admin Dashboard (5%)
- Product Search (5%)

**Success Criteria:**
- Error rate < 1%
- p95 latency < 1.5s
- p99 latency < 3s

### 2. **Spike Test** (`spike-test.yml`)
Tests system recovery from sudden traffic spike.

**Phases:**
- Normal: 10 req/s for 60s
- **SPIKE: 200 req/s for 60s**
- Recovery: 10 req/s for 120s

**Purpose:** Validates auto-scaling and circuit breakers.

### 3. **Stress Test** (`stress-test.yml`)
Finds the breaking point of the system.

**Phases:**
- Ramp: 10→500 req/s over 5 minutes
- Sustain: 500 req/s for 2 minutes

**Purpose:** Identify maximum capacity and failure modes.

### 4. **Soak Test** (`soak-test.yml`)
Tests stability over extended period (1 hour).

**Phases:**
- Soak: 30 req/s for 1 hour

**Purpose:** Detect memory leaks, connection leaks, performance degradation.

---

## 🚀 Installation

### Global Installation (Recommended)
```bash
npm install -g artillery
```

### Project-level Installation
```bash
npm install --save-dev artillery
```

---

## 📝 Usage

### Run Tests

**Standard Load Test:**
```bash
artillery run load-tests/config.yml
```

**With Detailed Report:**
```bash
artillery run load-tests/config.yml --output reports/load-test.json
artillery report reports/load-test.json
```

**Spike Test:**
```bash
artillery run load-tests/spike-test.yml --output reports/spike-test.json
```

**Stress Test:**
```bash
artillery run load-tests/stress-test.yml --output reports/stress-test.json
```

**Soak Test (1 hour):**
```bash
artillery run load-tests/soak-test.yml --output reports/soak-test.json
```

### Quick Test (Local)
Edit `config.yml` and change target to local:
```yaml
target: 'http://localhost:3001'
```

Then run:
```bash
artillery quick --count 10 --num 100 http://localhost:3001/api/products
```

---

## 📊 Understanding Results

### Key Metrics

**Request Metrics:**
- `http.requests`: Total requests sent
- `http.responses`: Total responses received
- `http.codes.200`: Successful responses

**Latency Metrics:**
- `http.response_time.min`: Fastest response
- `http.response_time.max`: Slowest response
- `http.response_time.median`: 50th percentile
- `http.response_time.p95`: 95th percentile (SLA target)
- `http.response_time.p99`: 99th percentile

**Error Metrics:**
- `errors.*`: Various error types
- `http.codes.4xx`: Client errors
- `http.codes.5xx`: Server errors

### Example Good Result
```
Summary report @ 14:23:45(+0000)
  Scenarios launched:  1500
  Scenarios completed: 1500
  Requests completed:  6000
  Mean response/sec: 50.12
  Response time (msec):
    min: 45
    max: 1234
    median: 156
    p95: 487
    p99: 892
  Codes:
    200: 6000
  Errors: 0
```

### Example Bad Result (Needs Attention)
```
Summary report @ 14:23:45(+0000)
  Scenarios launched:  1500
  Scenarios completed: 1200
  Requests completed:  4800
  Mean response/sec: 32.14
  Response time (msec):
    min: 234
    max: 12456
    median: 3421
    p95: 8234
    p99: 11234
  Codes:
    200: 4500
    500: 300
  Errors:
    ETIMEDOUT: 200
    ECONNREFUSED: 100
```

❌ **Issues:**
- 300 uncompleted scenarios (20% failure rate)
- High p95/p99 latency (> 8s)
- 300 server errors (5xx)
- 300 connection errors

---

## 🎯 Performance Targets

### Current Production Targets (Railway 2GB RAM)

| Metric | Target | Critical |
|--------|--------|----------|
| Throughput | 50 req/s | 100 req/s |
| p95 latency | < 1.5s | < 3s |
| p99 latency | < 3s | < 5s |
| Error rate | < 1% | < 5% |
| Concurrent users | 500 | 1000 |

### Endpoint-Specific Targets

| Endpoint | p95 | p99 | Notes |
|----------|-----|-----|-------|
| `GET /api/products` | 200ms | 400ms | Cached |
| `GET /api/orders` | 500ms | 1s | Auth + DB |
| `POST /api/orders` | 1s | 2s | Complex transaction |
| `POST /api/auth/login` | 300ms | 600ms | Bcrypt hashing |
| `GET /api/cashback/balance` | 200ms | 400ms | Simple query |

---

## 🔧 Configuration Tips

### Custom Variables
Add to `config.yml`:
```yaml
config:
  variables:
    baseUrl: "{{ $env.API_URL }}"
    testEmail: "loadtest+{{ $randomString() }}@flame.com"
```

### Ramp-up Strategy
```yaml
phases:
  - duration: 60
    arrivalRate: 10
    rampTo: 50
    name: "Gradual Ramp"
```

### Think Time (User Pauses)
```yaml
flow:
  - get:
      url: "/api/products"
  - think: 3 # Wait 3 seconds
  - get:
      url: "/api/orders"
```

---

## 📈 Integration with CI/CD

### GitHub Actions Example
```yaml
name: Load Tests
on:
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM

jobs:
  load-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Artillery
        run: npm install -g artillery
      - name: Run Load Tests
        run: artillery run load-tests/config.yml --output load-test.json
      - name: Generate Report
        run: artillery report load-test.json --output load-test.html
      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: load-test-results
          path: |
            load-test.json
            load-test.html
```

---

## 🐛 Troubleshooting

### Error: ETIMEDOUT
**Cause:** Server not responding within timeout
**Fix:** Increase timeout in config:
```yaml
http:
  timeout: 30 # seconds
```

### Error: ECONNREFUSED
**Cause:** Server is down or wrong URL
**Fix:** Verify target URL and server status

### High Error Rate (> 5%)
**Possible Causes:**
- Rate limiting triggered
- Database connection pool exhausted
- Memory issues
- CPU throttling

**Actions:**
1. Check server logs
2. Monitor CPU/Memory usage
3. Verify database connection pool size
4. Check rate limit configuration

### Slow Response Times
**Possible Causes:**
- N+1 query problems
- Missing database indexes
- No caching layer
- Blocking I/O operations

**Actions:**
1. Enable SQL query logging
2. Add database indexes
3. Implement Redis caching
4. Use async operations

---

## 📚 Advanced Features

### Processors (Custom JS)
```yaml
config:
  processor: "./processor.js"

scenarios:
  - flow:
      - function: "generateRandomOrder"
```

`processor.js`:
```javascript
module.exports = {
  generateRandomOrder: function(context, events, done) {
    context.vars.orderId = Math.floor(Math.random() * 1000);
    return done();
  }
};
```

### Plugins

**Expect Plugin** (assertions):
```yaml
plugins:
  expect: {}

scenarios:
  - flow:
      - get:
          url: "/api/products"
          expect:
            - statusCode: 200
            - contentType: json
            - hasProperty: data
            - matchesRegexp: /products/
```

**Metrics by Endpoint**:
```yaml
plugins:
  metrics-by-endpoint: {}
```

---

## 📊 Reports

### JSON Report
```bash
artillery run config.yml --output report.json
```

### HTML Report
```bash
artillery report report.json --output report.html
```

### Custom Reporting
```bash
artillery run config.yml | tee artillery.log
```

---

## 🎯 Best Practices

1. **Start Small:** Begin with low load, gradually increase
2. **Test Locally First:** Validate tests work before production
3. **Use Realistic Data:** Match production traffic patterns
4. **Monitor During Tests:** Watch server metrics (CPU, memory, DB)
5. **Test Off-Peak:** Avoid testing during production peak hours
6. **Set Baselines:** Record baseline performance for comparison
7. **Automate:** Integrate into CI/CD for regression detection
8. **Document Results:** Keep historical data for trend analysis

---

## 📞 Support

- Artillery Docs: https://artillery.io/docs
- GitHub Issues: https://github.com/artilleryio/artillery/issues
- FLAME Team: devops@flame.com

---

**Last Updated:** 2026-01-17
**Version:** 1.0
**Author:** FLAME DevOps Team
