import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Anjoy-jindie-web/',  // 👉 关键就是加上这一行，注意大小写和前后的斜杠
})