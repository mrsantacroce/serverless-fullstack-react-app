#!/bin/bash

# API Gateway endpoint (passed via environment variable or use default)
API_ENDPOINT="${API_ENDPOINT:-TODO}"

echo "Testing Serverless Todo API"
echo "API Endpoint: $API_ENDPOINT"
echo ""

# Generate a UUID for testing
TODO_ID=$(uuidgen | tr '[:upper:]' '[:lower:]')

echo "=========================================="
echo "1. CREATE a new todo"
echo "=========================================="
CREATE_RESPONSE=$(curl -s -X POST "$API_ENDPOINT/todos" \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"Test todo item\"}")
echo "$CREATE_RESPONSE" | jq .

# Extract the ID from the response
CREATED_ID=$(echo "$CREATE_RESPONSE" | jq -r '.id')
echo ""
echo "Created todo with ID: $CREATED_ID"
echo ""

echo "=========================================="
echo "2. LIST all todos"
echo "=========================================="
curl -s -X GET "$API_ENDPOINT/todos" | jq .
echo ""

echo "=========================================="
echo "3. GET single todo by ID"
echo "=========================================="
curl -s -X GET "$API_ENDPOINT/todos/$CREATED_ID" | jq .
echo ""

echo "=========================================="
echo "4. UPDATE the todo"
echo "=========================================="
curl -s -X PUT "$API_ENDPOINT/todos/$CREATED_ID" \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"Updated todo item\", \"checked\": true}" | jq .
echo ""

echo "=========================================="
echo "5. DELETE the todo"
echo "=========================================="
curl -s -X DELETE "$API_ENDPOINT/todos/$CREATED_ID" | jq .
echo ""

echo "=========================================="
echo "6. Verify deletion - LIST all todos"
echo "=========================================="
curl -s -X GET "$API_ENDPOINT/todos" | jq .
echo ""

echo "Tests completed!"