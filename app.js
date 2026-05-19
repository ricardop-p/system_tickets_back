import express from 'express';
import cors from 'cors';

import apiRoutes from './routes/index.js';
import { setupSwagger } from './config/swagger.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

export const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  setupSwagger(app);

  app.use('/api', apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;
