const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const docClient = require('./dynamodb');

module.exports.list = async () => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
  };

  try {
    const result = await docClient.send(new ScanCommand(params));
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Couldn\'t fetch the todo items.' }),
    };
  }
};