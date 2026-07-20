import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';
import resourceRoutes from './routes/resource.routes.js';
import { errorHandler, notFound } from './middlewares/error.middleware.js';

const app = express();
const defaultCorsOrigins = [
  'http://localhost:5173',
  'https://turing-ia-prueba-frontend-vxd8.vercel.app',
];
const corsOrigins = process.env.CORS_ORIGIN
  ?.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean) || defaultCorsOrigins;

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origen no permitido por CORS.'));
    },
  }),
);
app.use(express.json({ limit: '100kb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos. Intenta de nuevo más tarde.' },
});

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok', service: 'NexoTech API', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/resources', resourceRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
