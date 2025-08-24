#!/usr/bin/env node

console.log('🚀 Starting ixJOB Backend Server...');
console.log('📍 Using Hono/tRPC server on port 3001\n');

// Simple Node.js server startup
const { spawn } = require('child_process');

function startServer() {
  const port = process.env.PORT || 3001;
  
  console.log(`🔄 Starting server on port ${port}...`);
  console.log('📦 Using tsx to run TypeScript directly...\n');
  
  // Start the server using tsx
  const serverProcess = spawn('npx', ['tsx', 'app/api/[...trpc]+api.ts'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: port,
      NODE_ENV: 'development'
    }
  });
  
  serverProcess.on('error', (error) => {
    console.error('\n❌ Failed to start server:', error.message);
    console.error('\n💡 Troubleshooting steps:');
    console.error('   1. Make sure you have tsx installed: npm install tsx');
    console.error('   2. Try running manually: npx tsx app/api/[...trpc]+api.ts');
    console.error('   3. Check if port 3001 is available');
    console.error('   4. Ensure all dependencies are installed: npm install');
    process.exit(1);
  });
  
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
  
  // Show success message after a delay
  setTimeout(() => {
    console.log('\n🎉 Server startup initiated!');
    console.log('📍 If successful, server will be available at:');
    console.log(`   • Local: http://localhost:${port}`);
    console.log(`   • Network: http://0.0.0.0:${port}`);
    console.log(`   • Health: http://localhost:${port}/api/health`);
    console.log(`   • Ping: http://localhost:${port}/api/ping`);
    console.log(`   • tRPC: http://localhost:${port}/api/trpc`);
    console.log('\n✅ Your frontend should now be able to connect!');
    console.log('📝 Press Ctrl+C to stop the server\n');
  }, 1000);
}

startServer();