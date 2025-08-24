import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

// app will be mounted at /api
const app = new Hono();

// Enable CORS for all routes
app.use("*", cors());

// Add logger middleware
app.use("*", logger());

// Mount tRPC router at /trpc
app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
  })
);

// Simple health check endpoints
app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

app.get("/ping", (c) => {
  return c.text("pong");
});

app.get("/health", (c) => {
  return c.json({ status: "ok", message: "API is healthy" });
});

app.get("/ready", (c) => {
  return c.json({ status: "ok", message: "API is ready" });
});

// Add a catch-all route for debugging
app.all("*", (c) => {
  const path = c.req.path;
  const method = c.req.method;
  console.log(`Received ${method} request for ${path}`);
  return c.json({ 
    status: "not_found", 
    message: `No route found for ${method} ${path}`,
    timestamp: new Date().toISOString()
  }, 404);
});

export default app;