#!/usr/bin/env node

const http = require('http');
const url = require('url');
const querystring = require('querystring');

// Server configuration
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

// Utility functions
function getTimestamp() {
  return new Date().toISOString();
}

function sendJSON(res, data, statusCode = 200) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400'
  });
  res.end(JSON.stringify(data, null, 2));
}

function sendError(res, message, statusCode = 500) {
  sendJSON(res, {
    error: true,
    message,
    timestamp: getTimestamp()
  }, statusCode);
}

function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const parsed = body ? JSON.parse(body) : {};
      callback(null, parsed);
    } catch (err) {
      callback(err, null);
    }
  });
}

// Mock tRPC response generator
function createTRPCResponse(data) {
  return {
    result: {
      data: data
    }
  };
}

// Route handlers
const routes = {
  '/ping': (req, res) => {
    console.log(`📡 ${req.method} /ping - Health check`);
    sendJSON(res, {
      message: 'pong',
      timestamp: getTimestamp(),
      server: 'ixJOB Minimal Server',
      uptime: process.uptime()
    });
  },

  '/health': (req, res) => {
    console.log(`🏥 ${req.method} /health - Health status`);
    sendJSON(res, {
      ok: true,
      message: 'ixJOB Server is running',
      timestamp: getTimestamp(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: Math.floor(process.uptime()),
      memory: process.memoryUsage()
    });
  },

  '/ready': (req, res) => {
    console.log(`✅ ${req.method} /ready - Readiness check`);
    sendJSON(res, {
      ready: true,
      timestamp: getTimestamp(),
      status: 'operational'
    });
  },

  '/': (req, res) => {
    console.log(`🏠 ${req.method} / - Server info`);
    sendJSON(res, {
      name: 'ixJOB Minimal Server',
      version: '1.0.0',
      timestamp: getTimestamp(),
      endpoints: [
        'GET /ping - Health check',
        'GET /health - Detailed health status',
        'GET /ready - Readiness probe',
        'GET /api - API information',
        'POST /api/trpc/* - Mock tRPC endpoints'
      ],
      urls: {
        local: `http://localhost:${PORT}`,
        network: `http://${HOST}:${PORT}`
      }
    });
  },

  '/api': (req, res) => {
    console.log(`🔌 ${req.method} /api - API info`);
    sendJSON(res, {
      name: 'ixJOB API',
      version: '1.0.0',
      timestamp: getTimestamp(),
      trpc: {
        endpoint: '/api/trpc',
        procedures: [
          'example.hi - Hello world procedure',
          'auth.login - Mock authentication',
          'resume.upload - Mock resume upload',
          'interview.feedback - Mock interview feedback'
        ]
      },
      status: 'operational'
    });
  }
};

// tRPC mock handlers
const trpcRoutes = {
  'example.hi': () => ({
    message: 'Hello from ixJOB tRPC!',
    timestamp: getTimestamp(),
    server: 'minimal'
  }),

  'auth.login': (input) => ({
    success: true,
    user: {
      id: 'mock-user-123',
      email: input?.email || 'demo@ixjob.com',
      name: 'Demo User'
    },
    token: 'mock-jwt-token-' + Date.now(),
    timestamp: getTimestamp()
  }),

  'resume.upload': (input) => ({
    success: true,
    resumeId: 'resume-' + Date.now(),
    analysis: {
      sections: ['contact', 'experience', 'education', 'skills'],
      score: 85,
      suggestions: ['Add more quantified achievements', 'Include relevant keywords']
    },
    timestamp: getTimestamp()
  }),

  'interview.feedback': (input) => ({
    success: true,
    feedback: {
      score: 78,
      strengths: ['Clear communication', 'Relevant examples'],
      improvements: ['More specific metrics', 'Better STAR structure'],
      starAnalysis: {
        situation: 'Well defined',
        task: 'Clear objectives',
        action: 'Good detail',
        result: 'Could be more quantified'
      }
    },
    timestamp: getTimestamp()
  })
};

// Main request handler
function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  // Handle tRPC routes
  if (pathname.startsWith('/api/trpc/')) {
    const procedure = pathname.replace('/api/trpc/', '').replace(/\?.*$/, '');
    console.log(`🔧 ${method} /api/trpc/${procedure} - tRPC procedure`);
    
    if (method === 'POST') {
      parseBody(req, (err, body) => {
        if (err) {
          sendError(res, 'Invalid JSON body', 400);
          return;
        }
        
        const handler = trpcRoutes[procedure];
        if (handler) {
          try {
            const result = handler(body?.input);
            sendJSON(res, createTRPCResponse(result));
          } catch (error) {
            console.error(`❌ tRPC error in ${procedure}:`, error.message);
            sendError(res, `tRPC procedure error: ${error.message}`, 500);
          }
        } else {
          sendError(res, `tRPC procedure not found: ${procedure}`, 404);
        }
      });
    } else {
      // Handle GET requests for tRPC (query procedures)
      const handler = trpcRoutes[procedure];
      if (handler) {
        try {
          const result = handler(parsedUrl.query);
          sendJSON(res, createTRPCResponse(result));
        } catch (error) {
          console.error(`❌ tRPC error in ${procedure}:`, error.message);
          sendError(res, `tRPC procedure error: ${error.message}`, 500);
        }
      } else {
        sendError(res, `tRPC procedure not found: ${procedure}`, 404);
      }
    }
    return;
  }

  // Handle regular routes
  const handler = routes[pathname];
  if (handler) {
    try {
      handler(req, res);
    } catch (error) {
      console.error(`❌ Route error for ${pathname}:`, error.message);
      sendError(res, `Server error: ${error.message}`, 500);
    }
  } else {
    console.log(`❓ ${method} ${pathname} - Route not found`);
    sendError(res, `Route not found: ${pathname}`, 404);
  }
}

// Create and start server
const server = http.createServer(handleRequest);

// Error handling
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.log(`💡 Try: lsof -ti:${PORT} | xargs kill -9`);
    console.log(`💡 Or use a different port: PORT=3002 node minimal-server.js`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err.message);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down...');
  server.close(() => {
    process.exit(0);
  });
});

// Start server
server.listen(PORT, HOST, () => {
  console.log('\n🚀 ixJOB Minimal Server Started!');
  console.log('────────────────────────────────────────');
  console.log(`📍 Local:    http://localhost:${PORT}`);
  console.log(`🌐 Network:  http://${HOST}:${PORT}`);
  console.log('────────────────────────────────────────');
  console.log('📋 Available Endpoints:');
  console.log('   GET  /ping          - Health check');
  console.log('   GET  /health        - Detailed status');
  console.log('   GET  /ready         - Readiness probe');
  console.log('   GET  /api           - API information');
  console.log('   POST /api/trpc/*    - Mock tRPC procedures');
  console.log('────────────────────────────────────────');
  console.log('🔧 Mock tRPC Procedures:');
  console.log('   example.hi          - Hello world');
  console.log('   auth.login          - Mock authentication');
  console.log('   resume.upload       - Mock resume upload');
  console.log('   interview.feedback  - Mock interview feedback');
  console.log('────────────────────────────────────────');
  console.log('💡 Usage: curl http://localhost:3001/ping');
  console.log('🛑 Stop:  Ctrl+C or kill process');
  console.log('────────────────────────────────────────\n');
  
  // Log server info
  console.log(`⏰ Started at: ${getTimestamp()}`);
  console.log(`🔧 Node.js: ${process.version}`);
  console.log(`💾 Memory: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
  console.log(`🆔 PID: ${process.pid}\n`);
});