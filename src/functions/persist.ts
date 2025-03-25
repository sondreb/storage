import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { rateLimiter } from "../middleware/rateLimiter";
import { TableStorageService } from "../services/tableStorageService";

export async function persist(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    
    // Apply rate limiting
    const rateLimitResult = rateLimiter(request);
    if (!rateLimitResult.allowed) {
        return rateLimitResult.response;
    }

    // Only allow POST methods for persisting data
    if (request.method !== "POST") {
        return {
            status: 405,
            jsonBody: { error: "Method not allowed", message: "Please use POST to submit data" }
        };
    }

    try {
        // Try to parse the request body as JSON
        let jsonData: any;

        try {
            const body = await request.json();
            jsonData = body;
        } catch (error) {
            return {
                status: 400,
                jsonBody: { 
                    error: "Invalid JSON", 
                    message: "Request body must be valid JSON"
                }
            };
        }

        // Store the data in Azure Table Storage
        const tableService = new TableStorageService();
        const rowKey = await tableService.storeJsonData(jsonData);

        return {
            status: 201,
            jsonBody: {
                success: true,
                id: rowKey,
                message: "Data stored successfully"
            }
        };
    } catch (error) {
        context.error("Error processing request:", error);
        
        return {
            status: 500,
            jsonBody: {
                error: "Internal Server Error",
                message: "Failed to process the request"
            }
        };
    }
};

app.http('persist', {
    methods: ['POST', 'GET'],
    authLevel: 'anonymous',
    handler: persist
});
