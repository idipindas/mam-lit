import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

// Export Vite config
export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl/cert.pem')),
    },
    host: 'localhost',
    port: 5173,
  }
});
