import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  define: {
    global: {}, // 브라우저 환경에서 빈 global 객체 정의
  },
  server: {
    host: "0.0.0.0",
    port: 5174,
    strictPort: true,
    // 프록시 설정
    proxy: {
      "/api": {
        // target: "http://dojinss.cafe24.com/", // (port) 서버 주소
        target: "http://localhost:8080/", // (port) 서버 주소
        changeOrigin: true, // 요청헤더의 Host도 변경
        secure: false, // https 지원 여부
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/ws": {
        // target: "http://dojinss.cafe24.com/", // (port) 서버 주소
        target: "http://localhost:8080/", // (port) 서버 주소
        changeOrigin: true, // 요청헤더의 Host도 변경
        ws: true, // WebSocket을 위한 프록시 설정
        secure: false, // https 지원 여부
      },
    },
  },
  // logLevel: 'info'
});
