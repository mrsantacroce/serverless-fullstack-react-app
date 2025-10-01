const { DeleteCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');
const docClient = require('./dynamodb');

module.exports.delete = async (event) => {
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
    };

    await docClient.send(new DeleteCommand(params));
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ message: 'Todo item deleted successfully.' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Couldn\'t remove the todo item.' }),
    };
  }
};