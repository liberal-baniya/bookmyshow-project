// import path from "path";
// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite"; // Make sure to import defineConfig

// // https://vitejs.dev/config/
// export default defineConfig({
//    plugins: [react()],
//    resolve: {
//       alias: {
//          "@": path.resolve(__dirname, "./src"), // Use __dirname to resolve the path correctly
//       },
//    },
// });
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
