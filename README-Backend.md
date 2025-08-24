# ixJOB Backend Setup

This guide will help you set up the ixJOB backend server for local development and mobile device testing.

## Prerequisites

- Node.js 20+ installed
- PostgreSQL database running
- Git (optional)

## Quick Start

### Option A: Run Without Database (Fastest)

For quick testing without setting up a database:

```bash
cd server
npm install
npm run dev
```

The server will start on `http://localhost:3001` without database features.

### Option B: Full Setup with Database

#### 1. Install Dependencies

```bash
cd server
npm install
```

#### 2. Database Setup

Create a PostgreSQL database:
```bash
# Using psql
createdb ixjob_dev

# Or using PostgreSQL GUI tools like pgAdmin
```

#### 3. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` and uncomment/update the database connection:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ixjob_dev?schema=public"
```

#### 4. Database Migration

Generate Prisma client and run migrations:
```bash
npm run db:generate
npm run db:migrate
```

#### 5. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001` (or next available port) with full database features.

## Running Locally on Device (Expo Go)

To test the app on your mobile device using Expo Go:

### 1. Find Your LAN IP Address

**On macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**On Windows:**
```bash
ipconfig | findstr "IPv4"
```

Look for an IP like `192.168.1.100` or `10.0.0.100`.

### 2. Update Server CORS

In `server/.env`, add your LAN IP to CORS_ORIGINS:
```env
CORS_ORIGINS=http://localhost:19006,http://localhost:8081,http://192.168.1.100:8081,exp://192.168.1.100:8081
```

### 3. Update App Configuration

In the main app directory, create/update `app/.env`:
```env
EXPO_PUBLIC_API_BASE=http://192.168.1.100:3001
```

Replace `192.168.1.100` with your actual LAN IP.

### 4. Restart Both Servers

```bash
# In server directory
npm run dev

# In main app directory  
npm start
```

### 5. Test Connection

1. Open the app in Expo Go on your device
2. The app should automatically connect to your local server
3. Check the health endpoint: `http://YOUR_LAN_IP:3001/health`

## iOS ATS Configuration (Development)

For iOS development with HTTP (not HTTPS), you may need to configure App Transport Security.

Add to `app.json` under `ios.infoPlist`:
```json
{
  "ios": {
    "infoPlist": {
      "NSAppTransportSecurity": {
        "NSAllowsArbitraryLoads": true,
        "NSExceptionDomains": {
          "localhost": {
            "NSExceptionAllowsInsecureHTTPLoads": true
          },
          "192.168.1.100": {
            "NSExceptionAllowsInsecureHTTPLoads": true
          }
        }
      }
    }
  }
}
```

## Server Features

### Health Monitoring
- `GET /health` - Comprehensive health check
- `GET /ready` - Readiness probe
- `GET /ping` - Simple connectivity test

### Security Features
- CORS protection with dynamic origin detection
- Rate limiting (100 requests per 15 minutes)
- Helmet security headers
- Request body size limits (10MB)

### Development Features
- Auto port detection (increments if port taken)
- LAN IP auto-detection and logging
- Pretty error logging
- Database connection validation
- Environment variable validation

## Troubleshooting

### Database Connection Issues

1. **Check PostgreSQL is running:**
   ```bash
   pg_ctl status
   # or
   brew services list | grep postgresql
   ```

2. **Verify database exists:**
   ```bash
   psql -l | grep ixjob
   ```

3. **Test connection manually:**
   ```bash
   psql "postgresql://username:password@localhost:5432/ixjob_dev"
   ```

### Network Issues

1. **Check server is accessible:**
   ```bash
   curl http://localhost:3001/health
   curl http://YOUR_LAN_IP:3001/health
   ```

2. **Verify firewall settings:**
   - Ensure port 3001 is not blocked
   - Check if antivirus is blocking connections

3. **Test from mobile device browser:**
   - Open `http://YOUR_LAN_IP:3001/health` in mobile browser
   - Should return JSON health status

### Common Errors

**"Environment validation failed"**
- Check all required variables in `.env`
- Ensure JWT_SECRET is at least 32 characters

**"Database connection failed"**
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

**"CORS blocked origin"**
- Add your device's IP to CORS_ORIGINS
- Check EXPO_PUBLIC_API_BASE matches server IP

**"Network error - check if server is running"**
- Verify server is running on correct port
- Check firewall/antivirus settings
- Ensure mobile device is on same network

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use HTTPS endpoints
3. Configure proper CORS origins
4. Set strong JWT_SECRET
5. Use production database
6. Enable proper logging
7. Set up process manager (PM2, Docker, etc.)

## API Documentation

Once the server is running, API endpoints are available at:
- Base URL: `http://localhost:3001/api`
- Health: `http://localhost:3001/health`

The server automatically logs all available endpoints on startup.