#!/bin/bash

# Run all integration tests
API_ENDPOINT="${API_ENDPOINT:-TODO}"

if [ "$API_ENDPOINT" = "TODO" ]; then
  echo "ERROR: API_ENDPOINT environment variable not set"
  echo "Usage: API_ENDPOINT=https://your-api.com/dev ./utils/run-all-tests.sh"
  exit 1
fi

echo "╔════════════════════════════════════════╗"
echo "║  Running All Integration Tests        ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "API Endpoint: $API_ENDPOINT"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FAILED_SUITES=0
TOTAL_SUITES=0

run_test_suite() {
  local test_script="$1"
  local suite_name="$2"

  ((TOTAL_SUITES++))
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Running: $suite_name"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if bash "$SCRIPT_DIR/$test_script"; then
    echo "✓ $suite_name: PASSED"
  else
    echo "✗ $suite_name: FAILED"
    ((FAILED_SUITES++))
  fi
}

# Make all test scripts executable
chmod +x "$SCRIPT_DIR"/*.sh

# Run test suites
run_test_suite "test-api.sh" "Basic CRUD Operations"
run_test_suite "test-validation.sh" "Input Validation & Error Handling"
run_test_suite "test-cors.sh" "CORS Headers"
run_test_suite "test-concurrency.sh" "Concurrent Operations"

echo ""
echo "╔════════════════════════════════════════╗"
echo "║  Test Suite Summary                    ║"
echo "╚════════════════════════════════════════╝"
echo ""
echo "Total Suites: $TOTAL_SUITES"
echo "Passed: $((TOTAL_SUITES - FAILED_SUITES))"
echo "Failed: $FAILED_SUITES"
echo ""

if [ $FAILED_SUITES -gt 0 ]; then
  echo "❌ Some test suites failed"
  exit 1
fi

echo "✅ All test suites passed!"
