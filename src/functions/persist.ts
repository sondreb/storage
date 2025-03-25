import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { rateLimiter } from "../middleware/rateLimiter";

export async function persist(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    
    // Apply rate limiting
    const rateLimitResult = rateLimiter(request);
    if (!rateLimitResult.allowed) {
        return rateLimitResult.response;
    }

    const name = request.query.get('name') || await request.text() || 'world';

    return { body: `Hello, ${name}!` };
};

app.http('persist', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: persist
});
