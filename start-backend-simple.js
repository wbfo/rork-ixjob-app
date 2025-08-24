#!/usr/bin/env node

const { serve } = require('@hono/node-server');

console.log('🚀 Starting ixJOB Backend Server...');
console.log('📍 Using Hono/tRPC server on port 3001\n');

// Import and start the Hono app
async function startServer() {
  try {
    // Import the Hono app
    const { default: app } = await import('./app/api/[...trpc]+api.ts');
    
    const port = process.env.PORT || 3001;
    
    console.log(`🔄 Starting server on port ${port}...`);
    
    // Start the server
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
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('💡 Make sure all dependencies are installed:');
    console.error('   npm install');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});

startServer().catch(console.error);