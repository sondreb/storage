# storage
Azure Function that persist incoming JSON data to Azure Blob Storage

## Features

- Processes and validates JSON data before storing in Azure Table Storage
- Uses "freeid" as PartitionKey and generates a unique UUID as RowKey
- Implements rate limiting (1 request per 2 seconds per IP address) to protect against DOS attacks
- Responds with appropriate HTTP status codes and headers for rate limited requests

## Rate Limiting

The API implements rate limiting to protect against denial of service attacks. Each client is limited by their IP address to one request every 2 seconds. If a client exceeds this limit, they will receive a `429 Too Many Requests` response with a `Retry-After` header indicating how long to wait before making another request.

## API Usage

### Store JSON Data

**Endpoint**: POST /api/persist

**Request Body**: Must be valid JSON

**Response**:
- 201 Created: Data was successfully stored
- 400 Bad Request: Invalid JSON provided
- 405 Method Not Allowed: Method other than POST was used
- 429 Too Many Requests: Rate limit exceeded

**Success Response Body**:
```json
{
  "success": true,
  "id": "unique-row-key",
  "message": "Data stored successfully"
}
```
