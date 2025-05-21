
// src/lib/dbConnect.ts
import mongoose from 'mongoose';

// This log will show up in your SERVER terminal when Next.js tries to load this module.
// Check your server terminal for this output.
const MONGODB_URI_FROM_ENV = process.env.MONGODB_URI;
console.log('--- [dbConnect] ---');
console.log('[dbConnect] Attempting to read MONGODB_URI from process.env.');
console.log('[dbConnect] Value of process.env.MONGODB_URI is:', MONGODB_URI_FROM_ENV);

const MONGODB_URI = MONGODB_URI_FROM_ENV;

if (!MONGODB_URI) {
  console.error('--- [dbConnect] CRITICAL ERROR ---');
  console.error('[dbConnect] MONGODB_URI environment variable is UNDEFINED or EMPTY.');
  console.error('[dbConnect] This means your Next.js server process cannot see the MONGODB_URI.');
  console.error('[dbConnect] Potential reasons:');
  console.error('  1. .env.local file is missing from the project root.');
  console.error('  2. .env.local file is in the wrong directory (must be in the project root, same level as package.json).');
  console.error('  3. .env.local file does not contain MONGODB_URI=your_connection_string');
  console.error('  4. There is a typo in MONGODB_URI or the connection string in .env.local.');
  console.error('  5. The Next.js development server was NOT RESTARTED after creating or modifying .env.local.');
  console.error('---');
  throw new Error(
    'CRITICAL: MONGODB_URI is not defined. Please check your .env.local file and restart your server. See server logs for details.'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    // console.log('[dbConnect] Using cached database connection.');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    // console.log('[dbConnect] Creating new database connection promise with URI:', MONGODB_URI.substring(0, 20) + '...'); // Log only a part of URI for security
    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
      // console.log('[dbConnect] MongoDB connected successfully.');
      return mongooseInstance;
    }).catch(err => {
      console.error('[dbConnect] MongoDB connection error during connect():', err.message);
      // Reset promise on error to allow retry
      cached.promise = null;
      throw err; // Re-throw error to be caught by services
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // If the promise was rejected, cached.conn will not be set.
    // The error is already logged by the promise catch block.
    // We throw it again so the caller knows the connection failed.
    throw error;
  }

  return cached.conn;
}

export default dbConnect;
