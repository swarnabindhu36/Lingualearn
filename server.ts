import 'dotenv/config';
import express from 'express';
import { createServer, type Server } from 'node:http';
import path from 'path';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';

// Import Database & Error Middleware
import { db } from './server/db/database';
import { errorHandler, notFoundHandler } from './server/middleware/errorHandler';

// Import API routers
import authRoutes from './server/routes/auth-routes';
import userRoutes from './server/routes/user-routes';
import tutorRoutes from './server/routes/tutor-routes';
import conversationRoutes from './server/routes/conversation-routes';
import terminologyRoutes from './server/routes/terminology-routes';
import quizRoutes from './server/routes/quiz-routes';
import evaluationRoutes from './server/routes/evaluation-routes';
import adminRoutes from './server/routes/admin-routes';
import progressRoutes from './server/routes/progress-routes';

function getConfiguredPort() {
  const rawPort = process.env.PORT ?? '3000';
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error(`PORT must be an integer between 0 and 65535; received "${rawPort}"`);
  }

  return port;
}

function isAddressInUse(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'EADDRINUSE';
}

async function listenWithPortFallback(server: Server, startPort: number) {
  for (let port = startPort; port <= 65535; port += 1) {
    try {
      await new Promise<void>((resolve, reject) => {
        const onError = (error: Error) => reject(error);
        server.once('error', onError);

        try {
          server.listen(port, '0.0.0.0', () => {
            server.removeListener('error', onError);
            resolve();
          });
        } catch (error) {
          server.removeListener('error', onError);
          reject(error);
        }
      });

      if (port !== startPort) {
        console.warn(`Port ${startPort} is already in use; using port ${port} instead.`);
      }

      const address = server.address();
      if (!address || typeof address === 'string') {
        throw new Error('Unable to determine the server port after listening.');
      }
      return address.port;
    } catch (error) {
      if (!isAddressInUse(error) || port === 65535 || startPort === 0) {
        throw error;
      }
    }
  }

  throw new Error(`No available port found starting from ${startPort}.`);
}

async function startServer() {
  const app = express();

  // Body parser & Cookie parser middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Request logger in dev
  if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
      if (req.path.startsWith('/api')) {
        console.log(`[API] ${req.method} ${req.path}`);
      }
      next();
    });
  }

  // Health check endpoint (Section 20 requirement)
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      database: db.isReady(),
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
      service: 'LinguaLearn Multilingual AI API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount API routers FIRST
  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/tutor', tutorRoutes);
  app.use('/api/conversations', conversationRoutes);
  app.use('/api/terminology', terminologyRoutes);
  app.use('/api/quiz', quizRoutes);
  app.use('/api/evaluation', evaluationRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/progress', progressRoutes);

  // Fallback 404 for unknown /api/* routes
  app.use('/api/*', notFoundHandler);

  // Centralized Error Handling middleware (Section 17 requirement)
  app.use(errorHandler);

  // Vite Middleware / Static Serving
  if (process.env.NODE_ENV !== 'production') {
    const httpServer = createServer(app);
    const port = await listenWithPortFallback(httpServer, getConfiguredPort());
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true'
          ? false
          : { server: httpServer, port, clientPort: port },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log(`LinguaLearn server running on http://0.0.0.0:${port}`);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });

    const httpServer = createServer(app);
    const port = await listenWithPortFallback(httpServer, getConfiguredPort());
    console.log(`LinguaLearn server running on http://0.0.0.0:${port}`);
  }
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
