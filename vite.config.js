import { resolve } from 'node:path';

export default {
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        es: resolve(__dirname, 'es/index.html')
      }
    }
  }
};
