import app from "@/backend/hono";
import { serve } from "@hono/node-server";

// Export the Hono app for Expo Router API routes
export default app;

// Start the server if this file is run directly
if (require.main === module) {
  const port = process.env.PORT || 3001;
  console.log(`🚀 Starting server on port ${port}...`);
  
  serve({
    fetch: app.fetch,
    port: Number(port),
    hostname: '0.0.0.0' // Allow connections from any IP (for mobile devices)
  });
  
  console.log('\n🎉 Server started successfully!');
  console.log(`📍 Local: http://localhost:${port}`);
  console.log(`📱 Network: http://0.0.0.0:${port}`);
  console.log(`🏥 Health check: http://localhost:${port}/api/health`);
  console.log(`📱 Ping endpoint: http://localhost:${port}/api/ping`);
  console.log(`🔗 tRPC endpoint: http://localhost:${port}/api/trpc`);
  console.log('\n✅ Your frontend should now be able to connect!');
  console.log('📝 Press Ctrl+C to stop the server\n');
}