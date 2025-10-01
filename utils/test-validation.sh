#!/bin/bash

# Test input validation and error handling
API_ENDPOINT="${API_ENDPOINT:-TODO}"

echo "Testing Input Validation & Error Handling"
echo "API Endpoint: $API_ENDPOINT"
echo ""

FAILED_TESTS=0
PASSED_TESTS=0

test_case() {
  local description="$1"
  local expected_status="$2"
  shift 2

  echo "TEST: $description"
  RESPONSE=$(curl -s -w "\n%{http_code}" "$@")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  BODY=$(echo "$RESPONSE" | head -n-1)

  if [ "$HTTP_CODE" = "$expected_status" ]; then
    echo "✓ PASS - Got expected status $HTTP_CODE"
    ((PASSED_TESTS++))
  else
    echo "✗ FAIL - Expected $expected_status, got $HTTP_CODE"
    ((FAILED_TESTS++))
  fi
  echo "Response: $BODY" | jq . 2>/dev/null || echo "$BODY"
  echo ""
}

echo "=========================================="
echo "VALIDATION TESTS"
echo "=========================================="

# Test 1: Empty text
test_case "Empty todo text should return 400" "400" \
  -X POST "$API_ENDPOINT/todos" \
  -H "Content-Type: application/json" \
  -d '{"text": ""}'

# Test 2: Whitespace only
test_case "Whitespace-only text should return 400" "400" \
  -X POST "$API_ENDPOINT/todos" \
  -H "Content-Type: application/json" \
  -d '{"text": "   "}'

# Test 3: Text too long (> 500 chars)
LONG_TEXT=$(printf 'a%.0s' {1..501})
test_case "Text exceeding 500 characters should return 400" "400" \
  -X POST "$API_ENDPOINT/todos" \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"$LONG_TEXT\"}"

# Test 4: Invalid JSON
test_case "Invalid JSON should return 400" "400" \
  -X POST "$API_ENDPOINT/todos" \
  -H "Content-Type: application/json" \
  -d 'invalid json'

# Test 5: Missing text field
test_case "Missing text field should return 400" "400" \
  -X POST "$API_ENDPOINT/todos" \
  -H "Content-Type: application/json" \
  -d '{}'

# Test 6: Text is not a string
test_case "Non-string text should return 400" "400" \
  -X POST "$API_ENDPOINT/todos" \
  -H "Content-Type: application/json" \
  -d '{"text": 12345}'

# Test 7: Get non-existent todo
test_case "Get non-existent todo should return 404" "404" \
  -X GET "$API_ENDPOINT/todos/nonexistent-id-12345"

# Test 8: Update non-existent todo
test_case "Update non-existent todo should return 404" "404" \
  -X PUT "$API_ENDPOINT/todos/nonexistent-id-12345" \
  -H "Content-Type: application/json" \
  -d '{"text": "Updated", "checked": false}'

# Test 9: Delete non-existent todo
test_case "Delete non-existent todo should return 404" "404" \
  -X DELETE "$API_ENDPOINT/todos/nonexistent-id-12345"

# Test 10: Valid edge case - exactly 500 characters
EXACT_500=$(printf 'a%.0s' {1..500})
test_case "Exactly 500 characters should succeed" "200" \
  -X POST "$API_ENDPOINT/todos" \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"$EXACT_500\"}"

# Clean up the 500-char todo if it was created
if [ "$HTTP_CODE" = "200" ]; then
  TODO_ID=$(echo "$BODY" | jq -r '.id')
  curl -s -X DELETE "$API_ENDPOINT/todos/$TODO_ID" > /dev/null
fi

echo "=========================================="
echo "VALIDATION TEST RESULTS"
echo "=========================================="
echo "Passed: $PASSED_TESTS"
echo "Failed: $FAILED_TESTS"
echo ""

if [ $FAILED_TESTS -gt 0 ]; then
  exit 1
fi

echo "All validation tests passed!"
