import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const port = Number(process.env.PORT || 4000);

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`NexoTech API disponible en http://localhost:${port}`);
  });
}

export default app;
