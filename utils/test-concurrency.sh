#!/bin/bash

# Test concurrent operations
API_ENDPOINT="${API_ENDPOINT:-TODO}"

echo "Testing Concurrent Operations"
echo "API Endpoint: $API_ENDPOINT"
echo ""

echo "=========================================="
echo "CONCURRENCY TEST"
echo "=========================================="

echo "Creating 10 todos concurrently..."

# Create 10 todos in parallel
for i in {1..10}; do
  (
    RESPONSE=$(curl -s -X POST "$API_ENDPOINT/todos" \
      -H "Content-Type: application/json" \
      -d "{\"text\": \"Concurrent todo $i\"}")
    echo "Created todo $i: $(echo $RESPONSE | jq -r '.id')"
  ) &
done

# Wait for all background jobs to complete
wait

echo ""
echo "Fetching all todos..."
TODOS=$(curl -s -X GET "$API_ENDPOINT/todos")
TODO_COUNT=$(echo "$TODOS" | jq '. | length')

echo "Total todos in database: $TODO_COUNT"

if [ "$TODO_COUNT" -ge 10 ]; then
  echo "✓ PASS - Concurrent creation successful"
else
  echo "✗ FAIL - Expected at least 10 todos, got $TODO_COUNT"
  exit 1
fi

echo ""
echo "Cleaning up todos..."

# Get all todo IDs and delete them
TODO_IDS=$(echo "$TODOS" | jq -r '.[].id')

for id in $TODO_IDS; do
  (
    curl -s -X DELETE "$API_ENDPOINT/todos/$id" > /dev/null
    echo "Deleted todo: $id"
  ) &
done

wait

echo ""
echo "Concurrent test completed successfully!"
