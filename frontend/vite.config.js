import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Bắt buộc để server có thể truy cập từ bên ngoài container Docker
    host: '0.0.0.0',
    port: 5173, // Đây là port bên trong container
    proxy: {
      // Proxy các yêu cầu API đến backend
      '/api': {
        target: 'http://backend:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
