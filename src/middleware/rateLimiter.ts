import { HttpRequest, HttpResponseInit } from "@azure/functions";
import { LRUCache } from "lru-cache";

// In-memory cache to store the last request time for each IP
const requestCache = new LRUCache<string, number>({
  max: 1000, // Maximum number of entries in the cache
  ttl: 1000 * 60 * 5, // Time to live: 5 minutes
});

// Time window for rate limiting (2 seconds in milliseconds)
const RATE_LIMIT_WINDOW = 2000;

export function rateLimiter(
  request: HttpRequest
): { allowed: boolean; response?: HttpResponseInit } {
  // Extract client IP address
  const clientIp = 
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
    request.headers.get('client-ip') || 
    'unknown-ip';

  const now = Date.now();
  const lastRequestTime = requestCache.get(clientIp) || 0;
  
  // Check if the request is within the rate limit window
  if (now - lastRequestTime < RATE_LIMIT_WINDOW) {
    // Request is too frequent
    return {
      allowed: false,
      response: {
        status: 429,
        jsonBody: {
          error: "Too many requests",
          message: "Please wait before making another request",
          retryAfter: Math.ceil((RATE_LIMIT_WINDOW - (now - lastRequestTime)) / 1000)
        },
        headers: {
          'Retry-After': Math.ceil((RATE_LIMIT_WINDOW - (now - lastRequestTime)) / 1000).toString()
        }
      }
    };
  }
  
  // Update the last request time for this IP
  requestCache.set(clientIp, now);
  
  return { allowed: true };
}
