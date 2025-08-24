#!/bin/bash

# ixJOB Backend Setup Script
echo "🚀 Setting up ixJOB Backend Server..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    echo "   Please update Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Navigate to server directory
cd server || { echo "❌ Server directory not found"; exit 1; }

# Create package.json if it doesn't exist
if [ ! -f "package.json" ]; then
    echo "📦 Creating package.json..."
    cat > package.json << 'EOF'
{
  "name": "rork-server",
  "version": "1.0.0",
  "description": "Backend server for Rork app",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^5.7.1",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-rate-limit": "^7.1.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/compression": "^1.7.5",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/morgan": "^1.9.9",
    "@types/node": "^20.10.5",
    "prisma": "^5.7.1",
    "tsx": "^4.6.2",
    "typescript": "^5.3.3"
  },
  "keywords": [
    "express",
    "typescript",
    "prisma",
    "api"
  ],
  "author": "Rork",
  "license": "MIT"
}
EOF
    echo "✅ package.json created"
fi

# Create tsconfig.json if it doesn't exist
if [ ! -f "tsconfig.json" ]; then
    echo "🔧 Creating tsconfig.json..."
    cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "CommonJS",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "allowJs": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "declaration": true,
    "declarationMap": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
EOF
    echo "✅ tsconfig.json created"
fi

# Install dependencies
echo "📦 Installing server dependencies..."
npm install

# Check if PostgreSQL is available
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL detected"
    
    # Check if database exists
    if psql -lqt | cut -d \| -f 1 | grep -qw ixjob_dev; then
        echo "✅ Database 'ixjob_dev' already exists"
    else
        echo "📊 Creating database 'ixjob_dev'..."
        createdb ixjob_dev || echo "⚠️  Could not create database automatically. Please create it manually:"
        echo "   createdb ixjob_dev"
    fi
else
    echo "⚠️  PostgreSQL not found. Please install and configure PostgreSQL:"
    echo "   macOS: brew install postgresql"
    echo "   Ubuntu: sudo apt install postgresql"
    echo "   Windows: https://www.postgresql.org/download/windows/"
fi

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update DATABASE_URL in .env with your PostgreSQL credentials"
else
    echo "✅ .env file already exists"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️  Running database migrations..."
npx prisma migrate dev --name init || echo "⚠️  Migration failed. Please check your database connection."

echo ""
echo "🎉 Backend setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Update server/.env with your database credentials"
echo "   2. Start the server: cd server && npm run dev"
echo "   3. Update app/.env with your server URL"
echo "   4. Test connection: curl http://localhost:3001/health"
echo ""
echo "📱 For mobile device testing:"
echo "   1. Find your LAN IP: ifconfig | grep 'inet '"
echo "   2. Update app/.env: EXPO_PUBLIC_API_BASE=http://YOUR_LAN_IP:3001"
echo "   3. Update server/.env CORS_ORIGINS to include your LAN IP"
echo ""