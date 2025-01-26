import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ...existing code...

export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [react()],
});
