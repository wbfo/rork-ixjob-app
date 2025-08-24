# ixJOB Backend Server

This document provides instructions on how to start the backend server for the ixJOB application.

## Starting the Backend Server

You can start the backend server using the following command:

```bash
node start-backend-simple.js
```

This will start the Hono/tRPC server on port 3001.

## Troubleshooting

### Network Error: "Failed to fetch"

If you're seeing network connection errors in the Dev Tools:

1. **Start the backend server first**:
   ```bash
   node start-backend-simple.js
   ```

2. **Wait for the server to fully start** (you should see "Server started successfully!")

3. **Test the connection manually**:
   - Open http://localhost:3001/api/ping in your browser
   - You should see "pong" as the response

4. **Check your environment variables**:
   Make sure `app/.env` contains:
   ```
   EXPO_PUBLIC_API_BASE=http://localhost:3001
   EXPO_PUBLIC_RORK_API_BASE_URL=http://localhost:3001
   ```

### General Server Issues

If you encounter any issues starting the server, try the following steps:

1. Make sure you have all dependencies installed:
   ```bash
   npm install
   # or
   bun install
   ```

2. Make sure you have tsx installed:
   ```bash
   npm install tsx
   ```

3. Try running the server directly:
   ```bash
   npx tsx app/api/[...trpc]+api.ts
   ```

4. Check if port 3001 is available. If it's in use, you can change the port by setting the PORT environment variable:
   ```bash
   PORT=3002 node start-backend-simple.js
   ```

5. **For mobile devices**: Use your computer's IP address instead of localhost:
   ```
   EXPO_PUBLIC_API_BASE=http://192.168.1.XXX:3001
   ```
   Replace XXX with your actual IP address.

6. If you're still having issues, check the error messages for more details.

## API Endpoints

Once the server is running, the following endpoints will be available:

- **Base URL**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health
- **Ping**: http://localhost:3001/api/ping
- **tRPC**: http://localhost:3001/api/trpc

## Testing the Connection

You can test the connection to the backend server using the Dev Tools page in the app. Navigate to the Dev Tools page and click on "Test REST" or "Test tRPC" to verify that the backend server is running and accessible.

## Stopping the Server

To stop the server, press `Ctrl+C` in the terminal where the server is running.