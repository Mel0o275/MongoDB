import path from 'path';
import { config } from 'dotenv';

const env = process.env.NODE_ENV || 'development';
const envPath = env === "development" ? path.resolve('.env.development') : path.resolve('.env.production');

config({ path: envPath });

export const PORT = process.env.PORT

export const MONGO_URI = process.env.MONGO_URI

export const DB_NAME = process.env.DB_NAME
