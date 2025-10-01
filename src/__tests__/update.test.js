// Mock the AWS SDK
jest.mock('@aws-sdk/lib-dynamodb', () => ({
  UpdateCommand: jest.fn(),
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

const { update } = require('../functions/update');

describe('update function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.DYNAMODB_TABLE = 'test-table';
    process.env.MAX_TODO_LENGTH = '500';
  });

  it('should return 404 if todo does not exist', async () => {
    const event = {
      pathParameters: { id: 'nonexistent-id' },
      body: JSON.stringify({ text: 'Updated', checked: false }),
    };

    // Mock GetCommand to return no item
    mockSend.mockResolvedValueOnce({ Item: null });

    const result = await update(event);

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({
      error: 'Todo item not found',
    });
  });

  it('should update an existing todo', async () => {
    const event = {
      pathParameters: { id: 'existing-id' },
      body: JSON.stringify({ text: 'Updated todo', checked: true }),
    };

    // Mock GetCommand to return existing item
    mockSend.mockResolvedValueOnce({
      Item: { id: 'existing-id', text: 'Old text', checked: false },
    });

    // Mock UpdateCommand
    mockSend.mockResolvedValueOnce({
      Attributes: {
        id: 'existing-id',
        text: 'Updated todo',
        checked: true,
        updatedAt: 123456789,
      },
    });

    const result = await update(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toMatchObject({
      id: 'existing-id',
      text: 'Updated todo',
      checked: true,
    });
  });

  it('should return 400 for invalid data types', async () => {
    const event = {
      pathParameters: { id: 'existing-id' },
      body: JSON.stringify({ text: 'Valid', checked: 'not-boolean' }),
    };

    const result = await update(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      error: 'Todo text must be a string and checked must be a boolean',
    });
  });

  it('should return 400 for empty text', async () => {
    const event = {
      pathParameters: { id: 'existing-id' },
      body: JSON.stringify({ text: '   ', checked: false }),
    };

    const result = await update(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      error: 'Todo text cannot be empty',
    });
  });

  it('should return 400 for text exceeding max length', async () => {
    const event = {
      pathParameters: { id: 'existing-id' },
      body: JSON.stringify({ text: 'a'.repeat(501), checked: false }),
    };

    const result = await update(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      error: 'Todo text must be 500 characters or less',
    });
  });
});
