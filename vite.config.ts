import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from "fs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    https: {
      key: fs.readFileSync("./ssl/localhost-key.pem"),
      cert: fs.readFileSync("./ssl/localhost.pem")
    }
  }
})
