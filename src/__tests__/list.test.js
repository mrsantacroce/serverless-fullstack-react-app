// Mock the AWS SDK
jest.mock('@aws-sdk/lib-dynamodb', () => ({
  ScanCommand: jest.fn(),
  DynamoDBDocumentClient: {
    from: jest.fn(),
  },
}));

// Mock the docClient
const mockSend = jest.fn();
jest.mock('../functions/dynamodb', () => ({
  send: (...args) => mockSend(...args),
}));

const { list } = require('../functions/list');

describe('list function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.DYNAMODB_TABLE = 'test-table';
  });

  it('should return all todos successfully', async () => {
    const mockItems = [
      {
        id: '1',
        text: 'Test todo 1',
        checked: false,
        createdAt: 1234567890,
        updatedAt: 1234567890,
      },
      {
        id: '2',
        text: 'Test todo 2',
        checked: true,
        createdAt: 1234567891,
        updatedAt: 1234567891,
      },
    ];

    mockSend.mockResolvedValueOnce({ Items: mockItems });

    const result = await list();

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockItems);
    expect(result.headers['Access-Control-Allow-Origin']).toBe('*');
  });

  it('should return empty array when no todos exist', async () => {
    mockSend.mockResolvedValueOnce({ Items: [] });

    const result = await list();

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual([]);
  });

  it('should return 500 on database error', async () => {
    mockSend.mockRejectedValueOnce(new Error('Database error'));

    const result = await list();

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      error: "Couldn't fetch the todo items.",
    });
  });
});
