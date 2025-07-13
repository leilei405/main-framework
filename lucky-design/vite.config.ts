import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "http://localhost:3333/",
  server: {
    port: 3000,
    cors: true,
    origin: "http://localhost:3333",
  },
});
