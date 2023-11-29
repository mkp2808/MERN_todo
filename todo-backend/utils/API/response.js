class APIRequestResponse {
   constructor() {
      try {
         this.responseMessages = {
            SUCCESS: "Success",
            ERROR: "Error",
            NOT_FOUND: "Not found",
            UNAUTHORIZED: "Unauthorized",
            FORBIDDEN: "Forbidden",
            BAD_REQUEST: "Bad request",
            INTERNAL_SERVER_ERROR: "Internal server error",
            CONFLICT: "Conflict",
            UNPROCESSABLE_ENTITY: "Unprocessable entity",
            TOO_MANY_REQUESTS: "Too many requests",
            CREATED: "User created",
         };

         this.responseCodes = {
            SUCCESS: 200,
            CREATED: 201,
            NO_CONTENT: 204,
            BAD_REQUEST: 400,
            UNAUTHORIZED: 401,
            FORBIDDEN: 403,
            NOT_FOUND: 404,
            CONFLICT: 409,
            UNPROCESSABLE_ENTITY: 422,
            TOO_MANY_REQUESTS: 429,
            INTERNAL_SERVER_ERROR: 500,
         };
      } catch (error) {
         throw error;
      }
   }
}
module.exports = APIRequestResponse;

/*
 ----------------Uses of codes

 HTTP status codes are used to indicate the outcome of an HTTP request made to a web server. Here's a brief explanation of when to use some of the status codes you've mentioned and with which HTTP operations:

 1. SUCCESS (200):
    - Use with successful GET, POST, PUT, or DELETE operations.
    - Indicates that the request was successful, and the server is returning the requested data.

 2. CREATED (201):
    - Use with a successful POST request that results in the creation of a new resource on the server.
    - Indicates that the request was successful, and a new resource has been created.

 3. NO_CONTENT (204):
    - Use with a successful request where there is no data to return in the response body.
    - Often used with successful DELETE requests to indicate that the resource has been deleted but there is no data to return.

 4. BAD_REQUEST (400):
    - Use when the client's request is malformed or invalid.
    - Indicates that the server cannot understand or process the request due to client-side errors.

 5. UNAUTHORIZED (401):
    - Use when authentication is required, and the provided credentials are missing or incorrect.
    - Indicates that the client needs to provide valid credentials to access the resource.

 6. FORBIDDEN (403):
    - Use when the client is authenticated but does not have permission to access the requested resource.
    - Indicates that the client lacks the necessary permissions.

 7. NOT_FOUND (404):
    - Use when the requested resource is not found on the server.
    - Indicates that the URL or resource does not exist.

 8. CONFLICT (409):
    - Use when there is a conflict with the current state of the resource, typically with a PUT or POST request.
    - Indicates that the request cannot be completed due to a resource conflict.

 9. UNPROCESSABLE_ENTITY (422):
    - Use when the server understands the request, but it cannot process it due to semantic errors (e.g., validation errors).
    - Often used for validation failures in API requests.

 10. TOO_MANY_REQUESTS (429):
     - Use when the client has made too many requests in a given time frame.
     - Indicates that the client should slow down and respect rate limits.

 11. INTERNAL_SERVER_ERROR (500):
     - Use when an unexpected server error occurs that prevents the request from being fulfilled.
     - Indicates a problem on the server's side, and the client should try the request again later.

 These are common HTTP status codes used in web development to communicate the outcome of requests and help clients and servers understand how to handle different situations. The choice of which status code to use depends on the specific circumstances and the HTTP method being used.

 */
