// Mock the AWS SDK
jest.mock('@aws-sdk/lib-dynamodb', () => ({
  DeleteCommand: jest.fn(),
  GetCommand: jest.fn(),
  DynamoDBDocumentClient: {
    from: jest.fn(),
  },
}));

// Mock the docClient
const mockSend = jest.fn();
jest.mock('../functions/dynamodb', () => ({
  send: (...args) => mockSend(...args),
}));

const { delete: deleteTodo } = require('../functions/delete');

describe('delete function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.DYNAMODB_TABLE = 'test-table';
  });

  it('should return 404 if todo does not exist', async () => {
    const event = {
      pathParameters: { id: 'nonexistent-id' },
    };

    // Mock GetCommand to return no item
    mockSend.mockResolvedValueOnce({ Item: null });

    const result = await deleteTodo(event);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({
      error: 'Todo item not found',
    });
  });

  it('should delete an existing todo', async () => {
    const event = {
      pathParameters: { id: 'existing-id' },
    };

    // Mock GetCommand to return existing item
    mockSend.mockResolvedValueOnce({
      Item: { id: 'existing-id', text: 'Test todo', checked: false },
    });

    // Mock DeleteCommand
    mockSend.mockResolvedValueOnce({});

    const result = await deleteTodo(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Todo item deleted successfully.',
    });
  });

  it('should return 500 on database error', async () => {
    const event = {
      pathParameters: { id: 'existing-id' },
    };

    // Mock GetCommand to throw error
    mockSend.mockRejectedValueOnce(new Error('Database error'));

    const result = await deleteTodo(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      error: "Couldn't remove the todo item.",
    });
  });
});
