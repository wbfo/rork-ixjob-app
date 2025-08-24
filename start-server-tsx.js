#!/usr/bin/env node

// Simple Node.js script to start the backend server
const { spawn } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting ixJOB Backend Server...');
console.log('📍 Using Hono/tRPC server on port 3001\n');

// Check if the tRPC API file exists
if (!fs.existsSync('./app/api/[...trpc]+api.ts')) {
  console.error('❌ tRPC API file not found at ./app/api/[...trpc]+api.ts');
  process.exit(1);
}

// Start the server using tsx to run TypeScript directly
const serverProcess = spawn('npx', ['tsx', './app/api/[...trpc]+api.ts'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: '3001',
    NODE_ENV: 'development'
  }
});

serverProcess.on('error', (error) => {
  console.error('❌ Failed to start server:', error.message);
  console.error('💡 Make sure tsx is installed: npm install -g tsx');
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

console.log('🎉 Server starting...');
console.log('📍 Server will be available at: http://localhost:3001');
console.log('🏥 Health check: http://localhost:3001/api/health');
console.log('📱 Ping endpoint: http://localhost:3001/api/ping');
console.log('🔗 tRPC endpoint: http://localhost:3001/api/trpc');
console.log('📝 Press Ctrl+C to stop the server\n');