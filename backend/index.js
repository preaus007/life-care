import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './database/db.js';
import authRouters from './routes/auth.route.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use( cors({
    // origin: "https://hospital-web-frontend.vercel.app",
  origin: process.env.CLIENT_URL,
  credentials: true,
}) );
app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );
app.use( cookieParser() );

app.use( "/api/v1/auth", authRouters );

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();