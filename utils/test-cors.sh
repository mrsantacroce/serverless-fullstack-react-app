#!/bin/bash

# Test CORS headers
API_ENDPOINT="${API_ENDPOINT:-TODO}"

echo "Testing CORS Headers"
echo "API Endpoint: $API_ENDPOINT"
echo ""

FAILED_TESTS=0
PASSED_TESTS=0

check_cors_header() {
  local method="$1"
  local path="$2"
  local description="$3"

  echo "TEST: $description ($method $path)"

  HEADERS=$(curl -s -I -X OPTIONS "$API_ENDPOINT$path" \
    -H "Origin: https://example.com" \
    -H "Access-Control-Request-Method: $method")

  # Check for CORS headers
  if echo "$HEADERS" | grep -qi "access-control-allow-origin"; then
    echo "✓ PASS - CORS headers present"
    ((PASSED_TESTS++))
  else
    echo "✗ FAIL - Missing CORS headers"
    ((FAILED_TESTS++))
  fi

  echo "$HEADERS" | grep -i "access-control"
  echo ""
}

echo "=========================================="
echo "CORS TESTS"
echo "=========================================="

check_cors_header "GET" "/todos" "List todos CORS"
check_cors_header "POST" "/todos" "Create todo CORS"
check_cors_header "GET" "/todos/123" "Get todo CORS"
check_cors_header "PUT" "/todos/123" "Update todo CORS"
check_cors_header "DELETE" "/todos/123" "Delete todo CORS"

echo "=========================================="
echo "CORS TEST RESULTS"
echo "=========================================="
echo "Passed: $PASSED_TESTS"
echo "Failed: $FAILED_TESTS"
echo ""

if [ $FAILED_TESTS -gt 0 ]; then
  exit 1
fi

echo "All CORS tests passed!"
