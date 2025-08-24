import { Request, Response } from 'express';
import { env, getAvailableAIServices } from '../config/env';
import { prisma } from '../lib/prisma';

export class HealthController {
  static async getHealth(req: Request, res: Response) {
    try {
      const startTime = Date.now();
      
      // Test database connection only if DATABASE_URL is configured
      let dbStatus = 'not_configured';
      let dbLatency = 0;
      
      if (env.DATABASE_URL) {
        try {
          const dbStart = Date.now();
          await prisma.$queryRaw`SELECT 1`;
          dbLatency = Date.now() - dbStart;
          dbStatus = 'connected';
        } catch (error) {
          console.error('❌ Database health check failed:', error);
          dbStatus = 'error';
        }
      }
      
      const responseTime = Date.now() - startTime;
      const aiServices = getAvailableAIServices();
      
      const healthData = {
        ok: true,
        env: env.NODE_ENV,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        responseTime: `${responseTime}ms`,
        database: {
          status: dbStatus,
          latency: dbStatus === 'connected' ? `${dbLatency}ms` : 'N/A'
        },
        services: {
          ai: aiServices.length > 0 ? aiServices : ['None configured'],
          cors: 'enabled',
          rateLimit: 'enabled'
        },
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
        },
        version: '1.0.0'
      };
      
      // Always return 200 for health check in development
      const statusCode = env.NODE_ENV === 'development' ? 200 : (dbStatus === 'connected' ? 200 : 503);
      
      res.status(statusCode).json(healthData);
    } catch (error) {
      console.error('❌ Health check error:', error);
      res.status(500).json({
        ok: false,
        env: env.NODE_ENV,
        error: 'Health check failed',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  static async getReadiness(req: Request, res: Response) {
    try {
      // Skip database check if not configured
      if (!env.DATABASE_URL) {
        res.json({
          ready: true,
          timestamp: new Date().toISOString(),
          checks: {
            database: 'not_configured',
            environment: 'ok'
          }
        });
        return;
      }
      
      // More thorough readiness check
      await prisma.$queryRaw`SELECT 1`;
      
      res.json({
        ready: true,
        timestamp: new Date().toISOString(),
        checks: {
          database: 'ok',
          environment: 'ok'
        }
      });
    } catch (error) {
      console.error('❌ Readiness check failed:', error);
      res.status(503).json({
        ready: false,
        timestamp: new Date().toISOString(),
        error: 'Service not ready'
      });
    }
  }
}