# storage
Azure Function that persist incoming JSON data to Azure Blob Storage

## Features

- Processes and validates JSON data before storing in Azure Blob Storage
- Supports large JSON files (over 1MB)
- Stores blobs securely in a "freeid" folder with unique UUIDs as filenames
- All blobs are stored with private access only - no public access allowed
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
  "id": "unique-blob-id",
  "message": "Data stored successfully"
}
```

## Security

All blobs are stored with private access permissions. Access to the stored data requires appropriate Azure Storage authentication and authorization.
