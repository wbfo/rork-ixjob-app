#!/usr/bin/env node

console.log('🚀 Starting ixJOB Backend Server...');
console.log('📍 Checking dependencies and starting server...\n');

const { spawn, exec } = require('child_process');

// Check if tsx is available
exec('npx tsx --version', (error) => {
  if (error) {
    console.log('❌ tsx not found, installing...');
    exec('npm install tsx', (installError) => {
      if (installError) {
        console.error('❌ Failed to install tsx:', installError.message);
        process.exit(1);
      }
      startServer();
    });
  } else {
    console.log('✅ tsx is available');
    startServer();
  }
});

function startServer() {
  console.log('🔄 Starting Hono/tRPC server...');
  
  const serverProcess = spawn('npx', ['tsx', 'app/api/[...trpc]+api.ts'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PORT: '3001',
      NODE_ENV: 'development'
    }
  });

  serverProcess.on('error', (error) => {
    console.error('❌ Failed to start server:', error.message);
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
}