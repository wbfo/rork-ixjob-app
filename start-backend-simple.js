#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('🚀 Starting ixJOB Backend Server...');
console.log('📍 Using Hono/tRPC server on port 3001\n');

// Start the server using tsx to handle TypeScript
function startServer() {
  const port = process.env.PORT || 3001;
  
  console.log(`🔄 Starting server on port ${port}...`);
  
  // Use tsx to run the TypeScript file directly
  const serverProcess = spawn('npx', ['tsx', 'app/api/[...trpc]+api.ts'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: port,
      NODE_ENV: 'development'
    }
  });
  
  serverProcess.on('error', (error) => {
    console.error('❌ Failed to start server:', error.message);
    console.error('💡 Make sure all dependencies are installed:');
    console.error('   npm install');
    console.error('   Or try: bun install');
    process.exit(1);
  });
  
  // Give the server time to start up
  setTimeout(() => {
    console.log('\n🎉 Server should be starting...');
    console.log(`📍 Local: http://localhost:${port}`);
    console.log(`📱 Network: http://0.0.0.0:${port}`);
    console.log(`🏥 Health check: http://localhost:${port}/api/health`);
    console.log(`📱 Ping endpoint: http://localhost:${port}/api/ping`);
    console.log(`🔗 tRPC endpoint: http://localhost:${port}/api/trpc`);
    console.log('\n✅ Your frontend should now be able to connect!');
    console.log('📝 Press Ctrl+C to stop the server\n');
  }, 2000);
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    serverProcess.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    serverProcess.kill('SIGTERM');
    process.exit(0);
  });
}

startServer();