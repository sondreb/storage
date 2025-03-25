# storage
Azure Function that persist incoming JSON data to Azure Blob Storage

## Features

- Processes and stores JSON data in Azure Blob Storage
- Implements rate limiting (1 request per 2 seconds per IP address) to protect against DOS attacks
- Responds with appropriate HTTP status codes and headers for rate limited requests

## Rate Limiting

The API implements rate limiting to protect against denial of service attacks. Each client is limited by their IP address to one request every 2 seconds. If a client exceeds this limit, they will receive a `429 Too Many Requests` response with a `Retry-After` header indicating how long to wait before making another request.
