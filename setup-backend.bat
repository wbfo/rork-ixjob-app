@echo off
echo 🚀 Setting up ixJOB Backend Server...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 20+ first.
    echo    Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Navigate to server directory
if not exist server (
    echo ❌ Server directory not found
    pause
    exit /b 1
)

cd server

REM Install dependencies
echo 📦 Installing server dependencies...
npm install

REM Copy environment file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ⚠️  Please update DATABASE_URL in .env with your PostgreSQL credentials
) else (
    echo ✅ .env file already exists
)

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npx prisma generate

REM Run database migrations
echo 🗄️  Running database migrations...
npx prisma migrate dev --name init

echo.
echo 🎉 Backend setup complete!
echo.
echo 📋 Next steps:
echo    1. Update server/.env with your database credentials
echo    2. Start the server: cd server ^&^& npm run dev
echo    3. Update app/.env with your server URL
echo    4. Test connection: curl http://localhost:3001/health
echo.
echo 📱 For mobile device testing:
echo    1. Find your LAN IP: ipconfig
echo    2. Update app/.env: EXPO_PUBLIC_API_BASE=http://YOUR_LAN_IP:3001
echo    3. Update server/.env CORS_ORIGINS to include your LAN IP
echo.
pause