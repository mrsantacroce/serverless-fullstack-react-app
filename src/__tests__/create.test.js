const { create } = require('../functions/create');

// Mock the AWS SDK
jest.mock('@aws-sdk/lib-dynamodb', () => ({
  PutCommand: jest.fn(),
  DynamoDBDocumentClient: {
    from: jest.fn(),
  },
}));

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}));

// Mock the docClient
const mockSend = jest.fn();
jest.mock('../functions/dynamodb', () => ({
  send: mockSend,
}));

describe('create function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.DYNAMODB_TABLE = 'test-table';
    process.env.MAX_TODO_LENGTH = '500';
  });

  it('should create a todo with valid data', async () => {
    const event = {
      body: JSON.stringify({ text: 'Test todo' }),
    };

    mockSend.mockResolvedValueOnce({});

    const result = await create(event);

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toMatchObject({
      id: 'test-uuid-123',
      text: 'Test todo',
      checked: false,
    });
  });

  it('should return 400 for invalid JSON', async () => {
    const event = {
      body: 'invalid json',
    };

    const result = await create(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      error: 'Invalid JSON in request body',
    });
  });

  it('should return 400 for non-string text', async () => {
    const event = {
      body: JSON.stringify({ text: 123 }),
    };

    const result = await create(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      error: 'Todo text must be a string',
    });
  });

  it('should return 400 for empty text', async () => {
    const event = {
      body: JSON.stringify({ text: '   ' }),
    };

    const result = await create(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      error: 'Todo text cannot be empty',
    });
  });

  it('should return 400 for text exceeding max length', async () => {
    const event = {
      body: JSON.stringify({ text: 'a'.repeat(501) }),
    };

    const result = await create(event);

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({
      error: 'Todo text must be 500 characters or less',
    });
  });

  it('should return 500 on database error', async () => {
    const event = {
      body: JSON.stringify({ text: 'Test todo' }),
    };

    mockSend.mockRejectedValueOnce(new Error('Database error'));

    const result = await create(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      error: "Couldn't create the todo item.",
    });
  });
});
