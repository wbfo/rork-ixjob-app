#!/usr/bin/env node

const { spawn, exec } = require('child_process');

console.log('🚀 ixJOB Backend Server Startup');
console.log('================================\n');

// Function to check if a command exists
function commandExists(command) {
  return new Promise((resolve) => {
    exec(`${command} --version`, (error) => {
      resolve(!error);
    });
  });
}

// Function to start the server
function startServer(command, args, description) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 ${description}...`);
    
    const serverProcess = spawn(command, args, {
      stdio: 'inherit',
      env: {
        ...process.env,
        PORT: '3001',
        NODE_ENV: 'development'
      }
    });

    serverProcess.on('error', (error) => {
      reject(error);
    });

    // Give the server time to start
    setTimeout(() => {
      resolve(serverProcess);
    }, 2000);
  });
}

async function main() {
  try {
    // Check if tsx is available
    const tsxExists = await commandExists('npx tsx');
    
    if (!tsxExists) {
      console.log('📦 Installing tsx...');
      await new Promise((resolve, reject) => {
        exec('npm install tsx', (error) => {
          if (error) reject(error);
          else resolve();
        });
      });
      console.log('✅ tsx installed successfully');
    }

    // Start the server
    console.log('🎯 Starting Hono/tRPC server on port 3001...');
    
    const serverProcess = await startServer(
      'npx', 
      ['tsx', 'app/api/[...trpc]+api.ts'], 
      'Starting TypeScript server'
    );

    console.log('\n🎉 Backend server is now running!');
    console.log('📍 Server: http://localhost:3001');
    console.log('🏥 Health: http://localhost:3001/api/health');
    console.log('📱 Ping: http://localhost:3001/api/ping');
    console.log('🔗 tRPC: http://localhost:3001/api/trpc');
    console.log('\n✅ Your frontend network errors should now be resolved!');
    console.log('📝 Press Ctrl+C to stop the server\n');

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

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('\n💡 Manual steps to try:');
    console.error('   1. npm install');
    console.error('   2. npx tsx app/api/[...trpc]+api.ts');
    console.error('   3. Or run: node start-backend.js');
    process.exit(1);
  }
}

main();