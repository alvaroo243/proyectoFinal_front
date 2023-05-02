import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import  {antdDayjs}  from "antd-dayjs-vite-plugin";

export default defineConfig({
  envDir: "./env/",
  envPrefix: "_",
  publicDir: "./public/",
  server: {
    port: 5004,
  },
  plugins: [react(), antdDayjs()],
});
