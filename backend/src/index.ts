import app from './app';
import { env } from './config/env';
import { checkDatabaseConnection } from './db/pool';

async function startServer() {
  const isDbConnected = await checkDatabaseConnection();
  if (isDbConnected) {
    console.log('[CampusPreloved Backend] Koneksi ke MySQL Laragon berhasil terhubung.');
  } else {
    console.warn('[CampusPreloved Backend] Peringatan: Tidak dapat terhubung ke MySQL.');
  }

  app.listen(env.PORT, () => {
    console.log(`[CampusPreloved Backend] Server berjalan di http://localhost:${env.PORT}`);
  });
}

startServer();
