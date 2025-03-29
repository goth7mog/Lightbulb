import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',  // Allow connections from any IP
        port: 3000,       // Explicitly set port to 3000
        cors: true,      // Enable CORS for development server
        // proxy: {
        //     // Forward API requests to the Django backend
        //     '/api': {
        //         target: 'http://localhost:8001',
        //         changeOrigin: true,
        //         secure: false,
        //         rewrite: (path) => path.replace(/^\/api/, '/api'),
        //         configure: (proxy, _options) => {
        //             proxy.on('error', (err, _req, _res) => {
        //                 console.log('proxy error', err);
        //             });
        //             proxy.on('proxyReq', (proxyReq, req, _res) => {
        //                 console.log('Sending Request:', req.method, req.url);
        //             });
        //             proxy.on('proxyRes', (proxyRes, req, _res) => {
        //                 console.log('Received Response:', proxyRes.statusCode, req.url);
        //             });
        //         },
        //     }
        // }
    }
})
