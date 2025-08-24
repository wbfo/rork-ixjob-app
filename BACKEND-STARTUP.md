# Backend Server Startup Guide

## Quick Start

To fix the network connection errors in your frontend, run one of these commands:

### Option 1: Automatic Startup (Recommended)
```bash
node start-backend-auto.js
```

### Option 2: Direct TypeScript Execution
```bash
npx tsx app/api/[...trpc]+api.ts
```

### Option 3: Alternative Startup Scripts
```bash
node start-backend.js
# or
node start-server.js
```

## What This Does

The backend server provides:
- **REST API endpoints** at `http://localhost:3001/api/*`
- **tRPC endpoints** at `http://localhost:3001/api/trpc/*`
- **Health checks** at `http://localhost:3001/api/health` and `http://localhost:3001/api/ping`

## Troubleshooting

If you're still getting network errors:

1. **Check if server is running**: Visit `http://localhost:3001/api/ping` in your browser
2. **For mobile devices**: Update `app/.env` with your computer's IP:
   ```
   EXPO_PUBLIC_API_BASE=http://192.168.1.XXX:3001
   ```
3. **Install dependencies**: Run `npm install` if you get module errors
4. **Check firewall**: Make sure port 3001 is not blocked

## Server Endpoints

- `GET /api/health` - Health check
- `GET /api/ping` - Simple ping endpoint  
- `POST /api/trpc/*` - tRPC procedures
- `GET /api/trpc/*` - tRPC queries

## Success Indicators

When the server starts successfully, you should see:
- ✅ Server startup messages
- 📍 Server URLs displayed
- 🎉 "Your frontend should now be able to connect!" message

The network errors in your frontend app should disappear once the server is running.