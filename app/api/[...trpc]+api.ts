import app from "@/backend/hono";
import { serve } from "@hono/node-server";

// Export the Hono app for Expo Router API routes
export default app;

// Start the server if this file is run directly
if (require.main === module) {
  const port = process.env.PORT || 3001;
  console.log(`Starting server on port ${port}...`);
  serve({
    fetch: app.fetch,
    port: Number(port),
  });
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/api/ping`);
  console.log(`tRPC endpoint: http://localhost:${port}/api/trpc`);
}