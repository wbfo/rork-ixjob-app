// Simple script to start the backend server
const { exec } = require('child_process');

console.log('🚀 Starting backend server...');

// Check if bun is installed
exec('bun --version', (error) => {
  if (error) {
    console.error('❌ Bun is not installed. Please install Bun first.');
    console.log('   npm install -g bun');
    process.exit(1);
  }

  console.log('✅ Bun is installed');
  
  // Start the server
  console.log('🔄 Starting server on http://localhost:3001');
  
  // Create a simple HTTP server that serves the Hono app
  const server = exec('bun run app/api/[...trpc]+api.ts', {
    env: {
      ...process.env,
      PORT: 3001,
    }
  });

  server.stdout.on('data', (data) => {
    console.log(data.toString().trim());
  });

  server.stderr.on('data', (data) => {
    console.error(data.toString().trim());
  });

  server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });

  // Give the server a moment to start
  setTimeout(() => {
    console.log('✅ Server started');
    console.log('🌐 Backend is running at: http://localhost:3001');
    console.log('🔗 tRPC endpoint: http://localhost:3001/api/trpc');
    console.log('🔗 Health check: http://localhost:3001/api/ping');
    console.log('📝 Press Ctrl+C to stop the server');
  }, 1000);
});