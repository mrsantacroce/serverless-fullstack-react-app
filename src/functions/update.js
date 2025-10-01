const { UpdateCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const docClient = require('./dynamodb');

module.exports.update = async (event) => {
  const timestamp = new Date().getTime();
  const maxLength = parseInt(process.env.MAX_TODO_LENGTH) || 500;

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Invalid JSON in request body' }),
    };
  }

  // Validation
  if (typeof data.text !== 'string' || typeof data.checked !== 'boolean') {
    console.error('Validation Failed: invalid data types');
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Todo text must be a string and checked must be a boolean' }),
    };
  }

  if (data.text.trim().length === 0) {
    console.error('Validation Failed: text is empty');
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Todo text cannot be empty' }),
    };
  }

  if (data.text.length > maxLength) {
    console.error(`Validation Failed: text exceeds ${maxLength} characters`);
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: `Todo text must be ${maxLength} characters or less` }),
    };
  }

  // First, check if the item exists
  const getParams = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  try {
    const existing = await docClient.send(new GetCommand(getParams));

    if (!existing.Item) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Todo item not found' }),
      };
    }

    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: event.pathParameters.id,
      },
      ExpressionAttributeNames: {
        '#todo_text': 'text',
      },
      ExpressionAttributeValues: {
        ':text': data.text,
        ':checked': data.checked,
        ':updatedAt': timestamp,
      },
      UpdateExpression: 'SET #todo_text = :text, checked = :checked, updatedAt = :updatedAt',
      ReturnValues: 'ALL_NEW',
    };

    const result = await docClient.send(new UpdateCommand(params));
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Couldn\'t update the todo item.' }),
    };
  }
};