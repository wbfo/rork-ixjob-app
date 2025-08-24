import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Test database connection and run migrations if needed
export async function initializeDatabase() {
  // Skip database initialization if DATABASE_URL is not provided
  if (!env.DATABASE_URL) {
    console.log('⚠️  DATABASE_URL not configured - running without database');
    console.log('   Database features will be disabled');
    return false;
  }

  try {
    console.log('🔌 Connecting to database...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check if database is empty (no tables)
    const tables = await prisma.$queryRaw<Array<{ table_name: string }>>(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    );
    
    if (tables.length === 0) {
      console.log('📋 Database appears to be empty. Please run migrations:');
      console.log('   npm run db:migrate');
    } else {
      console.log(`📊 Database has ${tables.length} tables`);
    }
    
    return true;
  } catch (error: any) {
    console.error('❌ Database connection failed:');
    
    if (error.code === 'P1001') {
      console.error('   - Cannot reach database server');
      console.error('   - Check if PostgreSQL is running');
      console.error('   - Verify DATABASE_URL in .env file');
    } else if (error.code === 'P1003') {
      console.error('   - Database does not exist');
      console.error('   - Create the database first');
    } else {
      console.error('   - Error:', error.message);
    }
    
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Ensure PostgreSQL is installed and running');
    console.error('   2. Create database: createdb ixjob_dev');
    console.error('   3. Update DATABASE_URL in .env');
    console.error('   4. Run migrations: npm run db:migrate');
    
    return false;
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});