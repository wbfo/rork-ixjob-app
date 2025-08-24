#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting ixJOB Backend Server...');
console.log('📍 Attempting multiple startup methods...\n');

// Method 1: Try the TypeScript server with tsx
function tryTypeScriptServer() {
  return new Promise((resolve, reject) => {
    console.log('🔄 Method 1: Starting TypeScript server with tsx...');
    
    // Check if tsx is available
    exec('npx tsx --version', (error) => {
      if (error) {
        console.log('❌ tsx not available, skipping TypeScript server');
        reject(new Error('tsx not available'));
        return;
      }
      
      console.log('✅ tsx found, starting TypeScript server...');
      
      const serverProcess = spawn('npx', ['tsx', 'watch', 'server/src/index.ts'], {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'development', PORT: '3001' }
      });
      
      serverProcess.on('error', (err) => {
        console.log('❌ TypeScript server failed:', err.message);
        reject(err);
      });
      
      // Give it a few seconds to start
      setTimeout(() => {
        console.log('✅ TypeScript server started successfully');
        resolve(serverProcess);
      }, 3000);
    });
  });
}

// Method 2: Try the shell script
function tryShellScript() {
  return new Promise((resolve, reject) => {
    console.log('🔄 Method 2: Starting with shell script...');
    
    if (!fs.existsSync('server/start-dev.sh')) {
      reject(new Error('Shell script not found'));
      return;
    }
    
    const serverProcess = spawn('bash', ['server/start-dev.sh'], {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    serverProcess.on('error', (err) => {
      console.log('❌ Shell script failed:', err.message);
      reject(err);
    });
    
    setTimeout(() => {
      console.log('✅ Shell script server started successfully');
      resolve(serverProcess);
    }, 3000);
  });
}

// Method 3: Try the simple server
function trySimpleServer() {
  return new Promise((resolve, reject) => {
    console.log('🔄 Method 3: Starting simple Node.js server...');
    
    if (!fs.existsSync('server/simple-server.js')) {
      reject(new Error('Simple server not found'));
      return;
    }
    
    const serverProcess = spawn('node', ['server/simple-server.js'], {
      stdio: 'inherit',
      env: { ...process.env, PORT: '3001' }
    });
    
    serverProcess.on('error', (err) => {
      console.log('❌ Simple server failed:', err.message);
      reject(err);
    });
    
    setTimeout(() => {
      console.log('✅ Simple server started successfully');
      resolve(serverProcess);
    }, 2000);
  });
}

// Method 4: Try the Hono/tRPC server
function tryHonoServer() {
  return new Promise((resolve, reject) => {
    console.log('🔄 Method 4: Starting Hono/tRPC server...');
    
    const serverProcess = spawn('node', ['start-backend.js'], {
      stdio: 'inherit',
      env: { ...process.env, PORT: '3001' }
    });
    
    serverProcess.on('error', (err) => {
      console.log('❌ Hono server failed:', err.message);
      reject(err);
    });
    
    setTimeout(() => {
      console.log('✅ Hono server started successfully');
      resolve(serverProcess);
    }, 3000);
  });
}

// Try methods in order
async function startServer() {
  const methods = [
    tryTypeScriptServer,
    tryShellScript, 
    trySimpleServer,
    tryHonoServer
  ];
  
  for (const method of methods) {
    try {
      const serverProcess = await method();
      
      console.log('\n🎉 Server started successfully!');
      console.log('📍 Server running on: http://localhost:3001');
      console.log('🏥 Health check: http://localhost:3001/health');
      console.log('📱 Ping endpoint: http://localhost:3001/ping');
      console.log('🔗 API endpoint: http://localhost:3001/api');
      console.log('\n✅ Your frontend should now be able to connect!');
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
      
      return; // Success, exit the loop
      
    } catch (error) {
      console.log(`❌ Method failed: ${error.message}\n`);
      continue; // Try next method
    }
  }
  
  console.log('❌ All startup methods failed!');
  console.log('💡 Manual steps to try:');
  console.log('   1. cd server && npm install');
  console.log('   2. npx tsx watch src/index.ts');
  console.log('   3. Or: node simple-server.js');
  process.exit(1);
}

startServer().catch(console.error);