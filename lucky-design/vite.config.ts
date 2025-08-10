import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "http://localhost:3333/",
  server: {
    port: 8080,
    cors: true,
    origin: "http://localhost:3333",
  },
});
