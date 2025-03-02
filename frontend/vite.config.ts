import { AliasOptions, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from '@tailwindcss/vite'

const root = path.resolve(__dirname, "src");

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": root,
    } as AliasOptions,
  },
});
