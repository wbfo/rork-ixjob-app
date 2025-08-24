import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { env, getAvailableAIServices } from './config/env';
import { corsConfig, logCorsConfig } from './config/cors';
import { initializeDatabase } from './lib/prisma';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import { getLocalNetworkIP, findAvailablePort } from './utils/network';
import healthRoutes from './routes/health';

const app = express();

// Security and performance middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Allow embedding for development
  contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false
}));
app.use(compression());
app.use(corsConfig);

// Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing with increased limits for file uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api', apiLimiter);

// Health check routes (no rate limiting)
app.use('/', healthRoutes);

// API routes placeholder
app.use('/api', (req: express.Request, res: express.Response) => {
  res.json({
    message: 'ixJOB API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      ready: '/ready',
      ping: '/ping'
    }
  });
});

// 404 handler
app.use('*', (req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: ['/health', '/ready', '/ping', '/api']
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Startup function
async function startServer() {
  try {
    console.log('🚀 Starting ixJOB API Server...');
    console.log(`📦 Environment: ${env.NODE_ENV}`);
    
    // Initialize database
    const dbConnected = await initializeDatabase();
    if (!dbConnected && env.NODE_ENV === 'production') {
      console.error('❌ Database connection required in production');
      process.exit(1);
    }
    
    if (!dbConnected && env.NODE_ENV === 'development') {
      console.log('🚀 Starting server without database (development mode)');
    }
    
    // Find available port
    const port = await findAvailablePort(env.PORT);
    if (port !== env.PORT) {
      console.log(`⚠️  Port ${env.PORT} was taken, using port ${port} instead`);
    }
    
    // Start server
    const server = app.listen(port, '0.0.0.0', () => {
      const localIP = getLocalNetworkIP();
      
      console.log('\n🎉 Server started successfully!');
      console.log(`📍 Local: http://localhost:${port}`);
      if (localIP) {
        console.log(`📱 Network: http://${localIP}:${port}`);
        console.log(`📱 Expo Go: Use http://${localIP}:${port} in EXPO_PUBLIC_API_BASE`);
      }
      console.log(`🏥 Health: http://localhost:${port}/health`);
      
      // Log configuration
      logCorsConfig();
      
      const aiServices = getAvailableAIServices();
      if (aiServices.length > 0) {
        console.log(`🤖 AI Services: ${aiServices.join(', ')}`);
      } else {
        console.log('⚠️  No AI services configured (add OPENAI_API_KEY or GEMINI_API_KEY)');
      }
      
      console.log('\n✅ Server is ready to accept connections');
    });
    
    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    };
    
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
  } catch (error) {
    console.error('❌ Failed to start server:');
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
      if (env.NODE_ENV === 'development') {
        console.error(`   Stack: ${error.stack}`);
      }
    } else {
      console.error('   Unknown error:', error);
    }
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();