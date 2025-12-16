import { createServer } from 'http';
import app from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { verifyMailer } from './config/mailer.js';
import { logger } from './config/logger.js';
import { initSocket } from './socket/index.js';

async function bootstrap() {
  await connectDatabase();
  await verifyMailer();
  const server = createServer(app);
  initSocket(server);
  server.listen(env.port, () => {
    logger.info(`Server listening on port ${env.port}`);
  });
}

bootstrap().catch((err) => {
  logger.error({ err }, 'Fatal during bootstrap');
  process.exit(1);
});
