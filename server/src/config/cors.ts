import cors from 'cors';
import { getCorsOrigins, env } from './env';

const corsOrigins = getCorsOrigins();

// Add dynamic LAN IP detection for development
const getDynamicOrigins = (): (string | RegExp)[] => {
  const origins: (string | RegExp)[] = [...corsOrigins];
  
  if (env.NODE_ENV === 'development') {
    // Add common Expo development patterns
    origins.push(
      /^exp:\/\/.*/, // Expo Go app
      /^http:\/\/.*\.ngrok-free\.app$/, // ngrok tunneling
      /^https:\/\/.*\.ngrok-free\.app$/, // ngrok tunneling HTTPS
      /^http:\/\/192\.168\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,5}$/, // LAN IPs
      /^http:\/\/10\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,5}$/, // Private network
      /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,5}$/ // Private network
    );
  }
  
  return origins;
};

export const corsConfig = cors({
  origin: (origin: any, callback: any) => {
    const allowedOrigins = getDynamicOrigins();
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      }
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400 // 24 hours
});

// Log CORS configuration on startup
export const logCorsConfig = () => {
  console.log('🌐 CORS Configuration:');
  corsOrigins.forEach(origin => {
    console.log(`  ✅ ${origin}`);
  });
  if (env.NODE_ENV === 'development') {
    console.log('  ✅ Dynamic LAN IPs (192.168.x.x, 10.x.x.x, 172.16-31.x.x)');
    console.log('  ✅ Expo Go patterns (exp://)');
    console.log('  ✅ ngrok tunneling (*.ngrok-free.app)');
  }
};