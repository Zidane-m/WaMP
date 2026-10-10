import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

import { env } from './config/env';
import universitasRoutes from './routes/universitasRoutes';
import kategoriRoutes from './routes/kategoriRoutes';
import { notFoundHandler } from './middleware/notFoundHandler';
import { errorHandler } from './middleware/errorHandler';

const app: Application = express();

// Security & Core Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploads Directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root & API Welcome Endpoints
app.get(['/', '/api'], (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'CampusPreloved Backend API',
    status: 'online',
    version: '1.0.0',
    message: 'Server API CampusPreloved aktif dan siap menerima request',
    endpoints: {
      health: '/api/health',
      universitas: '/api/universitas',
      kategori: '/api/kategori',
      barang: '/api/barang'
    }
  });
});

// Health Check Endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'CampusPreloved API Server is running',
    timestamp: new Date().toISOString()
  });
});

// Master Data Routes
app.use('/api/universitas', universitasRoutes);
app.use('/api/kategori', kategoriRoutes);

// 404 & Centralized Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
