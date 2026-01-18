#!/bin/bash
# FLAME Lounge - OWASP ZAP Security Scan Runner
#
# Usage:
#   ./scripts/run-zap-scan.sh [baseline|api|full]
#
# Examples:
#   ./scripts/run-zap-scan.sh baseline
#   ./scripts/run-zap-scan.sh api
#   ./scripts/run-zap-scan.sh full

set -e

# Configuration
TARGET_URL="${ZAP_TARGET_URL:-https://backend-production-28c3.up.railway.app}"
REPORTS_DIR="$(pwd)/security-reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SCAN_TYPE="${1:-baseline}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}FLAME Lounge - OWASP ZAP Security Scan${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Target: ${YELLOW}$TARGET_URL${NC}"
echo -e "Scan Type: ${YELLOW}$SCAN_TYPE${NC}"
echo -e "Timestamp: ${YELLOW}$TIMESTAMP${NC}"
echo ""

# Create reports directory
mkdir -p "$REPORTS_DIR"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    echo "Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

echo -e "${GREEN}✓ Docker found${NC}"

# Pull latest ZAP image
echo -e "${YELLOW}Pulling latest OWASP ZAP image...${NC}"
docker pull ghcr.io/zaproxy/zaproxy:stable

case "$SCAN_TYPE" in
    baseline)
        echo -e "${GREEN}Running Baseline Scan (Passive)...${NC}"
        docker run -v "$REPORTS_DIR:/zap/wrk:rw" -t ghcr.io/zaproxy/zaproxy:stable \
            zap-baseline.py \
            -t "$TARGET_URL" \
            -r "baseline_${TIMESTAMP}.html" \
            -J "baseline_${TIMESTAMP}.json" \
            -w "baseline_${TIMESTAMP}.md" \
            -l INFO

        REPORT_FILE="$REPORTS_DIR/baseline_${TIMESTAMP}.html"
        ;;

    api)
        echo -e "${GREEN}Running API Scan...${NC}"

        # Check if Swagger/OpenAPI spec exists
        SWAGGER_URL="$TARGET_URL/swagger.json"
        echo -e "Checking for Swagger spec at: ${YELLOW}$SWAGGER_URL${NC}"

        if curl --output /dev/null --silent --head --fail "$SWAGGER_URL"; then
            echo -e "${GREEN}✓ Swagger spec found${NC}"

            docker run -v "$REPORTS_DIR:/zap/wrk:rw" -t ghcr.io/zaproxy/zaproxy:stable \
                zap-api-scan.py \
                -t "$SWAGGER_URL" \
                -f openapi \
                -r "api_scan_${TIMESTAMP}.html" \
                -J "api_scan_${TIMESTAMP}.json" \
                -w "api_scan_${TIMESTAMP}.md" \
                -l INFO
        else
            echo -e "${RED}❌ Swagger spec not found at $SWAGGER_URL${NC}"
            echo "Falling back to baseline scan..."
            docker run -v "$REPORTS_DIR:/zap/wrk:rw" -t ghcr.io/zaproxy/zaproxy:stable \
                zap-baseline.py \
                -t "$TARGET_URL" \
                -r "api_scan_${TIMESTAMP}.html"
        fi

        REPORT_FILE="$REPORTS_DIR/api_scan_${TIMESTAMP}.html"
        ;;

    full)
        echo -e "${RED}⚠️  WARNING: Full scan will perform ACTIVE attacks${NC}"
        echo -e "${RED}Only run on test/staging environments!${NC}"
        echo ""
        read -p "Are you sure you want to continue? (yes/no): " -r
        echo
        if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            echo "Scan cancelled."
            exit 0
        fi

        echo -e "${GREEN}Running Full Scan (Active + Passive)...${NC}"
        docker run -v "$REPORTS_DIR:/zap/wrk:rw" -t ghcr.io/zaproxy/zaproxy:stable \
            zap-full-scan.py \
            -t "$TARGET_URL" \
            -r "full_scan_${TIMESTAMP}.html" \
            -J "full_scan_${TIMESTAMP}.json" \
            -w "full_scan_${TIMESTAMP}.md" \
            -m 60 \
            -l INFO

        REPORT_FILE="$REPORTS_DIR/full_scan_${TIMESTAMP}.html"
        ;;

    *)
        echo -e "${RED}❌ Invalid scan type: $SCAN_TYPE${NC}"
        echo "Valid types: baseline, api, full"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Scan Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Reports generated:"
echo -e "  HTML: ${YELLOW}$REPORT_FILE${NC}"
echo -e "  JSON: ${YELLOW}${REPORT_FILE%.html}.json${NC}"
echo -e "  MD:   ${YELLOW}${REPORT_FILE%.html}.md${NC}"
echo ""
echo -e "To view report:"
echo -e "  ${YELLOW}open $REPORT_FILE${NC}"
echo ""

# Summary
if [ -f "${REPORT_FILE%.html}.md" ]; then
    echo -e "${GREEN}Scan Summary:${NC}"
    echo ""
    grep -E "PASS|WARN|FAIL" "${REPORT_FILE%.html}.md" | tail -3 || echo "No summary available"
    echo ""
fi

echo -e "${GREEN}For detailed guidance, see:${NC}"
echo -e "  ${YELLOW}docs/security/OWASP_ZAP_SCAN.md${NC}"
echo ""
