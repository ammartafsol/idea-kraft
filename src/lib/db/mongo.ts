import "server-only";
import mongoose from "mongoose";

/**
 * One shared connection per server instance. In development, hot reloads would
 * otherwise open a new pool on every edit; on serverless, warm invocations
 * reuse the cached promise instead of reconnecting.
 */
type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const globalForMongo = globalThis as unknown as { __novaraMongo?: Cache };
const cache: Cache = (globalForMongo.__novaraMongo ??= { conn: null, promise: null });

export function isDatabaseConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set.");
  if (cache.conn) return cache.conn;
  cache.promise ??= mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 8000,
    maxPoolSize: 10,
  });
  try {
    cache.conn = await cache.promise;
  } catch (error) {
    cache.promise = null; // allow the next request to retry
    throw error;
  }
  return cache.conn;
}
